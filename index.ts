import fs from "node:fs";

// @ts-ignore
import { processFeed } from "./process.ts";

async function run() {
  const feedUrl = process.argv[2];
  const templateFile = "./template.md";
  const outputDir = "./_output";

  try {
    if (!feedUrl) {
      throw new Error("Missing input feed_url");
    }
    if (!fs.existsSync(templateFile)) {
      throw new Error(
        "core.setFailed(`Template file '${templateFile}' does not exist.`)"
      );
    }

    const template = fs.readFileSync(templateFile, "utf8");
    await processFeed(feedUrl, template, outputDir);
  } catch (error) {
    if (error instanceof Error) {
      console.error("core.setFailed(error.message)", error.message);
    }
  }
}

run();
