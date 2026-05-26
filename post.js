async function loadPost() {
    const postContainer = document.getElementById('post-container');

    const params = new URLSearchParams(window.location.search);
    const filename = params.get('filename');

    if (!filename) {
      postContainer.innerHTML = '<p>Invalid post. Please return to the blog.</p>';
      return;
    }

    try {
      const [markdownResponse, postsResponse] = await Promise.all([
        fetch(`blog_posts/${filename}`),
        fetch('blog_posts/posts.json'),
      ]);

      if (!markdownResponse.ok) {
        throw new Error('Failed to fetch the post.');
      }

      const markdown = await markdownResponse.text();
      const posts = await postsResponse.json();
      const meta = posts.find(p => p.filename === filename);

      postContainer.innerHTML = marked.parse(markdown);

      if (meta?.label) {
        const badge = document.createElement('span');
        badge.className = `post-label ${meta.label}`;
        badge.textContent = meta.label;
        const datePara = postContainer.querySelector('h1 + p');
        if (datePara) datePara.insertAdjacentElement('afterend', badge);
      }
    } catch (error) {
      console.error('Error loading the post:', error);
      postContainer.innerHTML = '<p>Failed to load the post. Please try again later.</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadPost();
  });