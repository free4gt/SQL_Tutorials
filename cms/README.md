# Free Learning Content Management System

A free, open learning content management system for courses and lessons. Content is driven by YAML files in the **`public`** section: you configure **classes** (e.g. “Introduction to SQL”, “Content type explanation”) and **lesson YAML files** that list lessons and their **blocks**. Block types include: **header**, **paragraph**, **video**, **image**, **chart**, **table**, **sql** (interpreter), **divider**, **tabs**, **list**, **text_section**, and **callout**. This README explains the two configuration files and all **block options** you can use.

---

## The two configuration files

### 1. `public/content/classes.yaml`

This file defines the **courses** (classes) that appear in the app (e.g. in the navbar dropdown). Each class points to a **lesson YAML file** that holds its lessons.

| Field         | Description |
|--------------|-------------|
| `name`       | Unique id for the class (e.g. `sql-intro`). |
| `title`      | Display name (e.g. “Introduction to SQL”). |
| `lessonsYaml`| Filename of the lesson YAML in `public/content/` (e.g. `sql-intro.yaml`). |

**Example:**

```yaml
classes:
  - class:
      name: 'sql-intro'
      title: 'Introduction to SQL'
      lessonsYaml: 'sql-intro.yaml'
  - class:
      name: 'practice'
      title: 'Practice Projects'
      lessonsYaml: 'practice.yaml'
  - class:
      name: 'demo'
      title: 'Content type explanation'
      lessonsYaml: 'demo.yaml'
```

### 2. The lesson YAML file (e.g. `public/content/sql-intro.yaml`)

This is the file named by `lessonsYaml` in `classes.yaml`. It defines the **lessons** for that class. Each lesson has a **button** (label in the lesson list) and a list of **blocks** (the content shown in the main area). You can also insert **lesson categories** (section labels) in the list.

- **Top-level key:** `lessons` — a list of items.
- Each item is either:
  - **`lesson:`** — A lesson with `button` and `blocks`.
  - **`lesson_category:`** (or **`category:`**) — A section label in the lesson list (e.g. “Industrial Era”). Uses `text` or `label`; no blocks.

**Lesson entry:**

| Field    | Description |
|----------|-------------|
| `button` | Object with `text` — label shown in the lesson list. Supports inline math (e.g. `\( x^2 \)`). |
| `blocks` | List of block objects. Each block is a single key (block type) with an object of options (see below). Order is preserved. |

**Category entry:**

| Field | Description |
|-------|-------------|
| `text` or `label` | Label shown as a section divider in the lesson list. |

**Example:**

```yaml
lessons:
  - lesson:
      button:
        text: 'My First Lesson'
      blocks:
        - header:
            text: 'Welcome'
        - paragraph:
            text: 'Some body text.'
  - lesson_category:
      text: 'Advanced'
  - lesson:
      button:
        text: 'Second Lesson'
      blocks:
        - header:
            text: 'Second'
        - video:
            src: 'https://www.youtube.com/embed/VIDEO_ID'
```

Blocks can use **inline math** (KaTeX) in `text` with `\( ... \)`, `\[ ... \]`, or `$` / `$$` (use single-quoted YAML strings for safety).

---

## Block Vue options and configuration

Every lesson’s content is built from **blocks**. Each block is written in YAML as one key (the block type) with an object of **options** underneath. Block order in the `blocks` array is the order they appear on the page.

### `header`

Renders a main heading (e.g. lesson title).

| Option | Type   | Description |
|--------|--------|-------------|
| `text` | string | Heading text. Supports inline math (KaTeX). |

**YAML example:**

```yaml
- header:
    text: 'Introduction to SQL \( E = mc^2 \)'
```

---

### `paragraph`

Renders a body paragraph.

| Option | Type   | Description |
|--------|--------|-------------|
| `text` | string | Paragraph body. Supports inline math (KaTeX). |

**YAML example:**

```yaml
- paragraph:
    text: 'Here is some content with math \( \int_0^1 x^2 \, dx \).'
```

---

### `video`

