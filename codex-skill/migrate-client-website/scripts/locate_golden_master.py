#!/usr/bin/env python3
"""Locate and validate the registered premium business golden master."""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any


TEMPLATE_NAME = "premium-business-template"
REGISTERED_ROOT = Path(
    "/Users/linas/.codex/.chatgpt-projects/"
    "g-p-6a7d9b2bc5f08191833a1f25a2d3d195/"
    "premium-business-template"
)
PROJECTS_ROOT = Path("/Users/linas/.codex/.chatgpt-projects")
REQUIRED_PATHS = (
    "template.lock.json",
    "template.lock.snapshot.json",
    "template.lock.schema.json",
    "scripts/check-template-lock.mjs",
    "package.json",
    "src/template",
    ".git",
)


def git_value(root: Path, *args: str) -> str:
    result = subprocess.run(
        ("git", "-C", str(root), *args),
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout.strip()


def candidate_report(root: Path) -> dict[str, Any]:
    missing = [item for item in REQUIRED_PATHS if not (root / item).exists()]
    report: dict[str, Any] = {
        "path": str(root),
        "missing": missing,
        "valid": False,
        "clean": False,
    }
    if missing:
        return report

    try:
        with (root / "template.lock.json").open(encoding="utf-8") as handle:
            json.load(handle)
        with (root / "template.lock.snapshot.json").open(encoding="utf-8") as handle:
            json.load(handle)
        with (root / "package.json").open(encoding="utf-8") as handle:
            package = json.load(handle)

        scripts = package.get("scripts", {})
        if "check:lock" not in scripts:
            report["missing"].append("package.json#scripts.check:lock")
            return report

        status = git_value(root, "status", "--porcelain")
        report.update(
            {
                "valid": True,
                "clean": status == "",
                "commit": git_value(root, "rev-parse", "HEAD"),
                "branch": git_value(root, "branch", "--show-current"),
                "dirtyEntries": status.splitlines(),
            }
        )
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        report["error"] = str(error)

    return report


def discover(start: Path) -> list[Path]:
    candidates: list[Path] = []
    seen: set[Path] = set()

    def add(path: Path) -> None:
        resolved = path.expanduser().resolve()
        if resolved not in seen:
            seen.add(resolved)
            candidates.append(resolved)

    configured = os.environ.get("PREMIUM_BUSINESS_TEMPLATE_ROOT")
    if configured:
        add(Path(configured))

    add(REGISTERED_ROOT)

    cursor = start.resolve()
    for ancestor in (cursor, *cursor.parents):
        if ancestor.name == TEMPLATE_NAME:
            add(ancestor)
        add(ancestor / TEMPLATE_NAME)

    if PROJECTS_ROOT.exists():
        for match in sorted(PROJECTS_ROOT.glob(f"*/{TEMPLATE_NAME}")):
            add(match)

    return candidates


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Find the clean premium-business-template golden master."
    )
    parser.add_argument("--start", default=os.getcwd(), help="Current task directory")
    parser.add_argument(
        "--require-clean",
        action="store_true",
        help="Fail unless the selected golden master has no uncommitted changes",
    )
    parser.add_argument(
        "--path-only",
        action="store_true",
        help="Print only the selected absolute path",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    reports = [candidate_report(path) for path in discover(Path(args.start))]
    valid = [report for report in reports if report["valid"]]
    selected = next((report for report in valid if report["clean"]), None)
    if selected is None and valid:
        selected = valid[0]

    if selected is None:
        print(json.dumps({"selected": None, "checked": reports}, indent=2))
        return 2

    if args.require_clean and not selected["clean"]:
        print(json.dumps({"selected": selected, "checked": reports}, indent=2))
        return 3

    if args.path_only:
        print(selected["path"])
    else:
        print(json.dumps({"selected": selected, "checked": reports}, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
