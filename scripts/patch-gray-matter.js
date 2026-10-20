/**
 * gray-matter 4.x is incompatible with js-yaml 4+ (safeLoad removed).
 * Apply the same fix as patches/gray-matter+4.0.3.patch without patch-package.
 */
const fs = require("fs");
const path = require("path");

const enginesPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "gray-matter",
  "lib",
  "engines.js"
);

if (!fs.existsSync(enginesPath)) {
  process.exit(0);
}

let content = fs.readFileSync(enginesPath, "utf8");
if (content.includes("yaml.safeLoad || yaml.load")) {
  process.exit(0);
}

const updated = content.replace(
  "  parse: yaml.safeLoad.bind(yaml),\n  stringify: yaml.safeDump.bind(yaml)",
  "  parse: (yaml.safeLoad || yaml.load).bind(yaml),\n  stringify: (yaml.safeDump || yaml.dump).bind(yaml)"
);

if (updated === content) {
  console.warn(
    "patch-gray-matter: engines.js format changed; manual update may be needed"
  );
  process.exit(0);
}

fs.writeFileSync(enginesPath, updated);
