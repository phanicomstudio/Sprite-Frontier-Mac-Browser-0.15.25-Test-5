/* MAINTAINER GUIDE
 * Deterministic local ask-about parser. Normalizes text and matches authored aliases; it never evaluates commands or calls AI. Exact matches beat whole-word phrases, and optional switches gate topics.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(function(root){
'use strict'  ;
  const normalize=text=>String(text).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim();
// Validate and normalize topic/profile metadata once before use; invalid authoring must fail before runtime execution.
  function compile(topics){
    if(!Array.isArray(topics)||topics.length>200)throw Error('At most 200 topics.');
    return topics.map(topic=>{
      if(!topic||typeof topic.answer!=='string'||topic.answer.length>4000||!Array.isArray(topic.aliases)||topic.aliases.length>40||topic.aliases.some(a=>typeof a!=='string'||a.length>160)||topic.switch!==undefined&&(typeof topic.switch!=='string'||!/^[A-Za-z0-9_-]{1,60}$/.test(topic.switch)))throw Error('Invalid topic.');
      return {
        ...topic,aliases:topic.aliases.map(normalize).filter(Boolean)
      }
      ;
    }
    );
  }
// Match normalized user text against visible aliases, preferring exact then longest whole-word matches.
  function ask(input,topics,state={
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
