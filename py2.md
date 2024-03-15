```ly
\version "2.24.3"

%  DEFINITION FILE

\language "english"
\include "flute-diagram.ly"


% \include "../../templates/microtonal1.ly"

tit = "THE POTATO"
comp = "LUCIANO AZZIGOTTI"
sub  = "an orchestral piece full of potatoes"
year = "2024"
tagline = \year
scoreVersiones = "v1.0"
date = #(strftime "%d-%m-%Y" (localtime (current-time)))
 
 


% fontA =  \markup  \override #'(font-name . "Helvetica") 

%  NOTEHEAD DEFINITION
xino = {
  %  \once \override NoteHead  #'stencil = #ly:text-interface::print
 % \once \override NoteHead #'text = \markup {
  %   \combine
  %     \halign #-0.7 \draw-circle #0.85 #0.2 ##f
  %     \musicglyph #"noteheads.s2cross"
  }




global = {
  
  \numericTimeSignature
  \override Staff.TimeSignature.Y-offset = 5
  \override Score.MetronomeMark.padding = #10
  \tempo "rasante"  4=76

 
}
%%% SCORE

flute = \relative c' 

{ \global 
  
  \set Staff.instrumentName = #"flute "
\set Staff.shortInstrumentName = #"fl "
  
  c4\mf d8 [( ef\< f ) g-.] a4 | | %m 1
  f16-. g (a e ) a4 d->-. f->-.  | %m 2
  \stopStaff 
      s1 s1  | %  3m
  \startStaff 
  
  \omit StaffSymbol
  



  
  \time 3/2
  e2\ff^Intense b  g | %m 4
  \mark \default
  \clef alto 

  \numericTimeSignature \time 4/4
  <c a >1\fermata  
  
    \new ImproVoice {
    c4^"ad lib" c
    c4 c^"undress"
    c c_"while playing :)"
  }
  
     <
% \tweak #'before-line-breaking #(accidental-text (markup #:sans "m"))
     e!%  \sharpSyntonicUp
     g!
%\tweak #'before-line-breaking #(accidental-text (markup #:halign 0 #:sans "<e"))
     b!>2
    
}

oboe = \relative c'
{
  \global
  
  \set Staff.instrumentName = #"oboe "
  \set Staff.shortInstrumentName = #"ob"
  \clef "bass" g2 <af c>2 
 \tuplet 5/4 {a16 g f e f} g2 e4 |
              fs2 d2 c2
              \numericTimeSignature <d  ef> \fermata 
              
              a b c2
               \compoundMeter #'((2 8) (3 8))
               
               c d e f 
              
 }
 
 clarinet = \relative c'
{
  \global
  
  \set Staff.instrumentName = #"clarinet "
  \set Staff.shortInstrumentName = #"cl"
  \clef "bass" g2 <af c>2 
 \tuplet 5/4 {a16 g f e f} g2 e4 |
              fs2 d2 c2
              \numericTimeSignature <d  ef> \fermata 
              
 }
 
 basoon = \relative c'
{
  \global
  
  \set Staff.instrumentName = #"basoon "
  \set Staff.shortInstrumentName = #"bsn"
  \clef "tenor" g2 <af c>2 
 \tuplet 5/4 {a16 g f e f} g2 e4 |
              fs2 d2 c2
              \numericTimeSignature <d  ef> \fermata 
              
 }
 
 trumpet  = \relative c'
{
  \global
  
  \set Staff.instrumentName = #"trumpet "
  \set Staff.shortInstrumentName = #"tp"
  \clef "bass" g2 <af c>2 
 \tuplet 5/4 {a16 g f e f} g2 \xino e4 |
              fs2 d2 c2
              \numericTimeSignature <d  ef> \fermata 
              
 }
 
 trombon = \relative c'
{
  \global
  
  \set Staff.instrumentName = #"trombon "
  \set Staff.shortInstrumentName = #"rtb"
  \clef "bass" g2 <af c>2 
 \tuplet 5/4 {a16 g f e f} g2 e4 |
              fs2 d2 c2
              \numericTimeSignature <d  ef> \fermata 
              
 }
 
 euphonium = \relative c'
{
  \global
  
  \set Staff.instrumentName = #"euphonium "
  \set Staff.shortInstrumentName = #"eu"
  \clef "bass" g2 <af c>2 
 \tuplet 5/4 {a16 g f e f} g2 e4 |
              fs2 d2 c2
              \numericTimeSignature <d  ef> \fermata 
              
 }
 
 
 tuba = \relative c' {

  \global
  
  \set Staff.instrumentName = #"tuba "
  \set Staff.shortInstrumentName = #"tu"
  \clef "bass" g2 <af c>2 
 \tuplet 5/4 \[ {a16 g f e f} \] g2 e4 |
             [ fs2 d2 c2]
              \numericTimeSignature <d  ef> \fermata 
              
 }
 
  violinI = \relative c'
{
  \global
  
  \set Staff.instrumentName = #"violin I "
  \set Staff.shortInstrumentName = #"vl I"
  \clef "bass" g2 <af c>2 
 \tuplet 5/4 {a16 g f e f} g2 e4 |
              fs2 d2 c2
              \numericTimeSignature <d  ef> \fermata 
              
 \compoundMeter #'((2 8) (3 8))
c8 d e f g
  c8 f, g e d
  c8 d e4 g8
 }
 
  violinII = \relative c'
{
  \global
  
  \set Staff.instrumentName = #"violin II "
  \set Staff.shortInstrumentName = #"vl II"
  \clef "bass" g2 <af c>2 
 \tuplet 5/4 {a16 g f e f} g2 e4 |
              fs2 d2 c2
              \numericTimeSignature <d  ef> \fermata 
              
 }
 
  viola = \relative c'
{
  \global
  
  \set Staff.instrumentName = #"viola "
  \set Staff.shortInstrumentName = #"vla"
  \clef "bass" g2 <af c>2 
 \tuplet 5/4 {a16 g f e f} g2 e4 |
              fs2 d2 c2
              \numericTimeSignature <d  ef> \fermata 
              
 }
 
  violoncello = \relative c'
{
  \global
  
  \set Staff.instrumentName = #"violoncello "
  \set Staff.shortInstrumentName = #"vc"
  \clef "bass" g2 <af c>2 
 \tuplet 5/4 {a16 g f e f} g2 e4 |
              fs2 d2 c2
              \numericTimeSignature <d  ef> \fermata 
              
 }
 
  doublebass = \relative c'
{
  \global
  
  \set Staff.instrumentName = #"doublebass "
  \set Staff.shortInstrumentName = #"sb"
  \clef "bass" g2 <af c>2 
 \tuplet 5/4 {a16 g f e f} g2 e4 |
              fs2 d2 c2
              \numericTimeSignature <d  ef> \fermata 
              
 }

 
 
```