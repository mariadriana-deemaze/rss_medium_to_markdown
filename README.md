# **RSS Medium to Markdown Action** 📖

A GitHub Action that fetches an RSS feed (such as a Medium blog feed), extracts its data, and converts it into markdown files using a provided template.

_Heavily inspired by [keiranlovett/rss-feed-to-markdown](https://github.com/keiranlovett/rss-feed-to-markdown), but tailored for Medium and structured markdown generation._

---

### **🚀 Features**
- Fetches articles from a Medium RSS feed:
    - Converts fetched content into markdown format  
    - Uses a customizable markdown template  
    - Saves output to a specified directory
    - Runs as a GitHub Action for automation  

---

### **🔧 Inputs**
| Name            | Type     | Required | Description |
|---------------|---------|----------|-------------|
| `FEED_URL` | `string` | ✅ | The RSS feed URL (e.g., Medium profile feed). |
| `TEMPLATE_FILE` | `string` | ✅ | Path to the markdown template file (e.g., `assets/template.md`). |
| `OUTPUT_DIR` | `string` | ✅ | Directory where markdown files will be saved. |

---

### **📌 Usage**
This action can be integrated into a GitHub workflow to automatically generate markdown files from an RSS feed.

### _Example Workflow_
Create a workflow file in `.github/workflows/rss-to-md.yml`:

```yaml
name: Generate Markdown from RSS

on:
  schedule:
    - cron: '0 0 * * 1'  # Runs every Monday at midnight UTC
  workflow_dispatch: # Allows manual execution

jobs:
  medium-rss-to-md:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Run RSS Feed to Markdown Action
        uses: mariadriana-deemaze/rss_medium_to_markdown@v1.0.0
        with:
          FEED_URL: "https://medium.com/feed/@some_handle"
          TEMPLATE_FILE: "assets/template.md"
          OUTPUT_DIR: "_output/events/"

      - name: Copy Generated Files to Repo
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add _output/events/
          git commit -m $'scheduled 🤖 : Update Medium articles\n\nCo-authored-by: user <user@idk.com>' || echo "No changes to commit"
          git push
```

---


### **🛠 Running Locally**
You can test this GitHub Action locally by running the Node.js script directly.

1. **Install dependencies**:
   ```sh
   yarn install
   ```

2. **Set up environment variables** export them in your terminal:
   ```sh
   export FEED_URL="https://medium.com/feed/@some_handle"
   export TEMPLATE_FILE="assets/template.md"
   export OUTPUT_DIR="_posts/events/"
   ```

3. **Run the action manually**:
   ```sh
   yarn start
   ```
   This will fetch the RSS feed, process it using the template, and generate markdown files in the specified directory.

---

## **📜 License**
This project is **open-source** under the [MIT License](LICENSE).
