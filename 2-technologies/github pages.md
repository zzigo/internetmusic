#technologies 

1. how to publish directly from your local folder.
2. you need to have git and githu installed on your machine. 
3. install gh-pages

```bash
npm install --save-dev gh-pages
```
4. update vite.config.js in `my-project`

```js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/my-project/', // Replace 'my-project' with your repository name
  build: {
    outDir: 'dist', // Default build output folder
  },
});
```
(you need to correct to base path to the own folder of the project)

5. update package.json

add 
```bash
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
```
to the scripts section .


add website URL to packaje.json
```json
"homepage": "https://{username}.github.io/{repo-name}/"
```

6. deploy with `npm run deploy`

7. got to github    
    Settings > Pages
    Source -> select gh-pages
    save