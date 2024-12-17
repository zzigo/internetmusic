#code 

create a workspace when you are experimenting with lot of different projects and don’t want to repeat the node_modules folder for each of them


1. create a folder “projects”
2. use the packager manager pnm (highly reccomended after **yarn** and **npm**)
3. create a `pnpm-workspace.yaml` with:

```yaml
packages:
- '*/'        # Matches all immediate subdirectories
- '*/*/'      # Matches one level of nested directories (optional)

```
4. at the root folder create a package.json:
```json
{
  "name": "monorepo",
  "private": true,
  "devDependencies": {
    "vite": "^4.0.0"
  }
}

```
5. folder structure will be as:
```bash
vite-monorepo/
├── node_modules/          # Shared dependencies
├── package.json           # Root package.json
├── pnpm-lock.yaml         # Lockfile for consistency
├── pnpm-workspace.yaml    # Defines workspaces
├── project-a/
│   ├── src/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json       # Local dependencies for project-a
├── project-b/
│   ├── src/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json       # Local dependencies for project-b
└── project-c/
    ├── src/
    ├── index.html
    ├── vite.config.js
    └── package.json       # Local dependencies for project-c

```
7. install shared dependencies: 
```bash
pnpm install react react-dom vite
```
8. to add specific dependencies for each project do :

```bash
pnpm add lodash --filter ./<projectName>
```
9. run script for specifi projects with the `–filter` 
```bash
pnpm run dev --filter ./project-a
```
10. or add to the root `package.json`
```bash
{
  "scripts": {
    "dev:project-a": "pnpm --filter ./project-a run dev",
    "dev:project-b": "pnpm --filter ./project-b run dev"
  }
}

```
1. and the run
```bash
pnpm run dev:project-a

```
11. on the root always use `pnpm -w install` w option works only with the full workspace 
12. run:
	1. all projects:
```bash
pnpm --parallel run dev

```
2. one project:
```bash
pnpm run dev --filter <project>
```