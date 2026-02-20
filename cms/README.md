# Free Learning Content Management System

A free, open learning content management system for courses and lessons. Content is driven by YAML files in the **`public`** section: you configure **classes** (e.g. “Introduction to SQL”) and **lesson YAML files** that list lessons and their **blocks** (header, paragraph, video, image, chart). This README explains the two configuration files and all **block options** you can use.

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

## Summary

| File / concept      | Purpose |
|---------------------|--------|
| `public/content/classes.yaml` | Lists courses; each course has `name`, `title`, and `lessonsYaml` (the lesson file). |
| Lesson YAML (e.g. `sql-intro.yaml`) | Defines `lessons`: mix of `lesson` (button + blocks) and `lesson_category` (section label). |
| Blocks               | Each block type (`header`, `paragraph`, `video`, `image`, `chart`) has specific options; order in `blocks` is the order on the page. |

All content lives under **`public`**: put lesson YAML files in `public/content/` and images in `public/images/`.
