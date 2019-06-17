import os
import re
import sys
import pypandoc
import pyperclip

text = sys.stdin.read()

output = pypandoc.convert_text(
  text, "textile", format="md",
  filters=[os.path.join(os.path.dirname(__file__), "pandoc_filter.py")])

pyperclip.copy(output.strip())
