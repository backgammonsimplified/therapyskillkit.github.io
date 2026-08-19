# Generic Quarto learning-site template

This repository is intentionally structured as a reusable learning-site starter. Therapy Skill Kit is the first content implementation, not a requirement of the architecture.

## Source of truth

Edit source files under `site/`. Do not hand-edit rendered HTML.

- `site/_quarto.yml`: site shell, navbar, footer, theme, render hooks.
- `site/_learn-navigation.yml`: Learn sidebar structure.
- `site/index.qmd`: landing page.
- `site/learn/*.qmd`: learning modules.
- `site/skills-finder/index.qmd`: interactive finder page shell.
- `site/data/skills.json`: finder catalog and deep links.
- `site/assets/tsk-theme.scss`: theme variables and Quarto theme rules.
- `site/assets/tsk-shared.css`: shared editorial layouts.
- `site/assets/tsk-components.css`: reusable components and finder UI.
- `site/assets/skills-finder.js`: browser-only matching logic.
- `site/includes/`: shared HTML includes.
- `scripts/`: validation, render, and preview commands.

Rendered output is written to `site/_site/` and ignored by Git.

## Rebrand the template

1. Change title, description, navbar, footer, and repository link in `site/_quarto.yml`.
2. Replace `site/assets/logo.svg`.
3. Rename or adjust the `--tsk-*` variables in `site/assets/tsk-theme.scss` if desired.
4. Rewrite `site/index.qmd` and `site/about.qmd`.
5. Replace the Learn pages and update `site/_learn-navigation.yml`.
6. Replace `site/data/skills.json` if the new site uses the finder pattern.
7. Keep `scripts/check_site.py` in sync with any new finder data schema.

## Add a learning module

1. Add a new `.qmd` file under `site/learn/`.
2. Give important skill sections stable explicit IDs, for example:

   ```markdown
   ## Example skill {#example-skill}
   ```

3. Add the page to `site/_learn-navigation.yml`.
4. If the Skills Finder should recommend it, add an item to `site/data/skills.json` using the rendered `.html` path and explicit anchor.
5. Run `make check` and `make build`.

The pre-render and post-render checks will fail if a finder entry targets a missing source page, missing source anchor, missing rendered page, or missing rendered anchor.

## Local development

Requirements:

- Quarto
- Python 3.9 or newer
- Bash for the helper scripts

Commands:

```bash
make check
make build
make preview
```

`make preview` serves the Quarto preview on port 8765 by default. To choose another port:

```bash
bash scripts/preview-site.sh 9000
```

## Deployment

`.github/workflows/pages.yml` installs Quarto, runs the full validated render, uploads `site/_site`, and deploys the artifact with GitHub Pages. Rendered HTML does not need to be committed to the source branch.

## Codex handoff

Good next tasks for Codex include expanding lesson depth, adding tests for the finder ranking, extracting additional reusable components, improving content metadata, adding search/filtering to Learn, and introducing structured content generation only where it clearly improves maintainability.
