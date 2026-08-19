#!/usr/bin/env python3
"""Validate the generic Quarto learning-site source and rendered output."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

REPO_ROOT = Path(__file__).resolve().parents[1]
SITE_ROOT = REPO_ROOT / "site"
CATALOG_PATH = SITE_ROOT / "data" / "skills.json"
REQUIRED_SKILL_KEYS = {
    "id",
    "title",
    "category",
    "href",
    "description",
    "feelings",
    "keywords",
    "intensity",
}


def fail(message: str) -> None:
    raise SystemExit(f"ERROR: {message}")


def load_catalog() -> list[dict]:
    try:
        data = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    except FileNotFoundError:
        fail(f"missing catalog: {CATALOG_PATH.relative_to(REPO_ROOT)}")
    except json.JSONDecodeError as exc:
        fail(f"invalid JSON in {CATALOG_PATH.relative_to(REPO_ROOT)}: {exc}")

    if not isinstance(data, list) or not data:
        fail("skills catalog must be a non-empty JSON array")
    return data


def validate_skill_shape(skill: dict, seen_ids: set[str]) -> None:
    if not isinstance(skill, dict):
        fail("each skill catalog entry must be an object")

    missing = REQUIRED_SKILL_KEYS.difference(skill)
    if missing:
        fail(f"skill is missing required keys {sorted(missing)}: {skill}")

    skill_id = skill["id"]
    if not isinstance(skill_id, str) or not skill_id.strip():
        fail("skill id must be a non-empty string")
    if skill_id in seen_ids:
        fail(f"duplicate skill id: {skill_id}")
    seen_ids.add(skill_id)

    if not isinstance(skill["feelings"], list) or not isinstance(skill["keywords"], list):
        fail(f"feelings and keywords must be arrays for {skill_id}")

    intensity = skill["intensity"]
    if (
        not isinstance(intensity, list)
        or len(intensity) != 2
        or not all(isinstance(value, int) for value in intensity)
        or intensity[0] < 1
        or intensity[1] > 10
        or intensity[0] > intensity[1]
    ):
        fail(f"intensity must be [min, max] within 1..10 for {skill_id}")


def href_parts(href: str) -> tuple[str, str]:
    parsed = urlsplit(href)
    if parsed.scheme or parsed.netloc:
        fail(f"skill href must be local, received: {href}")
    return parsed.path, parsed.fragment


def source_path_for_href(href: str) -> tuple[Path, str]:
    path, fragment = href_parts(href)
    if not path.startswith("../learn/") or not path.endswith(".html"):
        fail(f"skill href must target ../learn/*.html, received: {href}")
    qmd_name = Path(path).name.removesuffix(".html") + ".qmd"
    return SITE_ROOT / "learn" / qmd_name, fragment


def validate_source() -> None:
    required = [
        SITE_ROOT / "_quarto.yml",
        SITE_ROOT / "index.qmd",
        SITE_ROOT / "learn" / "index.qmd",
        SITE_ROOT / "skills-finder" / "index.qmd",
        SITE_ROOT / "assets" / "skills-finder.js",
    ]
    for path in required:
        if not path.exists():
            fail(f"missing required source file: {path.relative_to(REPO_ROOT)}")

    catalog = load_catalog()
    seen_ids: set[str] = set()

    for skill in catalog:
        validate_skill_shape(skill, seen_ids)
        source_path, fragment = source_path_for_href(skill["href"])
        if not source_path.exists():
            fail(f"skill {skill['id']} targets missing source page: {source_path.relative_to(REPO_ROOT)}")
        if fragment:
            text = source_path.read_text(encoding="utf-8")
            explicit_anchor = f"{{#{fragment}}}"
            heading_anchor = re.compile(rf"^#+\s+.*\{{#{re.escape(fragment)}\}}\s*$", re.MULTILINE)
            if explicit_anchor not in text and not heading_anchor.search(text):
                fail(f"skill {skill['id']} targets missing source anchor #{fragment} in {source_path.name}")

    print(f"Source validation passed: {len(catalog)} skills, {len(seen_ids)} unique ids.")


def validate_rendered() -> None:
    output = SITE_ROOT / "_site"
    required = [
        output / "index.html",
        output / "learn" / "index.html",
        output / "skills-finder" / "index.html",
    ]
    for path in required:
        if not path.exists():
            fail(f"missing rendered page: {path.relative_to(REPO_ROOT)}")

    catalog = load_catalog()
    for skill in catalog:
        path, fragment = href_parts(skill["href"])
        target = (output / "skills-finder" / path).resolve()
        try:
            target.relative_to(output.resolve())
        except ValueError:
            fail(f"rendered href escapes output directory: {skill['href']}")

        if not target.exists():
            fail(f"rendered skill target missing for {skill['id']}: {target.relative_to(output)}")

        if fragment:
            html = target.read_text(encoding="utf-8")
            if f'id="{fragment}"' not in html:
                fail(f"rendered anchor #{fragment} missing for {skill['id']} in {target.relative_to(output)}")

    print(f"Rendered validation passed: {len(catalog)} skill links resolved.")


def main() -> None:
    mode = sys.argv[1] if len(sys.argv) > 1 else "source"
    if mode == "source":
        validate_source()
    elif mode == "rendered":
        validate_rendered()
    else:
        fail("usage: python scripts/check_site.py [source|rendered]")


if __name__ == "__main__":
    main()
