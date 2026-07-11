function trackBlogPostClick(event, post) {
  if (typeof gtag !== 'function') return;

  gtag('event', 'blog_post_click', {
    event_category: 'blog',
    event_label: post.title,
    blog_post_title: post.title,
    blog_post_filename: post.filename,
    blog_post_label: post.label || 'unlabeled',
    transport_type: 'beacon',
  });
}

function updatePostFade(linkElement) {
  linkElement.classList.toggle(
    'blog-post-collapsed',
    linkElement.scrollHeight > linkElement.clientHeight + 1
  );
}

async function loadBlogPosts() {
  const blogContainer = document.getElementById('blog-container');
  if (!blogContainer) return;

  try {
    const response = await fetch('blog_posts/posts.json');
    const posts = await response.json();

    for (const post of posts) {
      const markdownResponse = await fetch(`blog_posts/${post.filename}`);
      const markdown = await markdownResponse.text();

      const postHtml = marked.parse(markdown);

      // Create a link element for the entire card
      const linkElement = document.createElement('a');
      linkElement.href = `post.html?filename=${encodeURIComponent(post.filename)}`;
      linkElement.className = 'blog-post';
      linkElement.addEventListener('click', (event) => trackBlogPostClick(event, post));

      // Set the inner HTML of the link to the post content
      linkElement.innerHTML = postHtml;

      // Inject label badge after the h1
      if (post.label) {
        const badge = document.createElement('span');
        badge.className = `post-label ${post.label}`;
        badge.textContent = post.label;
        const datePara = linkElement.querySelector('h1 + p');
        if (datePara) datePara.insertAdjacentElement('afterend', badge);
      }

      // Append the link element directly to the container
      blogContainer.appendChild(linkElement);

      requestAnimationFrame(() => updatePostFade(linkElement));

      for (const image of linkElement.querySelectorAll('img')) {
        image.addEventListener('load', () => updatePostFade(linkElement), { once: true });
      }
    }
  } catch (error) {
    console.error('Error loading blog posts:', error);
    blogContainer.innerHTML = '<p>Failed to load blog posts. Please try again later.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadBlogPosts);
