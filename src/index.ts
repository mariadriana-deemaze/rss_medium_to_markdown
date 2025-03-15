import fs from "node:fs";
import core from "@actions/core";
import { processFeed } from "./process.js";

async function run() {
  try {
    const feedUrl = core.getInput("FEED_URL");
    const templateFile = core.getInput("TEMPLATE_FILE");
    const outputDir = core.getInput("OUTPUT_DIR");
    fs.mkdirSync(outputDir, { recursive: true });

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
