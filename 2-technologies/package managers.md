[[npm]]
[[bun]]
# npm
 npm is the default package manager in the Node.js ecosystem. It is both (a) a CLI that installs and manages dependencies in node_modules, and (b) the npm registry where packages are published and discovered. It is also the standard place where teams encode workflows in package.json scripts (build, dev, test, publish). Recent Sources: Node.js documentation describes npm as the standard package manager for Node.js, and npm’s own docs describe it as the CLI that installs modules and manages dependency conflicts and publishing workflows.
# bun
-  all-in-one toolkit: JavaScript runtime + package manager + bundler/test runner (depending on what you use). - Node-compatible while offering faster startup and installs.
- Recent Sources: Bun docs describe Bun as a single executable, its runtime architecture (JavaScriptCore, Zig), a Node.js compatibility effort, and a package manager that can install npm packages, using .npmrc configuration and producing Bun lockfiles.
# Comparison (practical)
## 1. Scope
- npm: package manager (plus registry + publishing), typically paired with Node.js as the runtime. 
- bun: runtime + package manager in one toolchain (plus other tooling).
## 2. Compatibility and ecosystem
- npm: maximum compatibility because it is the default tool for the npm ecosystem.
- bun: can install npm packages and reads npm registry config from .npmrc, but it is still catching up on Node API edges; Bun treats incompatibilities as bugs and tracks Node compatibility explicitly.
## 3. Lockfiles and installs
- npm: commonly uses package-lock.json (standard Node workflows).
- bun: uses Bun lockfiles (historically bun.lockb, with a tracked move toward text lockfiles), and documents platform-stable lockfile behavior for bun install.

## 4. Speed claims
- bun publicly claims faster startup (example: “4x faster than Node.js on Linux” in its runtime docs) and faster installs; your results will depend on OS, disk, network, and project graph.
    Command equivalences you’ll actually use
- install deps:
    - npm: npm install
    - bun: bun install
- add deps:
    - npm: npm install zod
    - bun: bun add zod
- run scripts:
    - npm: npm run dev
    - bun: bun run dev

