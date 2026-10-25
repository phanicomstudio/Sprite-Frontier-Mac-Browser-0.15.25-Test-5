/* MAINTAINER GUIDE
 * Deterministic local ask-about parser. Normalizes text and matches authored aliases; it never evaluates commands or calls AI. Exact matches beat whole-word phrases, and optional switches gate topics.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(/* @function parser.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier parser. */ function(root){
'use strict'  ;
  const normalize=/* @function parser.normalize.2 — Returns string using text normalize using "NFKC" to lower case using replace using /[^\p{L}\p{N}\s]/gu, " " replace using /\s+/g, " " trim using . Inputs: text. Uses: string using text normalize using "NFKC" to lower case using replace using /[^\p{L}\p{N}\s]/gu, " " replace using /\s+/g, " " trim; string using text normalize using "NFKC" to lower case using replace using /[^\p{L}\p{N}\s]/gu, " " replace; string using text normalize using "NFKC" to lower case using replace; string using text normalize using "NFKC" to lower case. Returns: string using text normalize using "NFKC" to lower case using replace using /[^\p{L}\p{N}\s]/gu, " " replace using /\s+/g, " " trim using . */ text=>String(text).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim();
// Validate and normalize topic/profile metadata once before use; invalid authoring must fail before runtime execution.
  /* @function parser.compile.3 — Validate and normalize topic/profile metadata once before use; invalid authoring must fail before runtime execution. Inputs: topics. Uses: array is array; error; topics map. Returns: topics map using a callback. */ function compile(topics){
    if(!Array.isArray(topics)||topics.length>200)throw Error('At most 200 topics.');
    return topics.map(/* @function parser.callback.4 — Provides the callback for topics map. Inputs: topic. Uses: array is array; topic aliases some; /^[A-Za-z0-9_-]{1,60}$/ test; error. Returns: a record containing copied fields, aliases. */ topic=>{
      if(!topic||typeof topic.answer!=='string'||topic.answer.length>4000||!Array.isArray(topic.aliases)||topic.aliases.length>40||topic.aliases.some(/* @function parser.callback.5 — Returns typeof a does not equal "string" or a length is greater than 160. Inputs: a. Returns: typeof a does not equal "string" or a length is greater than 160. */ a=>typeof a!=='string'||a.length>160)||topic.switch!==undefined&&(typeof topic.switch!=='string'||!/^[A-Za-z0-9_-]{1,60}$/.test(topic.switch)))throw Error('Invalid topic.');
      return {
        ...topic,aliases:topic.aliases.map(normalize).filter(Boolean)
      }
      ;
    }
    );
  }
// Match normalized user text against visible aliases, preferring exact then longest whole-word matches.
  /* @function parser.ask.6 — Match normalized user text against visible aliases, preferring exact then longest whole-word matches. Inputs: input; topics; assignment pattern. Updates: score; best. Uses: normalize using input replace; normalize; state switches get; " " plus query plus " " includes. Returns: "What would you like to ask about?"; chain or "I don't know anything about that. Try another subject.". */ function ask(input,topics,state={
  }
  ){
    const query=normalize(input).replace(/^(ask (you )?about |tell me about |what is |who is |where is )/,'');
    if(!query)return 'What would you like to ask about?';
    let best=null,score=0;
    for(const topic of topics){
      if(topic.switch&&state.switches?.get(topic.switch)!==true)continue;
      for(const alias of topic.aliases){
        const exact=query===alias,words=(' '+query+' ').includes(' '+alias+' '),value=exact?10000+alias.length:words?alias.length:0;
        if(value>score){
          score=value;
          best=topic;
        }
      }
    }
    return best?.answer||"I don't know anything about that. Try another subject.";
  }
  root.FrontierParser={
    normalize,compile,ask
  }
  ;
}
)(window);

