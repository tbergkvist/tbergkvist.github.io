# teo.bergkvist.io

Hand-written HTML, served by GitHub Pages from the repository root.

To add a blog post: write `posts/<name>.md` with a `title:` and `date:`
frontmatter block, then run `./build.py`. It renders `blog/<name>.html`,
updates the list in `blog.html` and rewrites `feed.xml`. It touches nothing
else.

Preview with `python3 -m http.server`.
