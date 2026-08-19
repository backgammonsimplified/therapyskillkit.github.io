#!/usr/bin/env python3
from pathlib import Path
import subprocess
import sys

SCRIPT_DIR = Path(__file__).resolve().parent
subprocess.run([sys.executable, str(SCRIPT_DIR / "check_site.py"), "rendered"], check=True)
