Python scripts called from VS Code extension print _predictable_ messages (or raise Errors).
This, I think, minimizes dependence of this extension on Python.

* Possible messages:
  * from `check_modules.py`:
    * `'Missing Python modules: {comma separated module names}'` or `'OK'`
  * from `check_version.py`:
    * `'Python must be version 3'` or `'OK'`
  * from `markdown_to_textile.py`:
    * `'OK'`
* All the Errors will be handled by the `python-shell` module in VS Code extension.
* Converted text will be pasted to user's clipboard without being returned to VS Code extension.
