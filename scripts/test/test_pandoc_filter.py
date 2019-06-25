import os
import re
import sys
import pypandoc
import pyperclip

text_md = """\
# My Text

## Your Text

Run the bellow code with `--option`:

```python
print("Hello, world")
```

* **Bold** and __Bold__
* *Italic* and _Italic_
"""

text_tt = """\
h1(#my-text). My Text

h2(#your-text). Your Text

Run the bellow code with @--option@:

<pre><code class="python">
print("Hello, world")
</code></pre>

* *Bold* and *Bold*
* _Italic_ and _Italic_
"""

filter_path = os.path.join(os.path.dirname(__file__), "../pandoc_filter.py")

def convert(text):
  return pypandoc.convert_text(
    source=text,
    to="textile",
    format="markdown",
    filters=[filter_path])[:-1]  # remove an extra blank line at EoF

assert convert(text_md) == text_tt
