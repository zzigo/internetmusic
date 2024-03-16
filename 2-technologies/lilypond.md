---
type: code
tags: code
url: 
year: 
summary: 
photo: 
person:
---
## best practices
```python
paper
variables
	text definitions

layout
	context
		\Score
			centerBarNumbers = ##t
			barNumberVisibility = #all-bar-numbers-visible
		marks % to use for system info


score {
	\section \sectionLabel "Part B"
layout {
	   \barnumber
}
}
```
### CONTEXT
to create a system

```python
\new Staff \relative {}
```

un sistema con dos voces , con “named contexts”
```python
\score {
<<
  %layout
\new Staff << \new Voice = "one" { \voiceOne}
			\new Voice = "two" {\voiceTwo}
			>>
%musical content
\context Voice = "one" { \relative {c''4 c c c}}
\context Voice = "two"  {\relative {g' 8 8 8 8 8}}
}
>>
}
```
(relative es necesario)


Para crear voces %en el mismo sistema

```python 
\new Staff <<
\new Voice \relative { \voiceOne c’’8 cc c4 c c}
\new Voice \relative { \voiceTwo g’4 g g g}
```
>>
para definir la cantidad de lineas de un sistema

```python
\override Staff.StaffSymbol.line-count = # 1
### GROUPING

<<  >>  %nivel uno de grouping, sin SystemStartDelimiter , sin compases unidos

\new StaffGroup << >>  % nivel dos, empieza con square brackets y barras de compas en todos los sistemas
\new ChoirStaff << >> %con square brackets, no bar lines unidas
\new GrandStaff << >> %curly brace bar line connected (soporta instrumentName)
\new PianoStaff \with {instrumentName }
\OneStaff para unir sistemas en un solo pentagrama horiozntal
```

## spatial 

from scheme
```javascript
#(ly:set-option 'eps-box-padding 3.000000)
```

in markup
```javascript
\markup {
    \center-column {
    one
    \abs-vspace #20
    two
    \abs-vspace #40
    three
  }
}


\hspace #2
```

Vertical axis grou
staffgroup