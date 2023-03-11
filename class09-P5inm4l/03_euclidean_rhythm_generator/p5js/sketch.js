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

  // an object that stores sequence(s) data
  let seq;

  // GUI color scheme
  let gui_bg_color={r:100,g:100,b:100,opaqueFlag:false};
  let gui_tile_color={r:220,g:220,b:220};
  let gui_dot_color={active_r:0,active_g:0,active_b:0,inactive_r:220,inactive_g:220,inactive_b:220};
  let gui_highlight_color={r:255,g:128,b:0};

  /*
    Use windowResized function to adopt canvas size to the current size of
    the browser. It is particularly important when sketch is loaded inside
    the Max jweb object, which may be dynamically resized by the user.
  */
  p.windowResized = function() {p.resizeCanvas(innerWidth, innerHeight);}

  p.setup = function() {
    p.createCanvas(innerWidth, innerHeight);
    seq = new p.Seq(4);
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
      */
      /*
        GUI functions
      */
      window.max.bindInlet('opaque', function(_opaqueFlag) {
        if(isNaN(_opaqueFlag)) {_opaqueFlag=false; window.max.outlet('[console]', 'opaque: flag is NaN');}
        gui_bg_color.opaqueFlag=(_opaqueFlag>0);
      });
      window.max.bindInlet('bgcolor', function(_r, _g, _b) {
        if(isNaN(_r)) {_r=0; window.max.outlet('[console]', 'bgcolor: r value is NaN');}
        if(isNaN(_g)) {_g=0; window.max.outlet('[console]', 'bgcolor: g value is NaN');}
        if(isNaN(_b)) {_b=0; window.max.outlet('[console]', 'bgcolor: b value is NaN');}
        _r=Math.floor(_r); _g=Math.floor(_g); _b=Math.floor(_b);
        if(_r>255) _r=255; if(_r<0) _r=0;
        if(_g>255) _g=255; if(_g<0) _g=0;
        if(_b>255) _b=255; if(_b<0) _b=0;
        gui_bg_color.r=_r; gui_bg_color.g=_g; gui_bg_color.b=_b;
      });
      window.max.bindInlet('tilecolor', function(_r, _g, _b) {
        if(isNaN(_r)) {_r=0; window.max.outlet('[console]', 'tilecolor: r value is NaN');}
        if(isNaN(_g)) {_g=0; window.max.outlet('[console]', 'tilecolor: g value is NaN');}
        if(isNaN(_b)) {_b=0; window.max.outlet('[console]', 'tilecolor: b value is NaN');}
        _r=Math.floor(_r); _g=Math.floor(_g); _b=Math.floor(_b);
        if(_r>255) _r=255; if(_r<0) _r=0;
        if(_g>255) _g=255; if(_g<0) _g=0;
        if(_b>255) _b=255; if(_b<0) _b=0;
        gui_tile_color.r=_r; gui_tile_color.g=_g; gui_tile_color.b=_b;
      });
      window.max.bindInlet('highlightcolor', function(_r, _g, _b) {
        if(isNaN(_r)) {_r=0; window.max.outlet('[console]', 'highlightcolor: r value is NaN');}
        if(isNaN(_g)) {_g=0; window.max.outlet('[console]', 'highlightcolor: g value is NaN');}
        if(isNaN(_b)) {_b=0; window.max.outlet('[console]', 'highlightcolor: b value is NaN');}
        _r=Math.floor(_r); _g=Math.floor(_g); _b=Math.floor(_b);
        if(_r>255) _r=255; if(_r<0) _r=0;
        if(_g>255) _g=255; if(_g<0) _g=0;
        if(_b>255) _b=255; if(_b<0) _b=0;
        gui_highlight_color.r=_r; gui_highlight_color.g=_g; gui_highlight_color.b=_b;
      });
      window.max.bindInlet('activedotcolor', function(_r, _g, _b) {
        if(isNaN(_r)) {_r=0; window.max.outlet('[console]', 'activedotcolor: r value is NaN');}
        if(isNaN(_g)) {_g=0; window.max.outlet('[console]', 'activedotcolor: g value is NaN');}
        if(isNaN(_b)) {_b=0; window.max.outlet('[console]', 'activedotcolor: b value is NaN');}
        _r=Math.floor(_r); _g=Math.floor(_g); _b=Math.floor(_b);
        if(_r>255) _r=255; if(_r<0) _r=0;
        if(_g>255) _g=255; if(_g<0) _g=0;
        if(_b>255) _b=255; if(_b<0) _b=0;
        gui_dot_color.active_r=_r; gui_dot_color.active_g=_g; gui_dot_color.active_b=_b;
      });
      window.max.bindInlet('inactivedotcolor', function(_r, _g, _b) {
        if(isNaN(_r)) {_r=0; window.max.outlet('[console]', 'inactivedotcolor: r value is NaN');}
        if(isNaN(_g)) {_g=0; window.max.outlet('[console]', 'inactivedotcolor: g value is NaN');}
        if(isNaN(_b)) {_b=0; window.max.outlet('[console]', 'inactivedotcolor: b value is NaN');}
        _r=Math.floor(_r); _g=Math.floor(_g); _b=Math.floor(_b);
        if(_r>255) _r=255; if(_r<0) _r=0;
        if(_g>255) _g=255; if(_g<0) _g=0;
        if(_b>255) _b=255; if(_b<0) _b=0;
        gui_dot_color.inactive_r=_r; gui_dot_color.inactive_g=_g; gui_dot_color.inactive_b=_b;
      });
      /*
        Managing sequences, creating patterns, etc.
      */
      window.max.bindInlet('init', function(_numOfTracks) {
        if(isNaN(_numOfTracks)) {window.max.outlet('[console]', 'init: number of tracks is NaN'); return;}
        _numOfTracks = Math.floor(_numOfTracks);
        if(_numOfTracks<=0) {window.max.outlet('[console]', 'init: number of tracks is <= 0'); return;}
        seq.init(_numOfTracks);
        window.max.outlet('[init_complete]', _numOfTracks);
      });
      window.max.bindInlet('eucl', function(_track, _numOfSteps, _numOfTrigs, _offset) {
        if(isNaN(_track)) {window.max.outlet('[console]', 'eucl: track index is NaN'); return;}
        if(isNaN(_numOfSteps)) {window.max.outlet('[console]', 'eucl: number of steps is NaN'); return;}
        if(isNaN(_numOfTrigs)) {window.max.outlet('[console]', 'eucl: number of triggers is NaN'); return;}
        if(isNaN(_offset)) {window.max.outlet('[console]', 'eucl: offset is NaN'); return;}
        _track=Math.floor(_track); _numOfSteps=Math.floor(_numOfSteps); _numOfTrigs=Math.floor(_numOfTrigs); _offset=Math.floor(_offset);
        if(_track>=0 && _track<seq.tracks.length){
          seq.setPattern(_track,p.getEuclPatternAsArr(_numOfSteps, _numOfTrigs, _offset));
        }else{
          window.max.outlet('[console]', 'eucl: track index is < 0 or > current number of tracks');
        }
      });
      window.max.bindInlet('highlight', function(_track, _step) {
        if(isNaN(_track)) {window.max.outlet('[console]', 'highlight: track index is NaN'); return;}
        if(isNaN(_step)) {window.max.outlet('[console]', 'highlight: step index is NaN'); return;}
        _track=Math.floor(_track);
        if(_track>=0 && _track<seq.tracks.length) {
          seq.setHighlight(_track, Math.floor(_step));
        }else{
          window.max.outlet('[console]', 'highlight: track index is < 0 or > current number of tracks');
        }
      });
      window.max.bindInlet('husk', function(_track, _step) {
        if(isNaN(_track)) {
          window.max.outlet('[console]', 'husk: track index is NaN');
          window.max.outlet('[husk]', -1, -1, -1);
          return;
        }
        if(isNaN(_step)) {
          window.max.outlet('[console]', 'husk: step index is NaN');
          window.max.outlet('[husk]', -1, -1, -1);
          return;
        }
        _track=Math.floor(_track);
        if(_track>=0 && _track<seq.tracks.length) {
          _step=Math.floor(_step);
          if(_step>=0 && _step<seq.tracks[_track].pattern.length){
            window.max.outlet('[husk]', _track, _step, seq.husk(_track, _step));
          } else {
            window.max.outlet('[console]', 'husk: step index is < 0 or > number current of steps');
            window.max.outlet('[husk]', _track, _step, -1);
          }
        } else {
          window.max.outlet('[console]', 'husk: track index is < 0 or > current number of tracks');
          window.max.outlet('[husk]', _track, _step, -1);
        }
      });
      window.max.bindInlet('setpattern', function(_track, _patternAsString) {
        if(isNaN(_track)) {window.max.outlet('[console]', 'setpattern: track index is NaN'); return;}
        _track=Math.floor(_track);
        if(_track>=0 && _track<seq.tracks.length){
          if(_patternAsString===null) return;
          let temp_pattern = _patternAsString.split('');
          if(!Array.isArray(temp_pattern)) {
            window.max.outlet('[console]', 'setpattern: provided pattern is empty or corrupted');
            return;
          }
          for(let i=0;i<temp_pattern.length;i++){
            temp_pattern[i]=parseInt(temp_pattern[i]);
            if(isNaN(temp_pattern[i])) temp_pattern[i]=0; // ???
          }
          seq.setPattern(_track,temp_pattern);
        } else {
          window.max.outlet('[console]', 'setpattern: track index is < 0 or > current number of tracks');
        }
      });
      window.max.bindInlet('getpattern', function(_track) {
        let temp_patterns=[];
        if(_track===null || isNaN(_track)){
          temp_patterns=seq.getPattern(-1);
        }else{
          if(_track<0){
            temp_patterns=seq.getPattern(-1);
          }else{
            _track = Math.floor(_track);
            if(_track<seq.tracks.length)
              temp_patterns=seq.getPattern(_track);
            else
              window.max.outlet('[console]', 'getpattern: track index is > current number of tracks');
          }
        }
        for(let i=0;i<temp_patterns.length;i++)
          window.max.outlet.apply(window.max,['[pattern]'].concat(temp_patterns[i]));
      });
      window.max.outlet('[setup_complete]');
    }else{
      console.log('[setup_complete]');
    }
  };

  p.draw = function() {
    if(gui_bg_color.opaqueFlag) p.background(gui_bg_color.r,gui_bg_color.g,gui_bg_color.b); else p.clear();
    let temp_segW; let temp_segH=p.height/seq.tracks.length;
    for(let i=0;i<seq.tracks.length;i++){
      temp_segW=p.width/seq.tracks[i].pattern.length;
      for(let j=0;j<seq.tracks[i].pattern.length;j++){
        if(seq.tracks[i].pattern[j].mutedFlag){
          p.noFill(); p.stroke(gui_tile_color.r,gui_tile_color.g,gui_tile_color.b); p.strokeWeight(1);
        }else{
          p.fill(gui_tile_color.r,gui_tile_color.g,gui_tile_color.b); p.noStroke();
        }
        p.rect(temp_segW*j+1,temp_segH*i+1,temp_segW-2,temp_segH-2,5,5,5,5);
        if(seq.tracks[i].pattern[j].onsetFlag){
          if(seq.tracks[i].pattern[j].mutedFlag) p.fill(gui_dot_color.inactive_r,gui_dot_color.inactive_g,gui_dot_color.inactive_b); else p.fill(gui_dot_color.active_r,gui_dot_color.active_g,gui_dot_color.active_b);
          p.noStroke();
          p.circle(temp_segW*j+5,temp_segH*i+5,5);
        }
      }
      if(seq.tracks[i].highlightedStep>=0){
        p.fill(gui_highlight_color.r,gui_highlight_color.g,gui_highlight_color.b,42); p.strokeWeight(1); p.stroke(gui_highlight_color.r,gui_highlight_color.g,gui_highlight_color.b);
        p.rect(
          temp_segW*(seq.tracks[i].highlightedStep%seq.tracks[i].pattern.length)+1,
          temp_segH*i+1, temp_segW-2,temp_segH-2,
          5,5,5,5
        );
      }
    }
  };

  p.mouseReleased = function(){
    let temp_segW; let temp_segH=p.height/seq.tracks.length;
    let temp_segX, temp_segY;
    for(let i=0;i<seq.tracks.length;i++){
      temp_segW=p.width/seq.tracks[i].pattern.length;
      temp_segY=temp_segH*i;
      for(let j=0;j<seq.tracks[i].pattern.length;j++){
        temp_segX=temp_segW*j;
        if(p.mouseX<temp_segX||p.mouseY<temp_segY||p.mouseX>temp_segX+temp_segW||p.mouseY>temp_segY+temp_segH) continue;
        seq.tracks[i].pattern[j].mutedFlag=!seq.tracks[i].pattern[j].mutedFlag;
        let temp_patterns=seq.getPattern(i);
        if(maxIsDetected)
          window.max.outlet.apply(window.max,['[pattern]'].concat(temp_patterns[0]));
        else
          console.log(['[pattern]'].concat(temp_patterns[i]));
        break;
      }
    }
    return false;
  }

  /*
    Seq is a simple pseudoclass making it easier to work with sequences
    (see also the Track pseudoclass defined below).
  */
  p.Seq = function(_numOfTracks){
    this.tracks=[];
    this.init(_numOfTracks);
  }
  p.Seq.prototype.setPattern=function(_track, _pattern){
    this.tracks[_track].setPattern(_pattern);
  }
  p.Seq.prototype.init=function(_numOfTracks){
    this.tracks.splice(0, this.tracks.length);
    for(let i=0;i<_numOfTracks;i++) this.tracks[i] = new p.Track();
  }
  p.Seq.prototype.husk=function(_track, _step){
    return this.tracks[_track].husk(_step);
  }
  p.Seq.prototype.setHighlight=function(_track, _step){
    this.tracks[_track].setHighlight(_step);
  }
  p.Seq.prototype.getPattern=function(_track){
    let result=[];
    if(_track<0){
      for(let i=0;i<this.tracks.length;i++)
      result[result.length]=this.tracks[i].getPattern(i);
    }else{
      result[result.length]=this.tracks[_track].getPattern(_track);
    }
    return result;
  }
  /*
    Track is a simple pseudoclass storing data of a single monophonic sequence.
  */
  p.Track = function(){this.pattern=[]; this.highlightedStep=-1;}
  p.Track.prototype.setPattern=function(_pattern){
    this.pattern.splice(0, this.pattern.length);
    let temp_b;
    for(let i=0;i<_pattern.length;i++){
      temp_b=(_pattern[i]>0);
      this.pattern[i]={onsetFlag: temp_b, mutedFlag: !temp_b};
    }
  }
  p.Track.prototype.husk=function(_step){return !this.pattern[_step].mutedFlag;}
  p.Track.prototype.setHighlight=function(_step){this.highlightedStep=_step;}
  p.Track.prototype.getPattern=function(_prefix){
    let patt = [_prefix];
    for(let i=0;i<this.pattern.length;i++) patt[patt.length]=!this.pattern[i].mutedFlag;
    return patt;
  }

  /*
    A simple binary sequences generator implementing Euclidean/Bjorklund's algorithm. 
    More info: http://cgm.cs.mcgill.ca/~godfried/publications/banff.pdf
  */
  p.getEuclPatternAsArr = function(_length, _numOfTriggers, _offset){
    let temp_euclPattern=p.generateEuclPattern(_length, _numOfTriggers);
    let result=[[],[]];
    for(let i=0;i<temp_euclPattern.length;i++){
      for(let j=0;j<temp_euclPattern[i].arrOfElements.length;j++){
        result[0][result[0].length]=temp_euclPattern[i].arrOfElements[j];
      }	
    }
    let temp_k=0;
    for(let i=0;i<result[0].length;i++){
      temp_k = (i + _offset) % _length;
      if(temp_k < 0) temp_k += _length;
      result[1][i] = result[0][temp_k];
    }
    return result[1];
  }
  p.generateEuclPattern = function(_length, _numOfTriggers){
    let result=[[],[]]; // eucl binary pattern, two buffers
    // check
    _length=Math.abs(_length); _numOfTriggers=Math.abs(_numOfTriggers);
    if(_length<1){_length=1;}
    // init src buff
    let srcBufferIndex=0; let dstBufferIndex=1;
    if(_numOfTriggers<1){
      for(let i=0;i<_length;i++) result[srcBufferIndex][i] = new p.euclBinaryBlock([0],false);
      return result[srcBufferIndex];
    }
    if(_numOfTriggers>_length) _numOfTriggers=_length;
    for(let i=0;i<_numOfTriggers;i++){
      result[srcBufferIndex][i] = new p.euclBinaryBlock([1],false);
    }
    for(let i=_numOfTriggers;i<_length;i++){
      result[srcBufferIndex][i] = new p.euclBinaryBlock([0],true);
    }
    // the main part of the Euclidean/Bjorklund algorithm
    while(p.getNumberOfReminderBinaryBlocks(result[srcBufferIndex])>1){
      let firstReminderBlockIndex=p.getFirstReminderBlockIndex(result[srcBufferIndex]);
      result[dstBufferIndex].splice(0, result[dstBufferIndex].length); // clearing dst buff
      for(let i=0;i<firstReminderBlockIndex;i++){
        result[dstBufferIndex][i]=result[srcBufferIndex][i];
        result[dstBufferIndex][i].reminderFlag=true;
      }
      let mainBlockIndex=0;
      for(let i=firstReminderBlockIndex;i<result[srcBufferIndex].length;i++){
        if(mainBlockIndex<result[dstBufferIndex].length){
          for(let j=0;j<result[srcBufferIndex][i].arrOfElements.length;j++){
            result[dstBufferIndex][mainBlockIndex].arrOfElements[
              result[dstBufferIndex][mainBlockIndex].arrOfElements.length
            ]=result[srcBufferIndex][i].arrOfElements[j];
          }
          result[dstBufferIndex][mainBlockIndex].reminderFlag=false;
        }else{
          result[dstBufferIndex][mainBlockIndex]=result[srcBufferIndex][i];
        }
        mainBlockIndex+=1;
      }
      srcBufferIndex=(srcBufferIndex+1)%2;
      dstBufferIndex=(dstBufferIndex+1)%2;
    }
    return result[srcBufferIndex];
  }
  p.getFirstReminderBlockIndex = function(_pattern){
    for(let i=0;i<_pattern.length;i++) if(_pattern[i].reminderFlag) return i;
    return -1;
  }
  p.getNumberOfReminderBinaryBlocks = function(_pattern){
    let result=0;
    for(let i=0;i<_pattern.length;i++) if(_pattern[i].reminderFlag) result+=1;
    return result;
  }
  p.euclBinaryBlock = function(_arr,_reminderFlag){
    this.arrOfElements=_arr; this.reminderFlag=_reminderFlag;
  }

};

// let's run the sketch in the "instance mode"
let myp5 = new p5(s);