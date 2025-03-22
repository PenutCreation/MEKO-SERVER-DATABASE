// Function to show the hashtag modal and display related posts
function showHashtagModal(tags) {
  // Check if tags is a string, and convert it into an array
  if (typeof tags === 'string') {
    // If it's a string, convert it into an array (split by spaces or commas)
    tags = tags.split(/\s+/);  // This splits by spaces or multiple spaces
  }
  
  // Ensure tags is an array
  if (!Array.isArray(tags)) {
    console.error('Invalid tags input. Expected a string or an array of hashtags.');
    return;
  }

  if (tags.length === 0) {
    console.error('Error: tags array is empty');
    return;
  }

  const modal = document.getElementById('hashtag-modal');
  const title = document.getElementById('hashtag-title');
  const postsContainer = document.getElementById('hashtag-posts');

  // Check if modal elements exist
  if (!modal || !title || !postsContainer) {
    console.error('Modal elements not found.');
    return;
  }

  // Update the title (show hashtags)
  title.textContent = `Hashtags: ${tags.join(', ')}`;
  postsContainer.innerHTML = ''; // Clear previous posts

  // Fetch posts containing any of the hashtags
  const relatedPosts = getPostsByHashtags(tags);

  // Display related posts
  displayHashtagPosts(relatedPosts);

  // Display the modal
  modal.style.display = 'block';
}

// Function to fetch posts by multiple hashtags (based on content)
function getPostsByHashtags(tags) {
  // Assuming you have a list of posts saved in localStorage or an array
  let posts = JSON.parse(localStorage.getItem('posts')) || [];

  // Filter posts by hashtags found in the content
  const filteredPosts = posts.filter(post => {
    // Extract hashtags from post content (use a regular expression to match words starting with '#')
    const postHashtags = post.content.match(/#\w+/g) || [];  // Extract hashtags from content

    // Check if any of the tags in `tags` array are found in the post's hashtags
    return tags.some(tag => postHashtags.includes(tag));
  });

  return filteredPosts;
}

// Function to display posts related to a hashtag
function displayHashtagPosts(posts) {
  const hashtagPostsContainer = document.getElementById('hashtag-posts');
  hashtagPostsContainer.innerHTML = ''; // Clear previous posts
  
  posts.forEach(post => {
    let postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.innerHTML = `
      <p><strong>${post.name}</strong> (${post.date})</p>
      <p>${post.content}</p>
    `;
    hashtagPostsContainer.appendChild(postElement);
  });
}
