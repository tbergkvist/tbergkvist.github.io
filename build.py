#!/usr/bin/env python3
"""Render posts/*.md into blog/, then refresh blog.html's list and feed.xml.

Every other page on the site is hand-written HTML; this script never touches
them. A post looks like:

    ---
    title: Hello
    date: 2026-08-22
    ---

    Text.
"""

import re
from datetime import datetime, timezone
from email.utils import format_datetime
from html import escape
from pathlib import Path

SITE = "https://teo.bergkvist.io"
TITLE = "Teo Bergkvist"
DESCRIPTION = "Notes on engineering, physics and code."

ROOT = Path(__file__).parent


# --- markdown -------------------------------------------------------------
#
# A small subset: headings, paragraphs, lists, rules, code and the inline
# marks below. Raw HTML is passed through, so a post can drop down to plain
# tags whenever the subset is not enough.

INLINE_MARKS = [
    (r"`(.+?)`", r"<code>\1</code>"),
    (r"!\[(.*?)\]\((.+?)\)", r'<img src="\2" alt="\1">'),
    (r"\[(.+?)\]\((.+?)\)", r'<a href="\2">\1</a>'),
    (r"\*\*(.+?)\*\*", r"<strong>\1</strong>"),
    (r"\*(.+?)\*", r"<em>\1</em>"),
    (r"  \n", "<br>\n"),  # two trailing spaces is a line break
]


def inline(text):
    for pattern, replacement in INLINE_MARKS:
        text = re.sub(pattern, replacement, text)
    return text


def markdown_to_html(text):
    """Convert the markdown subset above into HTML, one line at a time."""
    html, paragraph, listing, code = [], [], [], None

    def flush():
        """Close whatever multi-line block is open."""
        if paragraph:
            html.append("<p>" + inline("\n".join(paragraph)) + "</p>")
            paragraph.clear()
        if listing:
            items = "\n".join(f"  <li>{inline(item)}</li>" for item in listing)
            html.append(f"<ul>\n{items}\n</ul>")
            listing.clear()

    for line in text.splitlines():
        if code is not None:  # inside a fence everything is literal
            if line.startswith("```"):
                html.append("<pre><code>" + escape("\n".join(code)) + "</code></pre>")
                code = None
            else:
                code.append(line)
        elif line.startswith("```"):
            flush()
            code = []
        elif not line.strip():
            flush()
        elif line.startswith("#"):
            flush()
            level = len(line) - len(line.lstrip("#"))
            html.append(f"<h{level}>{inline(line[level:].strip())}</h{level}>")
        elif line.strip() == "---":
            flush()
            html.append("<hr>")
        elif line.startswith("- "):
            if paragraph:
                flush()
            listing.append(line[2:])
        elif line.startswith("<"):  # raw HTML the subset cannot express
            flush()
            html.append(line)
        else:
            if listing:
                flush()
            paragraph.append(line)

    flush()
    return "\n".join(html)


# --- posts ----------------------------------------------------------------

shell = (ROOT / "post.html").read_text()
posts = []

for path in ROOT.glob("posts/*.md"):
    frontmatter, body = path.read_text()[4:].split("\n---\n", 1)
    meta = dict(line.split(": ", 1) for line in frontmatter.splitlines())
    meta["url"] = f"/blog/{path.stem}.html"
    meta["body"] = markdown_to_html(body.strip())
    posts.append(meta)

posts.sort(key=lambda post: post["date"], reverse=True)

for post in posts:
    page = shell.replace("<!-- title -->", escape(post["title"]))
    page = page.replace("<!-- date -->", post["date"])
    page = page.replace("<!-- content -->", post["body"])
    (ROOT / post["url"].strip("/")).write_text(page)

# --- the list on blog.html ------------------------------------------------

listing = "\n".join(
    f'<li><a href="{post["url"]}">{escape(post["title"])}</a>'
    f'<time>{post["date"]}</time></li>'
    for post in posts
)
blog = (ROOT / "blog.html").read_text()
start = blog.index("<!-- posts -->")
end = blog.index("<!-- /posts -->")
(ROOT / "blog.html").write_text(
    f'{blog[:start]}<!-- posts -->\n'
    f'<ul class="post-list">\n{listing}\n</ul>\n{blog[end:]}'
)

# --- feed.xml -------------------------------------------------------------

items = "".join(
    f"""
    <item>
      <title>{escape(post["title"])}</title>
      <link>{SITE}{post["url"]}</link>
      <guid>{SITE}{post["url"]}</guid>
      <pubDate>{format_datetime(datetime.fromisoformat(post["date"]).replace(tzinfo=timezone.utc))}</pubDate>
      <description>{escape(post["body"].replace('="/', f'="{SITE}/'))}</description>
    </item>"""
    for post in posts
)
(ROOT / "feed.xml").write_text(
    f"""<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{TITLE}</title>
    <description>{DESCRIPTION}</description>
    <link>{SITE}/</link>
    <atom:link href="{SITE}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en</language>
    <lastBuildDate>{format_datetime(datetime.now(timezone.utc))}</lastBuildDate>{items}
  </channel>
</rss>
"""
)

print(f"Rendered {len(posts)} posts")
