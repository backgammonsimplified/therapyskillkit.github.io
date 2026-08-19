# Therapy Skill Kit

Therapy Skill Kit is a Quarto learning site for practical CBT, DBT, mindfulness, goal-setting, wellness, relationship, emotion-regulation, and recreativity skills.

The repository is also intended to function as a generic learning-site template. The authored source lives under `site/`; generated HTML is not the source of truth.

## Repository layout

```text
.github/workflows/pages.yml   Render and deploy Quarto to GitHub Pages
scripts/                      Validation, build, and preview helpers
site/
  _quarto.yml                 Website configuration
  _learn-navigation.yml       Learn sidebar navigation
  index.qmd                   Landing page
  about.qmd                   About page
  404.qmd                     Not-found page
  learn/                      Authored learning modules
  skills-finder/              Skills Finder Quarto page
  data/skills.json            Skills Finder catalog
  assets/                     Theme, components, logo, app JavaScript
  includes/                   Shared HTML includes
TEMPLATE.md                   Reuse and Codex handoff notes
```

## Requirements

- Quarto
- Python 3.9 or newer
- Bash for helper scripts

No Python packages are required for the current build.

## Development

Validate source:

```bash
make check
```

Render the full website:

```bash
make build
```

Preview with live Quarto rendering:

```bash
make preview
```

Rendered output is written to `site/_site/` and ignored by Git.

## Build invariants

`site/_quarto.yml` runs validation before and after rendering.

The validation checks:

- required project source files exist,
- `site/data/skills.json` is valid and has unique skill IDs,
- every Skills Finder entry targets an existing Learn `.qmd` file,
- every deep link targets an explicit source anchor,
- rendered pages exist,
- rendered anchors still resolve after Quarto builds the site.

This makes the finder data and Learn content safe to evolve independently without silently breaking navigation.

## Deployment

Pushes to `main` trigger `.github/workflows/pages.yml`. The workflow installs Quarto and Python, runs the validated build, uploads `site/_site`, and deploys that artifact to GitHub Pages.

The repository should use GitHub Pages with **Source: GitHub Actions**.

## Reusing the template

See [`TEMPLATE.md`](TEMPLATE.md) for the customization map, how to add lessons, and recommended next tasks for Codex.

## Content scope

The site is educational. It is not a diagnosis tool, crisis service, or substitute for individualized medical or mental-health care. Content should remain original and should not reproduce proprietary therapy worksheets.
