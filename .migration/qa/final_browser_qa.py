"""Run the current browser QA suites against an already-running local site.

Required environment:
  PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.js
Optional environment:
  QA_BASE_URL=http://127.0.0.1:4444
  NODE_BINARY=node
"""

from __future__ import annotations

import os
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
BASE_URL = os.environ.get("QA_BASE_URL", "http://127.0.0.1:4444")
NODE_BINARY = os.environ.get("NODE_BINARY", "node")
SUITES = (
    ROOT / "tests" / "route-smoke.mjs",
    ROOT / "tests" / "contact-form.mjs",
    ROOT / "tests" / "material-selection.mjs",
)


def main() -> None:
    if not os.environ.get("PLAYWRIGHT_MODULE"):
        raise SystemExit("PLAYWRIGHT_MODULE must point to Playwright's index.js")

    environment = {**os.environ, "BASE_URL": BASE_URL}
    for suite in SUITES:
        subprocess.run(
            [NODE_BINARY, str(suite)],
            cwd=ROOT,
            env=environment,
            check=True,
        )


if __name__ == "__main__":
    main()
