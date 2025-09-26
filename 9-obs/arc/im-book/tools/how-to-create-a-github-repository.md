---
description: brief introduction to the version control system GIT and GitHub
---

# How to create a github repository

Git is a distributed version control system. A version control system:

1. track changes in any set of files
2. coordinate work and contributions between programmers.
3. Its goal is to preserve the data integrity (not overlapping
4. Created by Linus Torvalds, It was on of the main pillars of the creation of Linux kernel in 2005

Github ,A hosting service that houses a web-based git repository. It includes all the fucntionality of git with additional features added in.

#### 1. create a repo from local folder

Actually there is not a stable way to create a repository from a local machine. Then, you must create a github account, and create a repository on the webpage. Nevertheless, we present two ways of doing so from CLI:

```jsx
curl -u user:pass <https://api.github.com/<username>/repos> -d
hub create [repo-name]  //you need to install the program hub, in mac try: brew install hub
```

#### 2. upload a file to a repo already created

```jsx
choose the target folder // the folder you want to upload
git init //initializate .git in the folder
git add [filaname] // add the file , or git add . to add all the folder
git  commit -m "commentary about the update" // commit 
git remote add origin <https://github.com/zzigo/>[repo name].git
git push origin [branch] //git push origin master -u

//git branch -M main

 
```

#### 3. download a repo or a file

```jsx
git clone
```
