/*
  MaxAndP5js (c) 2016-21, Paweł Janicki (https://paweljanicki.jp)
      a simple messaging system between patches created in MaxMSP
      (https://cycling74.com) and sketches written with P5*js
      (https://p5js.org).

  P5js sketch (as any HTML/JavaScript document loaded inside jweb) can
  communicate with Max. Max can call functions from P5js sketches. P5js
  sketch can read/write content of Max dictionaries and send messages to Max.

  However, there is a namespace conflict between Max API binded to the
  "window" object (accessible from within jweb) and P5js API binded by
  default to the same object (in so called "global mode").

  There are several methods to circumvent this problem, and one of the
  simpler ones (requiring editing only the "sketch.js" file) is using P5js in
  so called "instance mode". Look at the code in the "sketch.js" file attached 
  to this example to see how to prevent the namespaces conflict and how to
  effectively interact with P5js sketches inside jweb object.

  For more informations about differences between "global" and "instance"
  modes of the P5js look at the "p5.js overview" document (available at
  https://github.com/processing/p5.js/wiki/p5.js-overview). For more
  information about communication between Max patcher and content loaded jweb
  object check the "Communicating with Max from within jweb" document (part
  of Max documentation).
*/

// *************************************************************************

/*
  This is a basic helper function checking if the P5js sketch is loaded inside
  Max jweb object.
*/
function detectMax() {
  try {
    /*
      For references to all functions attached to window.max object read the
      "Communicating with Max from within jweb" document from Max documentation.
    */
    window.max.outlet('Hello Max!');
    return true;
  }
  catch(e) {
    console.log('Max, where are you?');
  }
  return false;
}

