async function loadBlogPosts() {
    const blogContainer = document.getElementById('blog-container');
  
    try {
      // Fetch the JSON file with post metadata
      const response = await fetch('blog_posts/posts.json');
      const posts = await response.json();
  
      for (const post of posts) {
        // Fetch the Markdown content for each post
        const markdownResponse = await fetch(`blog_posts/${post.filename}`);
        const markdown = await markdownResponse.text();
  
        // Convert Markdown to HTML using Marked.js
        const postHtml = marked.parse(markdown);
  
        // Create a wrapper for each blog post
        const postElement = document.createElement('div');
        postElement.className = 'blog-post';
  
        // Add the Markdown content only
        postElement.innerHTML = postHtml;
  
        // Append the blog post to the container
        blogContainer.appendChild(postElement);
      }
    } catch (error) {
      console.error('Error loading blog posts:', error);
      blogContainer.innerHTML = '<p>Failed to load blog posts. Please try again later.</p>';
    }
  }
  
  // Load blog posts when the page loads
  loadBlogPosts();
  