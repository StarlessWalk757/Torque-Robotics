package org.torque.cad;

/**
 * one measured requirement off a brief. expected is what was asked for ("Ø3.4 ± 0.1 mm"), measured is
 * what the file actually had ("Ø3.39 mm"), fix is what to change in Onshape -- blank when it passed,
 * since there's nothing to fix
 */
public record Check(String id, String label, boolean passed, int earned, int points, String expected, String measured, String fix) {

    // all or nothing per check. no partial credit, so a measurement can't be argued with
    static Check of(String id, String label, boolean passed, int points, String expected, String measured, String fix) {
        return new Check(id, label, passed, passed ? points : 0, points, expected, measured, passed ? "" : fix);
    }
}
