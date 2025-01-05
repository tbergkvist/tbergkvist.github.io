async function loadBlogPosts() {
  const blogContainer = document.getElementById('blog-container');

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
      linkElement.className = 'blog-post'; // Add class for styling

      // Set the inner HTML of the link to the post content
      linkElement.innerHTML = postHtml;

      // Append the link element directly to the container
      blogContainer.appendChild(linkElement);
    }
  } catch (error) {
    console.error('Error loading blog posts:', error);
    blogContainer.innerHTML = '<p>Failed to load blog posts. Please try again later.</p>';
  }
}

loadBlogPosts();
