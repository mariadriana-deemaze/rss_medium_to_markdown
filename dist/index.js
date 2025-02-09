"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const core_1 = __importDefault(require("@actions/core"));
const process_1 = require("./process");
async function run() {
    const feedUrl = core_1.default.getInput("feed_url");
    const templateFile = "./template.md";
    const outputDir = "./_output";
    try {
        if (!feedUrl) {
            throw new Error("Missing input feed_url");
        }
        if (!node_fs_1.default.existsSync(templateFile)) {
            throw new Error(`Template file '${templateFile}' does not exist.`);
        }
        const template = node_fs_1.default.readFileSync(templateFile, "utf8");
        await (0, process_1.processFeed)(feedUrl, template, outputDir);
    }
    catch (error) {
        if (error instanceof Error) {
            core_1.default.setFailed(error.message);
        }
        core_1.default.setFailed("Unknown error.");
    }
}
run();
