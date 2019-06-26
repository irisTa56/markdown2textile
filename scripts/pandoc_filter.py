#!/Users/takayuki/.pyenv/shims/python

from panflute import (
  BlockQuote, CodeBlock, HorizontalRule, Inline, LineBreak, Para,
  RawBlock, RawInline, SoftBreak, Space, Str, run_filters
)

def code_block(elem, _doc):
  if isinstance(elem, CodeBlock):
    languages = elem.classes
    syntax = 'class="{}"'.format(languages[0] if languages else "text")
    body = "\n".join([
      "<pre><code {}>".format(syntax),
      elem.text,
      "</code></pre>\n",
    ])
    return RawBlock(body)

def horizontal_rule(elem, _doc):
  if isinstance(elem, HorizontalRule):
    return RawBlock("---\n")

def stripped_quote(elem, _doc):
  if isinstance(elem, BlockQuote):
    child_elems = [Str(">"), Space()]
    after_paragraph = False
    def append(child, _doc):
      nonlocal child_elems
      nonlocal after_paragraph
      if isinstance(child, Inline):
        if after_paragraph:
          child_elems += [SoftBreak(), Str(">")] * 2 + [Space()]
        child_elems.append(child)
        if isinstance(child, SoftBreak):
          child_elems += [Str(">"), Space()]
      after_paragraph = isinstance(child, Para)
    elem.walk(append)
    return Para(*child_elems)

def line_break(elem, _doc):
  if isinstance(elem, SoftBreak):
    return LineBreak()

def raw_string(elem, _doc):
  if isinstance(elem, Str):
    return RawInline(elem.text)

if __name__ == "__main__":
  run_filters([
    code_block, horizontal_rule, stripped_quote, line_break, raw_string])
