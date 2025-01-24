
# Deploy in Astro and github pages

```bash
1. Create a new GitHub repository for your project.
2. Initialize a new Astro project in your local environment.
3. Install Astro dependencies using `npm install`.
4. Add required integrations (e.g., `mdx`, `sitemap`, etc.) in `astro.config.mjs`.
5. Configure the `site` property in `astro.config.mjs` with the final domain URL (e.g., GitHub Pages or a custom domain).
6. Add the `base` property in `astro.config.mjs` (e.g., `/repository-name/` for GitHub Pages project pages or `/` for a custom domain).
7. Add scripts in `package.json` for `dev`, `build`, `preview`, and `deploy`.
8. Install the `gh-pages` package if deploying manually or include it in `package.json`.
9. Build the site using `npm run build` to generate the static files in the `dist` folder.
10. Create a `.github/workflows/deploy.yaml` file in the repository for GitHub Actions deployment.
11. Configure the `deploy.yaml` file to automate builds and deployment to the `gh-pages` branch.
12. Add a `CNAME` file in the `dist` folder with the custom domain name if using a custom domain.
13. Push the `deploy.yaml` file and all changes to the main branch of your GitHub repository.
14. Go to GitHub repository settings and enable GitHub Pages with the `gh-pages` branch as the source.
15. Set up a CNAME record in your DNS provider to point your custom subdomain to `zzigo.github.io`.
16. Test the deployment by pushing a change to the `main` branch and verifying it triggers the GitHub Actions workflow.
17. Verify the site is live at the custom domain or GitHub Pages URL.
18. Check that the DNS propagation is complete for the custom domain.
19. Troubleshoot any deployment or domain issues (e.g., base URL, DNS settings, or workflow errors).
20. Confirm the workflow automates deployment successfully for future pushes.
```