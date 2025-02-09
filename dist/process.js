"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFeed = processFeed;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const axios_1 = __importDefault(require("axios"));
const turndown_1 = __importDefault(require("turndown"));
const xml2js_1 = require("xml2js");
const core_1 = __importDefault(require("@actions/core"));
/**
 * Main feed processor
 *
 * @param url The RSS feed URL
 * @param template The base template to generate markdown from
 * @param outputDir The root in which the files generate will be saved to
 */
async function processFeed(url, template, outputDir) {
    try {
        const feedData = await fetchAndParseFeed(url);
        let items = feedData.rss.channel?.[0]?.item || [];
        [items[0]].forEach((item) => {
            try {
                const { output, date, title } = generateFeedMarkdown(template, item);
                const filePath = saveMarkdown(outputDir, title, output, date);
                core_1.default.info(`Markdown file '${filePath}' created.`);
            }
            catch (error) {
                core_1.default.error(`Error processing feed entry for ${url}`);
            }
        });
    }
    catch (error) {
        core_1.default.error(`Error processing feed at ${url}`);
    }
}
/**
 * Fetch RSS feed and data, and parses it from XML to a valid JS object
 *
 * @param url URL of the RSS feed
 * @returns
 */
async function fetchAndParseFeed(url) {
    const response = await axios_1.default.get(url);
    const feedData = response.data;
    const parsed = await (0, xml2js_1.parseStringPromise)(feedData);
    return parsed;
}
/**
 * Markdown generator
 *
 * @param template The base template to generate markdown from
 * @param entry Parsed feed item
 * @returns
 */
const generateFeedMarkdown = (template, entry) => {
    const id = entry.guid?.[0]._.split("/").pop() || "";
    const date = entry.pubDate?.[0];
    const link = (entry.link?.[0] || "").trim();
    const titleRaw = entry.title[0] || "";
    const title = titleRaw.replace(/[^\w\s-]/g, "") || "";
    const slug = title.toLowerCase().replaceAll(" ", "-");
    const content = entry["content:encoded"]?.[0];
    const description = content
        ? content
            .replace(/(<([^>]+)>)/gi, "")
            .split(" ")
            .splice(0, 50)
            .join(" ")
        : "";
    const markdown = new turndown_1.default({
        codeBlockStyle: "fenced",
        fence: "```",
        bulletListMarker: "-",
    }).turndown(content);
    const categories = entry.category || [];
    return generateOutput(template, {
        id,
        date,
        link,
        slug,
        title,
        content,
        markdown,
        description,
        categories,
    });
};
/**
 *
 * @param template The base template to generate markdown from
 * @param data Parsed data from the feed
 * @returns Object with output and its title and date
 */
const generateOutput = (template, data) => {
    const output = template
        .replaceAll("[ID]", data.id || "")
        .replaceAll("[DATE]", data.date || "")
        .replaceAll("[LINK]", data.link || "")
        .replaceAll("[SLUG]", data.slug || "")
        .replaceAll("[TITLE]", (data.title.trim() || "").replace(/\s+/g, " "))
        .replaceAll("[DESCRIPTION]", typeof data.description === "string"
        ? data.description.replace(/\s+/g, " ")
        : "")
        .replaceAll("[CONTENT]", data.content || "")
        .replaceAll("[MARKDOWN]", data.markdown || "")
        .replaceAll("[CATEGORIES]", (data.categories || []).join(","));
    return { output, date: data.date || "", title: data.title || "" };
};
/**
 * Save the generated markdown file.
 *
 * @param outputDir Folder in which the output files are stored
 * @param title Title of the item
 * @param markdown Content of the MD file
 * @param date Date of publish
 * @returns File path of the generated file
 */
function saveMarkdown(outputDir, title, markdown, date) {
    const formattedDate = date ? new Date(date).toISOString().split("T")[0] : "";
    const slug = `${formattedDate}-${title.toLowerCase().replace(" ", "-")}`; // TODO: Review necessity for sanitize
    const filePath = node_path_1.default.join(outputDir, `${slug}.md`);
    node_fs_1.default.writeFileSync(filePath, markdown);
    return filePath;
}
