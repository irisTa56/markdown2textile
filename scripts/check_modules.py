import json

missing_dependencies = []

try:
  import pandocfilters
except ModuleNotFoundError:
  missing_dependencies.append('pandocfilters')

try:
  import pypandoc
except ModuleNotFoundError:
  missing_dependencies.append('pypandoc')

try:
  import pyperclip
except ModuleNotFoundError:
  missing_dependencies.append('pyperclip')

if len(missing_dependencies) > 0:
  print('Missing Python modules: {}'.format(', '.join(missing_dependencies)))
else:
  print('OK')