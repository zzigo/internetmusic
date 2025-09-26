---
description: Examples and IMI created with the API (all working on Jan 2022)
---

# freesound.org API

### &#x20;2017 Freesound Trip

CJ Carr, Daniel Lopez, Emilio Molina, Mónica Rikić, Lefteris Stamellos, Edu Fonseca, Xavier Favory, Dmitry Bogdanov

s a web application that automatically arranges the sounds from [Freesound](http://www.freesound.org) in a three-dimensional space and lets the user fly manually through this space with a first-person perspective, hearing sounds as they get close.

{% embed url="http://5.2.16.88/Freesound-Trip" %}

### 2017 Freesound Explorer

Frederic Font, Giuseppe Bandiera\


Using Freesound Explorer you can perform text-based queries in Freesound, and see the results arranged in a 2-dimensional space. A well known dimensionality reduction technique is used ([tSNEJS](https://github.com/karpathy/tsnejs)) to learn a space from spectral audio features provided by Freesound. In this way, sounds are self-organised according to some sort of timbre similarity.

[https://labs.freesound.org/fse/](https://labs.freesound.org/fse/)

### 2017 Freesound Timeline

Frederic Font, Tony Martinez

**Freesound Timeline** is an app that automatically generates soundscapes using the most popular sounds from [Freesound](https://freesound.org) for a given year and month. I originally implemented Freesound Timeline back in 2011 when I was starting to learn about web technologies. In 2018 I updated it to make use [Freesound](https://freesound.org) APIv2 and the Web Audio API, and to add new killer features such as random spacialization of sounds in a 3D space (using WebAudio’s HRTF panning), and the _autoadvance_ mode to let Freesound Timeline automatically advance through Freesound history.

[https://ffont.github.io/freesound-timeline/#8,2021,false,40,true,1](https://ffont.github.io/freesound-timeline/#8,2021,false,40,true,1)
