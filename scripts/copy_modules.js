import fs from "fs-extra"

async function copyModules() {
  try {
    console.log("Copying node_modules to dist...");
    await fs.copy("node_modules", "dist/node_modules");
    console.log("✅ node_modules copied successfully!");
  } catch (err) {
    console.error("❌ Error copying node_modules:", err);
    process.exit(1);
  }
}

copyModules();
