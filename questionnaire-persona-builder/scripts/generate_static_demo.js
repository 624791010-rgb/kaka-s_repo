#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { validateConfig } = require("./validate_config");

function fail(message) {
  throw new Error(message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function escapeForHtmlScript(value) {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
}

function generateStaticDemo(config, outputDir, options = {}) {
  validateConfig(config);

  if (fs.existsSync(outputDir) && !options.force) {
    fail(`output directory already exists: ${outputDir}`);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const templatePath = path.resolve(__dirname, "../assets/static-demo-template/index.template.html");
  const template = fs.readFileSync(templatePath, "utf8");
  const html = template
    .replaceAll("__TITLE__", config.meta.title)
    .replace("__CONFIG_JSON__", escapeForHtmlScript(config));

  fs.writeFileSync(path.join(outputDir, "index.html"), html, "utf8");

  return {
    output: path.join(outputDir, "index.html")
  };
}

if (require.main === module) {
  const [configPath, outputDir, forceFlag] = process.argv.slice(2);
  if (!configPath || !outputDir) {
    console.error("Usage: node generate_static_demo.js <config.json> <output-dir> [--force]");
    process.exit(2);
  }

  try {
    const result = generateStaticDemo(readJson(path.resolve(configPath)), path.resolve(outputDir), {
      force: forceFlag === "--force"
    });
    console.log(JSON.stringify({ ok: true, ...result }, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { generateStaticDemo };
