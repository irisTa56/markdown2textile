import sys
import subprocess

subprocess.run(
  [sys.executable, "-m", "pip", "install"] + sys.argv[1:],
  capture_output=True)