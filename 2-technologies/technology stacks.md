A technology stack is, in the most general sense, the ordered set of tools, languages, runtimes, and platforms that cooperate to deliver a piece of software, from low-level execution to user interface. It is “stacked” because each layer depends on services of the lower layers and exposes services to the upper ones (hardware → OS → runtime → frameworks → app code → UI).

## 1. What is a “technology stack” in general?

We can model a stack as a tuple of layers:
$S = (L_0, L_1, …, L_n)$
where each $L_i$ is a set of technologies fulfilling a role (e.g. database, backend runtime, frontend framework). Typical coarse layers in web development:
1. Platform layer
    - Operating system (Linux, Windows, macOS)
    - Container / orchestration (Docker, Kubernetes)
2. Runtime layer
    - Language + runtime: JavaScript/Node.js, Python/CPython, Java/JVM, etc.
3. Data layer
    - Databases (MongoDB, PostgreSQL, MySQL, Redis, etc.)
4. Backend application layer
    - Web frameworks / APIs (Express, Django, Spring, FastAPI, Nest, etc.)
5. Frontend application layer
    - SPA frameworks (React, Vue, Angular, Svelte, etc.)
6. Delivery / tooling layer
    - Build tools (Vite, Webpack, esbuild), CI/CD, testing frameworks, package managers.
A “stack name” (like MEAN) is a conventional label for a particular choice in each of those roles.

---
## 2. “Stack patterns”: from LAMP to MEAN/MERN and beyond
If we speak of “stack patterns”, we are really talking about recurring combinations of choices at each layer that express certain design philosophies.
### 2.1 LAMP: the classical monolithic web stack
LAMP = Linux + Apache + MySQL + PHP.
Pattern traits:
1. Monolithic application, server-rendered HTML.
2. Clear layer separation, but tightly coupled deployment (everything on one box/server).
3. SQL database as central state; request–response model over HTTP; sessions for user state.
This pattern influenced later stacks in how they name and group technologies even when architecture shifted to SPAs and APIs.
---
### 2.2 MEAN:  MongoDB + Express + Angular + Node.js.

![](https://i.imgur.com/CXrm73I.png)

Key ideas:
1. Single language across tiers
    JavaScript in browser (Angular), JavaScript on server (Node.js/Express), JSON-like documents in MongoDB. This reduces impedance between layers (e.g. objects in client ↔ server ↔ DB).
2. Document-oriented persistence
    MongoDB encourages flexible schemas; good for rapid iteration, not always ideal for strongly structured relational data.
3. SPA + REST/JSON API
    Angular is used for single-page applications; Express exposes RESTful endpoints over HTTP.
This is a “full-stack JavaScript” pattern, where the main value proposition is language unification and JSON everywhere.
---
### 2.3 MERN:  MongoDB + Express + React + Node.js.

![](https://i.imgur.com/C8rnZAJ.png)

Differences from MEAN:
1. Frontend paradigm
    - Angular: framework, batteries-included, strongly opinionated.
    - React: library for building UI via components; the rest of the architecture (routing, state management) is composed from other libraries.
2. Ecosystem / flexibility
    MERN tends to be more “pick-and-mix” on the frontend; this shapes a pattern where the backend is relatively thin (API), and a lot of complexity moves to the client (routing, state, data fetching).
So MERN is essentially the same “full-stack JS + Mongo + Express” pattern but with a different UI philosophy (component-driven, virtual DOM).
---
### 2.4 Other named variants (brief)
1. MEVN
    - MongoDB, Express, Vue, Node.
    - Same full-stack JS idea, but with Vue’s more incremental, template-centric approach to the frontend.
2. JAMstack (a bit different)
    - Not a 4-letter acronym but a pattern: JavaScript, APIs, Markup. Static sites or pre-rendered pages, talking to headless APIs. Emphasizes decoupling frontend from backend, good fit with CDNs and serverless.
3. PERN / T3, etc.
    - PERN: PostgreSQL, Express, React, Node – brings back a relational database.
    - T3 stack (TypeScript, tRPC, Tailwind, Next, Prisma) – opinionated TypeScript-first full-stack pattern with end-to-end typing.
These labels function as “design pattern mnemonics”: they encode both specific technologies and architectural assumptions (SPA vs server-rendered, NoSQL vs SQL, typed vs untyped, monolith vs microservices).
---
## 3. Main tendencies in stack patterns (beyond the brand names)
We can summarize some macro-trends:
1. Language unification
    - From polyglot (PHP on server, JS on client, SQL in DB) to “one language everywhere” (JS front+back+DB JSON, or TypeScript end-to-end).
    - Goal: reduce cognitive load and friction in data representation.
2. From monolith to decoupled front/back
    - LAMP: server renders HTML; browser is “thin”.
    - MEAN/MERN: backend becomes JSON API; frontend is an application in its own right (SPA).
    - JAMstack / headless CMS: backend is often completely separate (microservices, serverless functions).
3. State and data philosophy
    - Relational (SQL) vs document (NoSQL) vs mixed.
    - Many modern stacks combine: e.g. PostgreSQL + Redis + ElasticSearch, moving away from “one DB to rule them all”.
4. Operational model
    - Old stacks assumed long-running servers on a single machine.
    - Newer patterns assume containers, serverless functions, CI/CD, and distributed deployments.
5. Opinionated vs composable ecosystems
    - Angular, Rails, Django: opinionated, full frameworks.
    - React, Express: require you to assemble your own stack of libraries.
    - Stack patterns often fall along this line: MEAN was more “framework-heavy”, MERN more composable.
In other words, when we talk about “stack patterns” we are not only listing libraries; we are also encoding philosophies about coupling, state, deployment, and developer experience.
---
## 4. Minimal takeaway
1. A technology stack is an ordered set of cooperating layers from OS to UI.
2. Named stacks (LAMP, MEAN, MERN, etc.) are conventional “recipes” that standardize one choice at each layer.
3. Stack patterns encode larger tendencies:
    - language unification vs polyglot
    - monolithic vs decoupled architectures
    - relational vs document vs mixed data models
    - opinionated all-in-one frameworks vs composable libraries
    - traditional servers vs containers / serverless.


---
```
@book{fowler2002patterns,
  author    = {Martin Fowler},
  title     = {Patterns of Enterprise Application Architecture},
  year      = {2002},
  publisher = {Addison-Wesley},
  pages     = {1--25}
}
@book{tilkov2015rest,
  author    = {Stefan Tilkov and Martin L{\"u}ders},
  title     = {REST und HTTP: Entwicklung und Integration verteilter Systeme},
  year      = {2015},
  publisher = {dpunkt.verlag},
  pages     = {55--92}
}
@book{freeman2020headfirst,
  author    = {Eric Freeman and Elisabeth Robson},
  title     = {Head First Design Patterns},
  year      = {2020},
  edition   = {2},
  publisher = {O'Reilly Media},
  pages     = {1--30}
}
@book{flanagan2020javascript,
  author    = {David Flanagan},
  title     = {JavaScript: The Definitive Guide},
  year      = {2020},
  edition   = {7},
  publisher = {O'Reilly Media},
  pages     = {615--670}
}
@book{eeles2017software,
  author    = {Peter Eeles and Peter Cripps},
  title     = {The Essentials of Software Architecture},
  year      = {2017},
  publisher = {Pearson},
  pages     = {33--80}
}
```