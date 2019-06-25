#!/Users/takayuki/.pyenv/shims/python

import panflute as pf

def code(elem, _doc):
  if isinstance(elem, pf.CodeBlock):
    languages = elem.classes
    syntax = 'class="{}"'.format(languages[0] if languages else "text")
    body = "\n".join([
      "<pre><code {}>".format(syntax),
      elem.text,
      "</code></pre>\n",
    ])
    return pf.RawBlock(body, format="html")

if __name__ == "__main__":
  pf.toJSONFilter(code)