Embeds a video in a 16∶9 container (e.g. YouTube embed).

| Option | Type   | Description |
|--------|--------|-------------|
| `src`  | string | Embed URL (e.g. `https://www.youtube.com/embed/VIDEO_ID`). |

**YAML example:**

```yaml
- video:
    src: 'https://www.youtube.com/embed/M0HYcnwMIjQ'
```

---

### `image`

Shows an image. The `src` is resolved under `public/images/` (do not include `/images/` in the path).

| Option | Type   | Description |
|--------|--------|-------------|
| `src`  | string | Path relative to `public/images/` (e.g. `diagram.png` or `slides/intro.png`). |
| `alt`  | string | Optional. Alt text for accessibility. |

**YAML example:**

```yaml
- image:
    src: 'diagram.png'
    alt: 'Schema diagram'
```

---

### `chart`

Renders a Chart.js chart (line, bar, or pie). Options are merged with Chart.js defaults (`responsive: true`, `maintainAspectRatio: false`).

| Option      | Type   | Description |
|-------------|--------|-------------|
| `chartType` | string | One of: `line`, `bar`, `pie`. Default: `line`. |
| `data`      | object | Chart data: `labels` (array of strings) and `datasets` (array of dataset objects). Same shape as [Chart.js data](https://www.chartjs.org/docs/latest/general/data-structures.html). |
| `options`   | object | Optional. Chart.js options (e.g. `plugins.title`, scales, etc.). Merged over defaults. |

**Dataset objects** (for line/bar) typically include: `label`, `data` (array of numbers), `borderColor`, `backgroundColor`, `tension` (line). For **pie**, a single dataset with `data` and `backgroundColor` (array of colors) is common.

**YAML example (line chart with title):**

```yaml
- chart:
    chartType: line
    data:
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
      datasets:
        - label: 'Views'
          data: [12, 19, 8, 15, 22]
          borderColor: 'rgb(75, 192, 192)'
          backgroundColor: 'rgba(75, 192, 192, 0.2)'
          tension: 0.3
    options:
      plugins:
        title:
          display: true
          text: 'Monthly Views'
```

**YAML example (bar chart):**

```yaml
- chart:
    chartType: bar
    data:
      labels: ['SQL', 'Python', 'JS']
      datasets:
        - label: 'Students'
          data: [65, 49, 72]
          backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 206, 86, 0.6)']
    options:
      plugins:
        title:
          display: true
          text: 'Students by Language'
```

**YAML example (pie chart):**

```yaml
- chart:
    chartType: pie
    data:
      labels: ['Completed', 'In progress', 'Not started']
      datasets:
        - data: [45, 30, 25]
          backgroundColor: ['#4ade80', '#fbbf24', '#94a3b8']
    options:
      plugins:
        title:
          display: true
          text: 'Lesson Progress'
```

---

### `table`

Renders a data table with optional caption, sortable columns, and filterable columns.

| Option      | Type    | Description |
|-------------|---------|-------------|
| `caption`  | string  | Optional. Table caption. |
| `headers`  | array   | Column headers. |
| `rows`     | array   | Array of rows (each row an array of cell values). |
| `footer`   | array   | Optional. Single footer row. |
| `sortable` | boolean | If true, column headers are clickable to sort. Default: false. |
| `filterable` | boolean | If true, filter inputs appear below headers. Default: false. |

**YAML example:**

```yaml
- table:
    caption: 'Scores'
    headers: ['Name', 'Score']
    rows:
      - ['Alice', '95']
      - ['Bob', '87']
```

---

### `sql`

SQL interpreter block: students run queries against a lesson-defined schema (single table or multiple tables). Supports validation against a solution query.

| Option        | Type   | Description |
|---------------|--------|-------------|
| `tableName`   | string | Name of the single table (when not using `tables`). Default: `'table'`. |
| `columns`     | array  | Column names for the single table. |
| `rows`        | array  | Row data (array of arrays) for the single table. |
| `tables`      | array  | Optional. Multiple tables: each `{ tableName, columns, rows }`. Overrides single table. |
| `solution`   | string | Solution query; result is compared to the user’s result for validation. |
| `instructions` | string | Optional. Instructions shown in the block. |

**YAML example (single table):**

```yaml
- sql:
    tableName: 'products'
    columns: ['id', 'name', 'price']
    rows:
      - ['1', 'Widget', '9.99']
      - ['2', 'Gadget', '14.50']
    solution: 'SELECT * FROM products'
    instructions: 'Run a query that matches the solution.'
```

**YAML example (multiple tables):** use `tables: [ { tableName, columns, rows }, ... ]`.

---

### `divider`

A horizontal divider with an optional caption (section label).

| Option   | Type   | Description |
|----------|--------|-------------|
| `caption` | string | Optional. Text shown above the line. |

**YAML example:**

```yaml
- divider:
    caption: 'Next section'
```

---

### `tabs`

A set of tabs; each tab has a name and a list of blocks. Blocks can be any type (including nested `tabs` or `sql`).

| Option | Type  | Description |
|--------|-------|-------------|
| `tabs` | array | List of tab objects. Each has `name` and `blocks` (array of block objects). |

**YAML example:**

```yaml
- tabs:
    tabs:
      - tab:
          name: 'Example 1'
          blocks:
            - paragraph:
                text: 'Content for first tab.'
      - tab:
          name: 'Example 2'
          blocks:
            - sql:
                tableName: 't1'
                columns: ['id', 'x']
                rows: [['1', 'a']]
                solution: 'SELECT * FROM t1'
```

---

### `list`

A bullet list.

| Option  | Type  | Description |
|---------|-------|-------------|
| `items` | array | List of strings (one per item). Supports inline math (KaTeX). |

**YAML example:**

```yaml
- list:
    items:
      - 'First item'
      - 'Second item'
```

---

### `text_section`

A bordered container that groups **header**, **paragraph**, and **list** blocks.

| Option  | Type  | Description |
|---------|-------|-------------|
| `blocks` | array | Block objects; only `header`, `paragraph`, and `list` are allowed. |

**YAML example:**

```yaml
- text_section:
    blocks:
      - header:
          text: 'Section title'
      - paragraph:
          text: 'Body text.'
      - list:
          items: ['A', 'B']
```

---

### `callout`

A callout (aside) with an optional title and inner blocks. Allowed inner types: header, paragraph, list, table, chart, image, divider, tabs, text_section (no video or sql).

| Option   | Type   | Description |
|----------|--------|-------------|
| `title`  | string | Optional. Callout title. |
| `blocks` | array  | Block objects (header, paragraph, list, table, chart, image, divider, tabs, text_section). |

**YAML example:**

```yaml
- callout:
    title: 'Tip'
    blocks:
      - paragraph:
          text: 'Remember to run the solution query first.'
      - list:
          items: ['Step one', 'Step two']
```

---

## Content type explanation (demo class)

The **demo** class (`demo.yaml`) explains each content block type in its own lesson, from easy to complex: **Intro** (what is a content block), **Header**, **Paragraph**, **List**, **Divider**, **Text section**, **Table** (one example per option, max 5), **Chart**, **Callout**, **Video**, **SQL interpreter** (Postgres in the browser, reset on Start, properties), and **Tabs** (multiple examples, including 3 tabs each with a SQL editor). Use the **Content type explanation** class in the app.

---

## Summary

| File / concept      | Purpose |
|---------------------|--------|
| `public/content/classes.yaml` | Lists courses; each has `name`, `title`, and `lessonsYaml`. |
| Lesson YAML (e.g. `sql-intro.yaml`, `demo.yaml`) | Defines `lessons`: mix of `lesson` (button + blocks) and `lesson_category` (section label). |
| Blocks               | Types: `header`, `paragraph`, `video`, `image`, `chart`, `table`, `sql`, `divider`, `tabs`, `list`, `text_section`, `callout`. Order in `blocks` is the order on the page. |

All content lives under **`public`**: put lesson YAML files in `public/content/` and images in `public/images/`.
