package org.torque.ai;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.StructuredMessage;
import com.anthropic.models.messages.StructuredMessageCreateParams;
import com.anthropic.models.messages.TextBlockParam;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

/**
 * one thin wrapper round the Claude client, so ClaudeMentor and SimLab aren't each repeating the same
 * builder chain. two things about this api worth writing down:
 *
 *   - the system prompt is its own field, not a first message, so it can't be overwritten by anything
 *     a student types. that matters most in SimLab, where the system prompt IS the safety gate
 *   - structured output takes the record itself and works the schema out from it, so unlike the last
 *     version there's no hand-written json schema sitting next to the record drifting out of step
 */
final class Claude {
    private final AnthropicClient client;
    private final String model;
    // long enough for a page of html, short enough to stay inside vercel's 120s proxy limit -- past
    // that the browser gets a router error instead of anything this code decided to send
    private static final Duration callTimeout = Duration.ofSeconds(90);

    Claude(String apiKey, String model) {
        // a cap on the whole call, and a bound on the retries. a call that never returns never throws,
        // so without these the catch blocks that are supposed to fall back to OfflineMentor never run
        // and the upload just spins
        this.client = AnthropicOkHttpClient.builder()
                .apiKey(apiKey)
                .timeout(callTimeout)
                .maxRetries(2)
                .build();
        this.model = model;
    }

    // plain text back. null if nothing usable came out
    String text(String systemInstruction, List<ContentBlockParam> input, int maxTokens) {
        Message out = client.messages().create(MessageCreateParams.builder()
                .model(model)
                .maxTokens(maxTokens)
                .system(systemInstruction)
                .addUserMessageOfBlockParams(input)
                .build());
        // there can be more than one text block, and thinking blocks in among them. only the text counts
        String answer = out.content().stream()
                .flatMap(block -> block.text().stream())
                .map(block -> block.text())
                .collect(Collectors.joining())
                .strip();
        return answer.isEmpty() ? null : answer;
    }

    // same thing, except the answer arrives already parsed into the record
    <T> T structured(String systemInstruction, List<ContentBlockParam> input, Class<T> type, int maxTokens) {
        // outputConfig goes last on purpose: it swaps the builder for the typed one, and everything
        // after it has to be called on that
        StructuredMessageCreateParams<T> params = MessageCreateParams.builder()
                .model(model)
                .maxTokens(maxTokens)
                .system(systemInstruction)
                .addUserMessageOfBlockParams(input)
                .outputConfig(type)
                .build();
        StructuredMessage<T> out = client.messages().create(params);
        return out.content().stream()
                .flatMap(block -> block.text().stream())
                .map(block -> block.text())
                .findFirst()
                .orElse(null);
    }

    // just text, which is most calls
    static List<ContentBlockParam> ask(String prompt) {
        return List.of(ContentBlockParam.ofText(TextBlockParam.builder().text(prompt).build()));
    }

    // no thinking setting anywhere in here on purpose. this model thinks by default and can't be told
    // not to -- sending a thinking config or a token budget is a 400. thinking also isn't charged
    // against maxTokens, so the budget can't be eaten before the answer starts, which is exactly what
    // broke the last version. if thinking ever needs reining in it's .outputConfig(OutputConfig
    // .builder().effort(LOW)) on the plain calls, but that field is also where structured output keeps
    // its schema, so it can't just be bolted onto structured() without checking what it overwrites
}
