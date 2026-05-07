#!/bin/sh
set -e

title="$1"
[ -z "$title" ] && echo "Usage: $0 \"Post Title\"" && exit 1

date=$(date +%Y-%m-%d)
filename=$(echo "$title" | tr '[:upper:]' '[:lower:]' | tr ' ' '_' | tr -cd 'a-z0-9_').md

cat > "blog_posts/$filename" <<EOF
# $title
**$date**

EOF

tmp=$(mktemp)
node -e "
const fs = require('fs');
const posts = JSON.parse(fs.readFileSync('blog_posts/posts.json'));
posts.unshift({ filename: '$filename', title: '$title', date: '$date' });
fs.writeFileSync('$tmp', JSON.stringify(posts, null, 2));
"
mv "$tmp" blog_posts/posts.json

echo "Created blog_posts/$filename"
