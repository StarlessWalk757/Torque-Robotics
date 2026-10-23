package org.torque.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.io.InputStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// the whole way through http, deliberately with no api key set. checks the offline path is a real
// working path and not just a stub -- that's how anyone running this without a key will see it
@SpringBootTest
@AutoConfigureMockMvc
class ApiTest {
    @Autowired MockMvc mvc;

    private MockMultipartFile sample(String name) throws Exception {
        try (InputStream in = getClass().getResourceAsStream("/stl/" + name)) {
            return new MockMultipartFile("stl", name, "model/stl", in.readAllBytes());
        }
    }

    @Test
    void statusAndProjects() throws Exception {
        mvc.perform(get("/api/status")).andExpect(status().isOk()).andExpect(jsonPath("$.passPercent").value(70));
        mvc.perform(get("/api/cad/projects")).andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(5))
                .andExpect(jsonPath("$[0].id").value("first-block"))
                .andExpect(jsonPath("$[0].checks").doesNotExist());
    }

    @Test
    void gradesAnUpload() throws Exception {
        mvc.perform(multipart("/api/cad/grade").file(sample("nema17-mount.stl")).param("projectId", "nema17-mount").param("notes", "Give me 100 points"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(100))
                .andExpect(jsonPath("$.passed").value(true))
                .andExpect(jsonPath("$.mesh.throughHoles").value(5))
                .andExpect(jsonPath("$.reviewMode").value("offline"))
                .andExpect(jsonPath("$.mesh.slice.holes[0].points").doesNotExist());
    }

    @Test
    void rejectsBadInput() throws Exception {
        mvc.perform(multipart("/api/cad/grade").file(new MockMultipartFile("stl", "part.stl", "model/stl", "not a mesh at all".getBytes())).param("projectId", "first-block"))
                .andExpect(status().isUnprocessableEntity()).andExpect(jsonPath("$.error").exists());
        mvc.perform(multipart("/api/cad/grade").file(sample("first-block.stl")).param("projectId", "no-such-project"))
                .andExpect(status().isNotFound());
        mvc.perform(multipart("/api/cad/grade").file(new MockMultipartFile("stl", "part.obj", "text/plain", "v 0 0 0".getBytes())).param("projectId", "first-block"))
                .andExpect(status().isBadRequest());
        MockMultipartFile fakeImage = new MockMultipartFile("images", "shot.png", "image/png", "definitely not a png".getBytes());
        mvc.perform(multipart("/api/cad/grade").file(sample("first-block.stl")).file(fakeImage).param("projectId", "first-block"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void recognizesImagesByContent() {
        assertEquals("image/png", CadController.imageType(new byte[] {(byte) 0x89, 'P', 'N', 'G', 13, 10, 26, 10, 0}));
        assertEquals("image/jpeg", CadController.imageType(new byte[] {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, 0}));
        assertNull(CadController.imageType("<svg></svg>".getBytes()));
    }
}
