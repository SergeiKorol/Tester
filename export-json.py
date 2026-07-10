#!/usr/bin/env python3
"""Export legacy .js manifest and topic files to content/*.json."""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

APP_DIR = Path(__file__).resolve().parent
CONTENT_DIR = APP_DIR.parent / "content"
MANIFEST_JS = APP_DIR / "manifest.js"


def _run_node(script: str, *args: str) -> str:
    """Run a short Node.js snippet and return stdout."""
    result = subprocess.run(
        ["node", "-e", script, *args],
        capture_output=True,
        text=True,
        encoding="utf-8",
        check=False,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or "node failed")
    return result.stdout.strip()


def load_manifest_js(path: Path) -> list[dict]:
    """Parse window.QUIZ_MANIFEST from manifest.js."""
    script = r"""
const fs = require("fs");
const path = process.argv[1];
const window = {};
eval(fs.readFileSync(path, "utf8"));
if (!window.QUIZ_MANIFEST) {
  console.error("QUIZ_MANIFEST not found");
  process.exit(1);
}
process.stdout.write(JSON.stringify(window.QUIZ_MANIFEST));
"""
    raw = _run_node(script, str(path))
    return json.loads(raw)


def load_topic_js(path: Path) -> list[dict]:
    """Parse questions from a legacy topic .js file."""
    script = r"""
const fs = require("fs");
const path = process.argv[1];
let captured = null;
const QuizTopicRegistry = {
  register(id, questions) { captured = questions; }
};
const window = {};
eval(fs.readFileSync(path, "utf8"));
if (!captured && window.QUIZ_DATA && window.QUIZ_DATA.questions) {
  captured = window.QUIZ_DATA.questions;
}
if (!captured) {
  console.error("No questions found in " + path);
  process.exit(1);
}
process.stdout.write(JSON.stringify(captured));
"""
    raw = _run_node(script, str(path))
    return json.loads(raw)


def js_path_to_json_name(js_path: str) -> str:
    """Map manifest path like data_type.js to data_type.json."""
    name = Path(js_path).name
    if name.endswith(".js"):
        return name[:-3] + ".json"
    return name + ".json"


def main() -> None:
    if not MANIFEST_JS.is_file():
        raise SystemExit(f"Missing {MANIFEST_JS}")

    try:
        subprocess.run(["node", "--version"], capture_output=True, check=True)
    except (FileNotFoundError, subprocess.CalledProcessError) as exc:
        raise SystemExit("Node.js required for export-json.py") from exc

    manifest = load_manifest_js(MANIFEST_JS)
    CONTENT_DIR.mkdir(parents=True, exist_ok=True)

    out_manifest: list[dict] = []
    for entry in manifest:
        js_path = APP_DIR / entry["path"]
        if not js_path.is_file():
            raise SystemExit(f"Topic file not found: {js_path}")

        questions = load_topic_js(js_path)
        json_name = js_path_to_json_name(entry["path"])
        topic_out = CONTENT_DIR / json_name
        topic_out.write_text(
            json.dumps({"questions": questions}, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

        out_entry = {
            "id": entry["id"],
            "path": json_name,
        }
        if entry.get("title"):
            out_entry["title"] = entry["title"]
        out_manifest.append(out_entry)
        print(f"  {json_name}: {len(questions)} questions")

    manifest_out = CONTENT_DIR / "manifest.json"
    manifest_out.write_text(
        json.dumps(out_manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"OK: {manifest_out} ({len(out_manifest)} topics)")


if __name__ == "__main__":
    main()
