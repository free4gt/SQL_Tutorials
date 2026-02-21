# SQL Tutorials

Hello! This repo is the home for our SQL learning materials. We aim to offer three things:

1. **Markdown courses** — Course content in markdown lives in `web_markdown_courses`.
2. **Video tutorials** — We will host video tutorials for SQL (embedded in the CMS where applicable).
3. **Postgres in Docker** — A Postgres Docker container that can be pre-loaded with tables for hands-on SQL.

---

## CMS (courses & lessons)

The **`cms`** app is a learning content management system. Content is driven by YAML in `cms/public/content/`:

- **Classes** (e.g. “Introduction to SQL”, “Practice Projects”, “Block showcase”) are defined in `classes.yaml`.
- Each class points to a **lesson YAML file** (e.g. `sql-intro.yaml`, `practice.yaml`, `demo.yaml`) that lists its lessons and **blocks**.

**Block types** include: header, paragraph, video, image, chart, table, **SQL interpreter** (run queries against a lesson-defined schema), divider, tabs, list, text section, and callout.

- **Demo class** — The **Block showcase** class (`demo`) has one lesson, **All blocks**, that walks through every block type and ends with **3 tab examples**; one of those examples is **3 sub-tabs, each with its own SQL editor**. Use it to see all blocks in one place.

For full CMS and block options, see **`cms/README.md`**.

---

*Still under construction — stay tuned!*