/*
  Here we are creating actual P5js sketch in the instance mode
  (look at https://github.com/processing/p5.js/wiki/p5.js-overview
  for details about P5js instantiation and namespace) to prevent
  binding P5js functions and variables to the "window" object. Thanks
  of that we can avoid namespaces conflict between Max and P5js.
*/
let s = function(p) {

  // let's test and memorize if the sketch is loaded inside Max jweb object
  const maxIsDetected = detectMax();

  /*
    We will be using the RiTa library (https://rednoise.org/rita/) for p5js
    in this example (the library is imported in index.html). RiTa is a
    free/open-source library for writing in programmable media. It provides
    functions for simple language processing and generation without the
    overhead of a full NLP or machine-learning stack. This example is using
    a small fraction of the RiTa's set of features (nevertheless, it can be
    easily expanded if necessary).
  */
  let ritaMarkovModel;
  let ritaMarkovModelInfo={
    numberOfLearnedSentences: 0,
    numberOfProcessedWords: 0,
    nFactor: 4 // n-factor - the length of each n-gram stored in the model
  };

  /*
    Use windowResized function to adopt canvas size to the current size of
    the browser. It is particularly important when sketch is loaded inside
    the Max jweb object, which may be dynamically resized by the user.
  */
  p.windowResized = function() {p.resizeCanvas(innerWidth, innerHeight);}

  p.setup=function(){
    p.createCanvas(innerWidth, innerHeight);
    /*
      The n-factor (the length of each n-gram stored in the RiTa markov model)
      is passed via URL Parameters - this makes sense, because after changing
      the n-factor value, you have to build the model from scratch, which is
      easiest to do by simply reloading the sketch. The n-factor should be an
      integer value > 0.

      Typical values for n-factor are 3 or 4. Lower values produces less correct,
      more "slurred" structures, higher values they make the model less creative
      by approaching just quoting the sentences learned.
    */
    let params = p.getURLParams();
    if(params===null){
      p.consoleLog('setup: no n-factor provided via URL params');
    }else{
      let nfactor=parseInt(params.nfactor);
      if(isNaN(nfactor)){
        p.consoleLog('setup: provided n-factor is NaN');
      }else{
        nfactor=Math.floor(nfactor);
        if(nfactor<1){
          p.consoleLog('setup: provided n-factor < 1');
        }else{
          ritaMarkovModelInfo.nFactor=nfactor;
        }
      }
    }
    ritaMarkovModel=RiTa.markov(ritaMarkovModelInfo.nFactor);
    p.consoleLog('setup: new markov model with n-factor '+ritaMarkovModelInfo.nFactor+' created');
    /*
      If the sketch is loaded inside Max jweb object we will carry out
      the necessary tasks to establish communitation between the patcher
      and the sketch (and to tune the sketch itself to present itself
      correctly when operating inside the jweb.
    */
    if(maxIsDetected) {
      // remove unwanted scroll bar
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
      /*
        Bind functions, which we want to have available from patcher's
        level. For more information check the "Communicating with Max from
        within jweb" document (part of Max documentation).

        "getword" wraps RiTa "randomWord" method. It allows to hatch a random
        word from the lexicon.
      */
      window.max.bindInlet('getword', function(){
        let word = RiTa.randomWord();
        if(word===null){p.consoleLog('getword: word is null'); return;}
        if(word.length<1){p.consoleLog('getword: word length < 1'); return;}
        window.max.outlet('[word]',word);
      });
      /*
        "getrhymes" wraps RiTa "rhymes" method. It allows to hatch rhymes for
        the given word from lexicon. There is also _maxResults parameter
        available to define the maximum number of rhymes returned by the function.
      */
      window.max.bindInlet('getrhymes', function(_maxResults, _word){
        if(isNaN(_maxResults)){p.consoleLog('getrhymes: max number of results (first parameter) is NaN'); return;}
        if(_maxResults<1){p.consoleLog('getrhymes: length is < 1'); return;}
        if(_word===null){p.consoleLog('getrhymes: word is null'); return;}
        if(_word.length<1){p.consoleLog('getrhymes: word length < 1'); return;}
        let rhymes = RiTa.rhymes(_word,{limit:_maxResults});
        if(rhymes===null){p.consoleLog('getrhymes: rhymes===null'); return;}
        window.max.outlet('[rhymes]',_word,rhymes.join(' '));
      });
      /*
        "getsentence" wraps RiTa.markovModel "generate" method. It allows to build
        a sentence based on the content of the markov model (first you have to train
        the model on the texts you choose).
        
        If a single parameter is provided it is treated as a desired legth of the
        sentence (minimum length is 1). The value is scaled in "subsentences" (chains
        of words that form closed structures, however when the length is > 1
        subsequent "subsentences" may correspond to the previous ones).
        
        If two or more parameters are provided the first one is treated as a desired
        length of the sentence and the remaininng as a word or string of words with
        which to start the generated sequence (in RiTa terminology it is called
        "seed").

        Note: It is not always possible to generate long sentences correspondong with
        the _length parameter or sentences starts with desired word(s) - it depends
        strongly on the content of the training data.
      */
      window.max.bindInlet('getsentence', function(_length/*, seed*/){
        if(isNaN(_length)){p.consoleLog('getsentence: length is NaN'); return;}
        if(_length<1){p.consoleLog('getsentence: length is < 1'); return;}
        let lines;
        if(arguments.length<2){
          lines=ritaMarkovModel.generate(_length);
        }else{
          let seedString='';
          for(let i=1;i<arguments.length;i++){seedString+=arguments[i]; if(i<arguments.length-1) seedString+=' ';}
          lines=ritaMarkovModel.generate(_length,{seed:seedString});
        }
        if(lines===null) {window.max.outlet('[sentence]', 'null'); return;}
        if(lines.length<1) {window.max.outlet('[sentence]', 'empty'); return;}
        for(let i=0;i<lines.length;i++) lines[i]=p.checkSentence(lines[i]);
        window.max.outlet('[sentence]',p.checkSentence(lines.join(' ')));
      });
      /*
        "learn" wraps RiTa.markovModel "addText" method. It allows to add and analyze
        training data text(s) to the markov model.

        "learn" imports training data from the max dictionary (_dict_name parameter).
        The dictionary structure expected by the function should look like this:

          --------------------------------------------------
          |          key            |       value          |
          --------------------------------------------------
          | filename                | path_to_the_txt_file |
          | sentences               | number_of_sentences  |
          | 0                       | first_sentence       |
          | 1                       | second_sentence      |
          | 2                       | third_sentence       |
          | 3                       | ...                  |
          | (number_of_sentences-1) | nth_sentence         |
          --------------------------------------------------

        The "filename" is not an obligatory element - this is just something useful
        for test purposes.
      */
      window.max.bindInlet('learn', function(_dict_name){
        if(_dict_name===null){
          p.consoleLog('learn: dictionary name is null');
          window.max.outlet('[learning_interrupted]');
          return;
        }
        if(_dict_name.length<1){
          p.consoleLog('learn: dictionary name length < 1');
          window.max.outlet('[learning_interrupted]');
          return;
        }
        /*
          "getDict" method is executed asynchronously to the method which calls it
          ("learn" in this particular case). It is worth taking this into account
          in the code structure because the instructions in the "learn" method
          located "after" calling the "getDict" method will be executed in parallel
          to the statements in the getDict method.
        */
        window.max.getDict(_dict_name, function(_dict){
          if(_dict===null){
            p.consoleLog('learn: dictionary is null');
            window.max.outlet('[learning_interrupted]');
            return;
          }
          if(!_dict.hasOwnProperty('filename')){
            p.consoleLog('learn: dictionary has no "filename" property');
            window.max.outlet('[learning_interrupted]');
            return;
          }
          if(!_dict.hasOwnProperty('sentences')){
            p.consoleLog('learn: dictionary has no "sentences" property');
            window.max.outlet('[learning_interrupted]');
            return;
          }
          let numberOfSentences=_dict.sentences;
          if(isNaN(numberOfSentences)){
            p.consoleLog('learn: sentences property is NaN');
            window.max.outlet('[learning_interrupted]');
            return;
          }
          for(let i=0;i<numberOfSentences;i++){
            let prop=''+i;
            if(_dict.hasOwnProperty(prop)){
              let str=_dict[prop];
              if(str===null) continue;
              if(str.length<1) continue;
              let b=false;
              for(let j=0;j<str.length;j++){let c=str.charAt(j); if(c!='\n'&&c!=' '){b=true; break;}}
              if(b){
                let prog=(i+1)/numberOfSentences;
                window.max.outlet('[learning_progress]', prog);
                ritaMarkovModel.addText(str);
                ritaMarkovModelInfo.numberOfLearnedSentences+=1;
                ritaMarkovModelInfo.numberOfProcessedWords+=str.length;
              }
            }else{
              p.consoleLog('learn: dictionary has no "'+prop+'" property');
            }
          }
          window.max.outlet('[learning_complete]');
        });
      });
      window.max.outlet('[setup_complete]');
    }else{
      console.log('[setup_complete]');
    }
  };

  /*
    "draw" function is very simple this time. The only unusual element is "clear"
    instead of "background" - but this (together with rounded-corners-"rect")
    allows us to make p5js sketch look like something more max-native.
  */
  p.draw=function(){
    p.clear();
    p.noStroke(); p.fill(64);
    p.rect(0,0,innerWidth,innerHeight,5,5,5,5);
    p.noStroke(); p.fill(255);
    let info_str='markov n-factor: '+ritaMarkovModelInfo.nFactor+'\n'+
                 'number of learned sentences: '+ritaMarkovModelInfo.numberOfLearnedSentences+'\n'+
                 'number of processed words: '+ritaMarkovModelInfo.numberOfProcessedWords+'\n'+
                 'number of tokens in the model: '+ritaMarkovModel.size();
    p.text(info_str,10,20);
  };

  /*
    Just a helper for simplifying distribution of console messages.
  */
  p.consoleLog=function(_str){
    if(maxIsDetected) window.max.outlet('[console]', _str); else console.log(_str);
  }

  /*
    "checkSentence_xxxx" are a methods slightly improving the quality of sentences
    generated with the "getsentence" method (especially with low n-factor). These
    methods improve punctuation, the use of upper and lower case letters, etc.
  */
  p.checkSentence_checkFirstCharacter=function(_sentence){
    if(_sentence.length<1) return {sentence:'', isChangedFlag:false};
    let c1=_sentence.charAt(0); let c2=c1.toUpperCase();
    if(c1===c2) return {sentence:_sentence, isChangedFlag:false};
    let str=c2; if(_sentence.length>1) str+=_sentence.substring(1);
    return {sentence:str, isChangedFlag:true};
  }
  p.checkSentence_checkLastCharacter=function(_sentence){
    if(_sentence.length<1) return {sentence:'', isChangedFlag:false};
    let c1; let b1=true; let b2=false;
    while(b1){
      b1=false;
      if(_sentence.length<1) return {sentence:'', isChangedFlag:true};
      c1=_sentence.charAt(_sentence.length-1);
      if(c1===' '){
        _sentence=_sentence.substring(0,_sentence.length-1);
        b1=true; b2=true;
      }
    }
    if(_sentence.length<1) return {sentence:'', isChangedFlag:true};
    c1=_sentence.charAt(_sentence.length-1);
    if(c1==='.'||c1==='?'||c1==='!'){
      if(_sentence.length>1)
        return {sentence:_sentence, isChangedFlag:b2};
      else
        return {sentence:'', isChangedFlag:true};
    }
    b1=true;
    while(b1){
      b1=false;
      if(_sentence.length<1) return {sentence:'', isChangedFlag:true};
      c1=_sentence.charAt(_sentence.length-1);
      if(c1==='.'||c1==='?'||c1==='!') return {sentence:_sentence, isChangedFlag:true};
      if(c1===','||c1===';'||c1===':'||c1==='-'){
        _sentence=_sentence.substring(0,_sentence.length-1);
        if(_sentence.length<1) return {sentence:'', isChangedFlag:true};
        b1=true; b2=true;
      }
    }
    if(_sentence.length<1) return {sentence:'', isChangedFlag:true};
    _sentence+='.';
    return {sentence:_sentence, isChangedFlag:true};
  }
  p.checkSentence_replace=function(_sentence){
    let wanted=[
      {str:' \'.',onStart:'', onMid:' ', onEnd:'.'},
      {str:' -,',onStart:'', onMid:' - ', onEnd:'.'},
      {str:'-,',onStart:'', onMid:'-', onEnd:'.'},
      {str:',.',onStart:'', onMid:', ', onEnd:'.'},
      {str:';.',onStart:'', onMid:'; ', onEnd:'.'},
      {str:':.',onStart:'', onMid:': ', onEnd:'.'},
      {str:'.,',onStart:'', onMid:', ', onEnd:'.'},
      {str:'.;',onStart:'', onMid:'; ', onEnd:'.'},
      {str:'.:',onStart:'', onMid:': ', onEnd:'.'},
      {str:';:',onStart:'', onMid:'; ', onEnd:'.'},
      {str:':;',onStart:'', onMid:'; ', onEnd:'.'},
      {str:'(',onStart:'', onMid:'', onEnd:''},
      {str:')',onStart:'', onMid:'', onEnd:''},
      {str:', ,',onStart:'', onMid:', ', onEnd:''},
      {str:'..',onStart:'', onMid:'.', onEnd:'.'},
      {str:'  ',onStart:'', onMid:' ', onEnd:''},
      {str:'.!',onStart:'', onMid:'.', onEnd:'!'},
      {str:'.?',onStart:'', onMid:'.', onEnd:'?'},
      {str:',!',onStart:'', onMid:',', onEnd:'!'},
      {str:',?',onStart:'', onMid:',', onEnd:'?'}
    ];
    let str1, str2, str3, l; let b1=true; let b2=false;
    while(b1){
      b1=false;
      for(let i=_sentence.length-1;i>=0;i--){
        for(let j=0;j<wanted.length;j++){
          l=wanted[j].str.length;
          if((_sentence.length-i)>=l){
            str1=''; str2=''; str3='';
            if(i>0) str1=_sentence.substring(0,i-1);
            str2=_sentence.substring(i,i+l);
            if(i+l<_sentence.length) str3=_sentence.substring(i+l);
            if(str2===wanted[j].str){
              if(i===0){
                _sentence=str1+wanted[j].onStart+str3;
              }else{
                if(i<(_sentence.length-i)){
                  _sentence=str1+wanted[j].onMid+str3;
                }else{
                  _sentence=str1+wanted[j].onEnd+str3;
                }
              }
              b1=true; b2=true;
            }
          }
        }
      }
    }
    return {sentence:_sentence, isChangedFlag:b2};
  }
  p.checkSentence=function(_sentence){
    let b=true; let o;
    while(b){
      b=false;
      o=p.checkSentence_checkFirstCharacter(_sentence);
      _sentence=o.sentence; if(o.isChangedFlag) b=true;
      o=p.checkSentence_checkLastCharacter(o.sentence);
      _sentence=o.sentence; if(o.isChangedFlag) b=true;
      o=p.checkSentence_replace(o.sentence);
      _sentence=o.sentence; if(o.isChangedFlag) b=true;
    }
    return o.sentence;
  }
};

// let's run the sketch in the "instance mode"
let myp5 = new p5(s);