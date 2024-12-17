const fs = require("fs");
const path = require("path");

// Path to the root directory
const rootDir = process.cwd();

// Function to get all subdirectories
function getSubdirectories(baseDir) {
  return fs.readdirSync(baseDir).filter((file) => {
    return (
      fs.statSync(path.join(baseDir, file)).isDirectory() &&
      !file.startsWith(".")
    );
  });
}

// Generate pnpm-workspace.yaml content
function generatePnpmWorkspace() {
  const folders = getSubdirectories(rootDir);
  const yamlContent =
    `packages:\n` + folders.map((dir) => `  - '${dir}'`).join("\n");

  // Write to pnpm-workspace.yaml
  fs.writeFileSync("pnpm-workspace.yaml", yamlContent);
  console.log("pnpm-workspace.yaml generated successfully!");
}

// Run the script
generatePnpmWorkspace();
