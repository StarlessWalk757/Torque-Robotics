package org.torque.ai;

import com.anthropic.models.messages.Base64ImageSource;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.ImageBlockParam;
import com.anthropic.models.messages.TextBlockParam;
import org.torque.cad.Grader;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

/**
 * the mentor, with Claude behind it.
 *
 * one rule holds this whole file together: every way out leads to OfflineMentor. unreachable, refused,
 * answer in the wrong shape, no answer at all -- all of them end in real feedback rather than an error.
 * grading is pure measurement and never needed the model, and this is what keeps that true.
 */
public class ClaudeMentor implements MentorAi {
    private final Claude claude;
    private final OfflineMentor fallback = new OfflineMentor(); // held permanently, not built on failure

    public ClaudeMentor(String apiKey, String model) {
        this.claude = new Claude(apiKey, model);
    }

    @Override
    public boolean isLive() {
        return true;
    }

    // the shape the model fills in. separate from CadReview because that one also records WHICH mentor
    // wrote it, and the model obviously can't be trusted to fill that in about itself
    record ReviewOut(String summary, List<String> strengths, List<CadReview.Fix> fixes, String principle,
                     int designScore, String designRationale) {}

    @Override
    public CadReview reviewCad(CadContext ctx) {
        try {
            ReviewOut r = claude.structured(Prompts.cadSystem, reviewInput(ctx), ReviewOut.class, 8_000);
            if (r == null) return fallback.reviewCad(ctx);
            return new CadReview(r.summary(), nz(r.strengths()), nz(r.fixes()), r.principle(), r.designScore(),
                    r.designRationale() == null ? "" : r.designRationale(), "claude");
        } catch (RuntimeException e) {
            System.err.println("Torque: CAD review fell back to offline mode: " + e);
            return fallback.reviewCad(ctx);
        }
    }

    // text first, then the screenshots. the docs recommend that order, and it also means the
    // measurements are established before any picture gets a chance to suggest otherwise
    List<ContentBlockParam> reviewInput(CadContext ctx) {
        List<ContentBlockParam> parts = new ArrayList<>();
        parts.add(ContentBlockParam.ofText(TextBlockParam.builder().text(Prompts.cadRequest(ctx)).build()));
        for (Grader.Image img : ctx.images()) {
            parts.add(ContentBlockParam.ofImage(ImageBlockParam.builder()
                    .source(Base64ImageSource.builder()
                            .data(Base64.getEncoder().encodeToString(img.data()))
                            .mediaType(imageType(img.mediaType()))
                            .build())
                    .build()));
        }
        return parts;
    }

    // CadController already proved the type from the file's first bytes, so this is only a mapping.
    // png is the default because a screenshot that got this far is png far more often than not
    private static Base64ImageSource.MediaType imageType(String mediaType) {
        return switch (mediaType) {
            case "image/jpeg" -> Base64ImageSource.MediaType.IMAGE_JPEG;
            case "image/gif" -> Base64ImageSource.MediaType.IMAGE_GIF;
            case "image/webp" -> Base64ImageSource.MediaType.IMAGE_WEBP;
            default -> Base64ImageSource.MediaType.IMAGE_PNG;
        };
    }

    // null -> empty list. an optional field can come back missing, and the web app shouldn't have to
    // null check every array it's handed
    private static <T> List<T> nz(List<T> xs) {
        return xs == null ? List.of() : xs;
    }
}
