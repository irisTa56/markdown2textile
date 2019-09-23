# markdown2textile

VS Code extension to convert selected Markdown text into RedMine-style Textile.

## Usage

1. Select text in Markdown file.
2. Open context menu.
3. Click _Copy as Textile_.
4. Converted text will be copied to your clipboard!

## VS Code Marketplace

[Markdown2Textile - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=irisTa56.markdown2textile)

## Requirements

* [`Python`](https://www.python.org/) (must be version 3.6 or higher)
* [`Pandoc`](https://github.com/jgm/pandoc)
* [`panflute`](https://github.com/sergiocorreia/panflute)
* [`pypandoc`](https://github.com/bebraw/pypandoc)
* [`pyperclip`](https://github.com/asweigart/pyperclip)

You can install these dependencies interactively in VS Code after activating this extension (if some dependencies are missing).

## Extension Settings

```json
{
  "markdown2textile.pythonPathToUsePandoc": {
    "type": "string",
    "default": "/usr/bin/python3",
    "description": "Path to Python (must be version 3) to use Pandoc."
  }
}
```

## Install Development Version

Generate `*.vsix` file.

```bash
git clone https://github.com/irisTa56/markdown2textile.git
cd markdown2textile
npm install -g vsce
yarn install
vsce package
```

Then run the VS Code command `Extensions: Install from VSIX...`, and select the generated file.

## Release Notes

* v0.0.1: first release.
* v0.0.2: improve Pandoc filter.
* v0.0.3: revert one of the changes done in v0.0.2; use raw string for only URI.
* v0.1.0: become independent of vscode-python.
* v0.1.1: security update.

## TODO

* [x] [Bundling extension](https://code.visualstudio.com/api/working-with-extensions/bundling-extension)
* [ ] Improving filter
* [x] Publishing extension
* [x] Providing instruction for installing missing dependencies
* [ ] Writing test
* [x] Using `panflute` instead of `pandocfilters`.
* [ ] Enabling to select hard/soft line break.
