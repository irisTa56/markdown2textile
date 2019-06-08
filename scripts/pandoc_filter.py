#!/Users/takayuki/.pyenv/shims/python

from pandocfilters import toJSONFilter, RawBlock

def code(key, value, format, meta):
  if key == 'CodeBlock':
    ((_, lang, _), code) = value
    syntax = 'class="{}"'.format(lang[0] if len(lang) else 'text')
    return RawBlock(
      'html',
      '\n'.join(['<pre><code {}>'.format(syntax), code, '</code></pre>\n']))

if __name__ == '__main__':
  toJSONFilter(code)