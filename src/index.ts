import fs from "node:fs";
import core from "@actions/core";
import { processFeed } from "./process";

async function run() {
  const feedUrl = core.getInput("feed_url");
  const templateFile = "./template.md";
  const outputDir = "./_output";

  try {
    if (!feedUrl) {
      throw new Error("Missing input feed_url");
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
