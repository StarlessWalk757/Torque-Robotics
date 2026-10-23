package org.torque.api;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.torque.cad.CadProject;
import org.torque.cad.GradeResult;
import org.torque.cad.Grader;
import org.torque.cad.ProjectCatalog;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

// the upload endpoint. every limit here is checked again even though the browser checks them too,
// because the browser's checks are a courtesy -- nothing stops someone posting straight to this url
@RestController
public class CadController {
    static final int maxImages = 3;
    static final long maxImageBytes = 5L * 1024 * 1024;
    static final int maxNotes = 2000;

    private final ProjectCatalog catalog;
    private final Grader grader;
    private final RateLimiter limiter;

    public CadController(ProjectCatalog catalog, Grader grader, RateLimiter limiter) {
        this.catalog = catalog;
        this.grader = grader;
        this.limiter = limiter;
    }

    @GetMapping("/api/cad/projects")
    List<CadProject> projects() {
        return catalog.all();
    }

    @PostMapping("/api/cad/grade")
    GradeResult grade(@RequestParam("projectId") String projectId,
                      @RequestParam("stl") MultipartFile stl,
                      @RequestParam(value = "images", required = false) List<MultipartFile> images,
                      @RequestParam(value = "notes", required = false) String notes,
                      HttpServletRequest request) throws IOException {
        CadProject project = catalog.find(projectId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "That project doesn't exist."));
        if (stl.isEmpty()) throw new ApiException(HttpStatus.BAD_REQUEST, "Choose an STL file to upload.");
        // only a courtesy check -- the parser works off the bytes, not the name. this just gives a
        // clearer message than letting it fail deeper in
        String name = stl.getOriginalFilename() == null ? "" : stl.getOriginalFilename().toLowerCase();
        if (!name.isEmpty() && !name.endsWith(".stl")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Upload an .stl file. In Onshape: right-click the part → Export → Format: STL.");
        }
        List<Grader.Image> pics = new ArrayList<>();
        if (images != null) {
            for (MultipartFile f : images) {
                if (f.isEmpty()) continue;
                if (pics.size() == maxImages) throw new ApiException(HttpStatus.BAD_REQUEST, "Attach at most 3 screenshots.");
                if (f.getSize() > maxImageBytes) throw new ApiException(HttpStatus.BAD_REQUEST, "Each screenshot must be under 5 MB.");
                byte[] data = f.getBytes();
                String type = imageType(data);
                if (type == null) throw new ApiException(HttpStatus.BAD_REQUEST, "Screenshots must be PNG, JPEG, GIF or WebP images.");
                pics.add(new Grader.Image(type, data));
            }
        }
        // trimmed rather than rejected. the notes are optional context, not worth failing an upload over
        if (notes != null && notes.length() > maxNotes) notes = notes.substring(0, maxNotes);
        limiter.check(request.getRemoteAddr()); // last, so a bad request doesn't burn someone's quota
        return grader.grade(project, stl.getBytes(), pics, notes);
    }

    // works out the type from the first few bytes (the magic number), not the file extension. anyone can
    // rename anything to .png, and these bytes are what the format actually requires
    static String imageType(byte[] d) {
        if (d.length > 8 && (d[0] & 0xff) == 0x89 && d[1] == 'P' && d[2] == 'N' && d[3] == 'G') return "image/png";
        if (d.length > 3 && (d[0] & 0xff) == 0xFF && (d[1] & 0xff) == 0xD8 && (d[2] & 0xff) == 0xFF) return "image/jpeg";
        if (d.length > 6 && d[0] == 'G' && d[1] == 'I' && d[2] == 'F' && d[3] == '8') return "image/gif";
        if (d.length > 12 && d[0] == 'R' && d[1] == 'I' && d[2] == 'F' && d[3] == 'F' && d[8] == 'W' && d[9] == 'E' && d[10] == 'B' && d[11] == 'P') return "image/webp";
        return null;
    }
}
