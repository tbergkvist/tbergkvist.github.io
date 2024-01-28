// script.js

document.addEventListener("DOMContentLoaded", function() {
    fetch("blog_posts.json")
        .then(response => response.json())
        .then(data => {
        const blogPostsContainer = document.getElementById("blog-posts");
        data.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("blog-post");

            const titleElement = document.createElement("h2");
            titleElement.textContent = post.title;

            const dateElement = document.createElement("p");
            dateElement.textContent = post.date;
            dateElement.classList.add("date");

            const pictureElement = document.createElement("img");
            pictureElement.src = post.picture;
            pictureElement.alt = "No Image";

            const textElement = document.createElement("p");
            textElement.textContent = post.text;

            postElement.appendChild(titleElement);
            postElement.appendChild(dateElement);
            postElement.appendChild(textElement);
            postElement.appendChild(pictureElement);

            blogPostsContainer.appendChild(postElement);
        });
        })
        .catch(error => console.error("Error fetching blog posts:", error));
  });
  