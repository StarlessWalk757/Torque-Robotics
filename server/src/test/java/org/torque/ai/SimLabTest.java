package org.torque.ai;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

// tests for layer 4 only, which is the half that can actually be tested -- it's pure string work with
// no model and no network, so the same input always gives the same answer
// the prompt layers can't be unit tested, which is precisely why nothing important rests on them
class SimLabTest {

    private static final String goodPage = "<html><head></head><body><svg width='10' height='10'></svg>"
            + "<script>let gearRatio = 2;</script></body></html>";

    @Test
    void acceptsASelfContainedPage() {
        assertFalse(SimLab.unsafe(goodPage));
    }

    @Test
    void rejectsAnythingThatReachesTheNetwork() {
        for (String bad : new String[] {
                "<html><body><script>fetch('/api/secret')</script></body></html>",
                "<html><body><script>new WebSocket('ws://x')</script></body></html>",
                "<html><body><img src=\"https://example.com/a.png\"></body></html>",
                "<html><body><script src=\"//cdn.example.com/x.js\"></script></body></html>",
                "<html><body><script>new XMLHttpRequest()</script></body></html>",
        }) {
            assertTrue(SimLab.unsafe(bad), "should have been rejected: " + bad);
        }
    }

    @Test
    void rejectsAnythingThatTouchesTheStudentOrThePage() {
        for (String bad : new String[] {
                "<html><body><script>document.cookie</script></body></html>",
                "<html><body><script>localStorage.setItem('a','b')</script></body></html>",
                "<html><body><script>window.parent.location = 'x'</script></body></html>",
                "<html><body><script>postMessage('hi','*')</script></body></html>",
                "<html><body><iframe></iframe></body></html>",
                "<html><body><form action='x'></form></body></html>",
        }) {
            assertTrue(SimLab.unsafe(bad), "should have been rejected: " + bad);
        }
    }

    // this one cost a working gear train sim in production: the model wrote the xmlns on its <svg>,
    // that string contains http://, and the whole page got thrown away by the url check
    @Test
    void keepsAnSvgThatCarriesItsNamespace() {
        assertFalse(SimLab.unsafe("<html><body><svg xmlns=\"http://www.w3.org/2000/svg\" width='10'></svg></body></html>"));
        assertFalse(SimLab.unsafe("<html><body><svg xmlns:xlink=\"http://www.w3.org/1999/xlink\"></svg></body></html>"));
    }

    // and the exemption has to stay exactly that narrow -- a real address beside the namespace is still a no
    @Test
    void stillRejectsRealUrlsNextToTheNamespace() {
        assertTrue(SimLab.unsafe("<html><body><svg xmlns=\"http://www.w3.org/2000/svg\"></svg>"
                + "<img src=\"https://example.com/a.png\"></body></html>"));
        assertTrue(SimLab.unsafe("<html><body><svg xmlns=\"http://www.w3.org/2000/svg\"></svg>"
                + "<script>fetch(\"http://evil.test\")</script></body></html>"));
    }

    @Test
    void rejectsJunkAndGiantPages() {
        assertTrue(SimLab.unsafe("Sorry, I can't help with that.")); // answered in prose instead of html
        assertTrue(SimLab.unsafe("<html><body>" + "x".repeat(60_001) + "</body></html>"));
    }

    @Test
    void addsItsOwnContentSecurityPolicy() {
        String hard = SimLab.harden(goodPage);
        assertTrue(hard.contains("default-src 'none'"), "the page must carry its own CSP");
        assertTrue(hard.indexOf("Content-Security-Policy") < hard.indexOf("<body"), "the CSP goes in the head");
        assertTrue(SimLab.harden("<svg></svg>").startsWith("<meta"), "a page with no head still gets one");
    }

    // guards the list itself. if a lesson is ever added or dropped, this fails and makes someone decide
    // on purpose whether the simulation lab should cover it
    @Test
    void everyAllowedTopicIsSomethingTheCourseTeaches() {
        assertEquals(17, SimLab.topics.size(), "one allowed topic per lesson");
        assertTrue(SimLab.topics.stream().anyMatch(t -> t.startsWith("gears:")));
        assertTrue(SimLab.topics.stream().noneMatch(t -> t.toLowerCase().contains("chemistry")));
    }
}
