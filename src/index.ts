import fs from "node:fs";
import core from "@actions/core";
import { processFeed } from "./process.js";

async function run() {
  //const feedUrl = core.getInput("FEED_URL");
  const feedUrl = process.env.FEED_URL;
  const templateFile = "../src/template.md";
  const outputDir = "./_output";

  try {
    if (!feedUrl) {
      throw new Error("Missing input FEED_URL");
    }
    if (!fs.existsSync(templateFile)) {
      throw new Error(`Template file '${templateFile}' does not exist.`);
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
