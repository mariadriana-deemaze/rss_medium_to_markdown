import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import core from "@actions/core";
import { processFeed } from "./process.js";

async function run() {
  const feedUrl = process.env.FEED_URL;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const templateFile = path.resolve(__dirname, "../src/template.md");
  const outputDir = path.resolve(__dirname, "../_output");
  fs.mkdirSync(outputDir, { recursive: true });

  try {
    if (!feedUrl) {
      throw new Error("Missing input FEED_URL");
    }

    if (!fs.existsSync(templateFile)) {
      throw new Error(`Template file does not exist.`);
    }

    const template = fs.readFileSync(templateFile, "utf8");
    await processFeed(feedUrl, template, outputDir);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
    core.setFailed("Unknown error.");
  }
}

run();
