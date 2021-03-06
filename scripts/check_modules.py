missing_dependencies = []

try:
  import panflute
except ModuleNotFoundError:
  missing_dependencies.append("panflute")

try:
  import pypandoc
  try:
    pypandoc.get_pandoc_version()
  except OSError:
    missing_dependencies.append("py-pandoc")
except ModuleNotFoundError:
  missing_dependencies.append("pypandoc")

try:
  import pyperclip
except ModuleNotFoundError:
  missing_dependencies.append("pyperclip")

if len(missing_dependencies) > 0:
  print(", ".join(missing_dependencies))
