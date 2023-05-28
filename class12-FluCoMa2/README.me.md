---
quickshare-date: 2023-05-02 03:32:48
quickshare-url: "https://noteshare.space/note/clh5lhkwf115901pjr8b8tdt6#WdhH4544DD98f8c477v3IdOESWg+31/EZeuFccRraXk"
---

FluCoMa 2

*Neural Networks classifiers*

---
t leverages a type of Neural Network in the Fluid Corpus Manipulation toolkit, the [MLPClassifier](https://learn.flucoma.org/reference/mlpclassifier) to perform the classification process. 

---
This workflow is particularly flexible as you can _train_ the [MLPClassifier](https://learn.flucoma.org/reference/mlpclassifier) to associate any kind of data to a given label. In the context of this tutorial, we associate audio-descriptors to instrumental labels, so that an input sound can be classified according to a set of instrumental archetypes. 

---
There are lots of ways in which this workflow can be applied musically. For example you could:

1.  Drive audio-visual reactivity from the classification output
2.  Create an internal logic for an improvisational machine based on a sort of musical decision making
3.  Speed up the process of classifying a large corpus of sound resources.
4. 
---

Multi-Layer Perception (Neural Network)
![](https://i.imgur.com/blSdyx6.png)

---

Classifier: 

predicts which class (category) an input belogs to

---
![](https://i.imgur.com/29KOH5L.png)

---

Training a Classifier

Analysis -> LABEL -> Output

---

Makes a guess on every example and determines how it was wrong. 
Improves a bit every time. 

---
![](https://i.imgur.com/LS5M9tt.png)


---

note:
fluid.mfcc~ 

the output is  (13) -30 - 30.  
buffer~ mfccbuf @samps 13 

  [ addpoint $1 mfcccbuf]
fluid.dataset~ mfccdata 

       [instrument 1].   [instrument 2]
       join
   [addlabel $1 $2 ]
fluid.labelset~ instr 

fluid.list2buf @destination mfccbuf  (analysis into buffer)





well here I'm writing waiting the autosuggestion but
