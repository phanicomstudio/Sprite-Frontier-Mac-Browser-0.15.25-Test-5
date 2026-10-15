/* MAINTAINER GUIDE
 * Deterministic local ask-about parser. Normalizes text and matches authored aliases; it never evaluates commands or calls AI. Exact matches beat whole-word phrases, and optional switches gate topics.
 * See docs/CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function parser.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier parser. */
(/* @function parser.installReviewed — Installs deterministic local ask-about parsing. Text normalization/alias matching prioritize exact then whole-word phrases with optional switch gates; this is not command evaluation or an AI/network call. Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  "use strict";
  const normalize =
    /* Historical contract retained; October 14 reviewed explanation follows. @function parser.normalize.2 — Returns string using text normalize using "NFKC" to lower case using replace using /[^\p{L}\p{N}\s]/gu, " " replace using /\s+/g, " " trim using . Inputs: text. Uses: string using text normalize using "NFKC" to lower case using replace using /[^\p{L}\p{N}\s]/gu, " " replace using /\s+/g, " " trim; string using text normalize using "NFKC" to lower case using replace using /[^\p{L}\p{N}\s]/gu, " " replace; string using text normalize using "NFKC" to lower case using replace; string using text normalize using "NFKC" to lower case. Returns: string using text normalize using "NFKC" to lower case using replace using /[^\p{L}\p{N}\s]/gu, " " replace using /\s+/g, " " trim using . */
  /* @function parser.reviewednormalize_2 — Normalizes local dialogue query text. Inputs: any text coercible to string. Returns NFKC lowercase string with punctuation replaced by spaces and whitespace collapsed/trimmed, preserving Unicode letters/numbers. No evaluation/network/state mutation; custom string coercion errors propagate. */ (
      text,
    ) =>
      String(text)
        .normalize("NFKC")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
  // Validate and normalize topic/profile metadata once before use; invalid authoring must fail before runtime execution.
  /* Historical contract retained; October 14 reviewed explanation follows. @function parser.compile.3 — Validate and normalize topic/profile metadata once before use; invalid authoring must fail before runtime execution. Inputs: topics. Uses: array is array; error; topics map. Returns: topics map using a callback. */
  /* @function parser.reviewedcompile_3 — Validates authored dialogue topics once. Inputs: array at most200 topics. Returns new topic records with normalized nonempty aliases; validates answer<=4000 characters, at most40 aliases each<=160 and optional ASCII switch ID1-60. Unknown topic fields retained shallowly; invalid records throw and no authored mutation. */ function compile(
    topics,
  ) {
    if (!Array.isArray(topics) || topics.length > 200)
      throw Error("At most 200 topics.");
    return topics.map(
      /* Historical contract retained; October 14 reviewed explanation follows. @function parser.callback.4 — Provides the callback for topics map. Inputs: topic. Uses: array is array; topic aliases some; /^[A-Za-z0-9_-]{1,60}$/ test; error. Returns: a record containing copied fields, aliases. */
  /* @function parser.reviewedcallback_4 — Validates/copies one dialogue topic. Inputs: topic. Returns record with normalized aliases or throws on invalid answer/aliases/switch. No runtime response execution; nested unknown metadata remains shared. */ (
        topic,
      ) => {
        if (
          !topic ||
          typeof topic.answer !== "string" ||
          topic.answer.length > 4000 ||
          !Array.isArray(topic.aliases) ||
          topic.aliases.length > 40 ||
          topic.aliases.some(
            /* Historical contract retained; October 14 reviewed explanation follows. @function parser.callback.5 — Returns typeof a does not equal "string" or a length is greater than 160. Inputs: a. Returns: typeof a does not equal "string" or a length is greater than 160. */
  /* @function parser.reviewedcallback_5 — Detects invalid authored alias. Inputs: a. Returns true unless string length<=160; empty aliases accepted then removed by normalized filter. No mutation. */ (
              a,
            ) => typeof a !== "string" || a.length > 160,
          ) ||
          (topic.switch !== undefined &&
            (typeof topic.switch !== "string" ||
              !/^[A-Za-z0-9_-]{1,60}$/.test(topic.switch)))
        )
          throw Error("Invalid topic.");
        return {
          ...topic,
          aliases: topic.aliases.map(normalize).filter(Boolean),
        };
      },
    );
  }
  // Match normalized user text against visible aliases, preferring exact then longest whole-word matches.
  /* Historical contract retained; October 14 reviewed explanation follows. @function parser.ask.6 — Match normalized user text against visible aliases, preferring exact then longest whole-word matches. Inputs: input; topics; assignment pattern. Updates: score; best. Uses: normalize using input replace; normalize; state switches get; " " plus query plus " " includes. Returns: "What would you like to ask about?"; chain or "I don't know anything about that. Try another subject.". */
  /* @function parser.reviewedask_6 — Answers a local ask-about query from compiled authored topics. Inputs: input text, compiled topics and optional state.switches Map. Returns authored answer or readable empty/unknown response. Strips supported request prefixes, gates switches on true, prioritizes exact aliases then longest whole-word alias; equal scores keep first topic. Empty answer falls back unknown. No AI/network/command execution or state mutation. */ function ask(
    input,
    topics,
    state = {},
  ) {
    const query = normalize(input).replace(
      /^(ask (you )?about |tell me about |what is |who is |where is )/,
      "",
    );
    if (!query) return "What would you like to ask about?";
    let best = null,
      score = 0;
    for (const topic of topics) {
      if (topic.switch && state.switches?.get(topic.switch) !== true) continue;
      for (const alias of topic.aliases) {
        const exact = query === alias,
          words = (" " + query + " ").includes(" " + alias + " "),
          value = exact ? 10000 + alias.length : words ? alias.length : 0;
        if (value > score) {
          score = value;
          best = topic;
        }
      }
    }
    return (
      best?.answer || "I don't know anything about that. Try another subject."
    );
  }
  root.FrontierParser = {
    normalize,
    compile,
    ask,
  };
})(window);
