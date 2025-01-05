async function loadPost() {
    const postContainer = document.getElementById('post-container');
  
    // Get the 'filename' parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const filename = params.get('filename');
  
    if (!filename) {
      postContainer.innerHTML = '<p>Invalid post. Please return to the blog.</p>';
      return;
    }
  
    try {
      // Fetch the Markdown content for the post
      const response = await fetch(`blog_posts/${filename}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch the post.');
      }
  
      const markdown = await response.text();
  
      // Convert Markdown to HTML using Marked.js
      const postHtml = marked.parse(markdown);
  
      // Insert the post content into the container
      postContainer.innerHTML = postHtml;
    } catch (error) {
      console.error('Error loading the post:', error);
      postContainer.innerHTML = '<p>Failed to load the post. Please try again later.</p>';
    }
  }
  
  // Load the post when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    loadPost();
  });