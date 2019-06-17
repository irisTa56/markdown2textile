# markdown2textile

VS Code extension to convert selected Markdown text into RedMine-style Textile.

__CAUTION: This extension is under development!__

## Usage

1. Select text in Markdown file.
2. Open context menu.
3. Click _Copy as Textile_.
4. Converted text will be copied to your clipboard!

## Requirements

* [`Python`](https://www.python.org/) (must be version 3)
* [`Pandoc`](https://github.com/jgm/pandoc)
* [`pandocfilters`](https://github.com/jgm/pandocfilters)
* [`pypandoc`](https://github.com/bebraw/pypandoc)
* [`pyperclip`](https://github.com/asweigart/pyperclip)

## Extension Settings

:thinking:

## Install Development Version

Generate `*.vsix` file.

```bash
git clone https://github.com/irisTa56/markdown2textile.git
cd markdown2textile
npm install -g vsce
vsce package
```

Then run the VS Code command `Extensions: Install from VSIX...`, and select the generated file.

## Release Notes

Not yet released...

## TODO

* [x] [Bundling extension](https://code.visualstudio.com/api/working-with-extensions/bundling-extension)
* [ ] Improving filter
* [ ] Publishing extension
* [ ] Providing instruction for installing missing dependencies
* [ ] Writing test
* [ ] Using [`panflute`](https://github.com/sergiocorreia/panflute) instead of `pandocfilters`.
* [ ] Getting Python version from [Python Extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python).
