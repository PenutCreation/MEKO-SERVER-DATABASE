import posts from "./DATABASE/SERVERDATA-1.js";  
console.log("Imported posts:", posts);
console.log("Type of posts:", typeof posts);
console.log("Is posts an array?", Array.isArray(posts));
console.log("Number of posts:", posts.length);
console.log("First post object:", posts[0]); // Check if posts exist

let currentPostIndex = 0;
const postsPerPage = 20;
let likedPosts = new Set();
let shuffledPosts = []; // ✅ Initialize empty array


// Function to shuffle posts randomly
function shufflePosts(postArray) {
  return [...postArray].sort(() => Math.random() - 0.5);
}


// ✅ Wait for posts to load, then shuffle
async function initializePosts() {
    try {
        console.log("Checking imported posts:", posts);
        if (!Array.isArray(posts)) {
            throw new Error("Posts is not an array or is undefined.");
        }

        shuffledPosts = shufflePosts([...posts]);
        console.log("Shuffled posts loaded:", shuffledPosts);

        checkForSharedPost();
    } catch (error) {
        console.error("Error initializing posts:", error);
    }
}


document.addEventListener("DOMContentLoaded", () => {
  initializePosts();
});


function loadMorePosts() {
  if (currentPostIndex < shuffledPosts.length) {
    const nextPosts = shuffledPosts.slice(currentPostIndex, currentPostIndex + postsPerPage);
    displayPosts(nextPosts);

    currentPostIndex += postsPerPage;

    if (currentPostIndex >= shuffledPosts.length) {
      document.querySelector(".load-more").style.display = "none";
    }
  } else {
    console.log("No more posts to load");
  }
}

function displayPosts(postsToDisplay, clearContainer = false) {
  const containerWithoutYoutube = document.querySelector("#post-container");
  const containerWithYoutube = document.querySelector("#youtube-post-container");

  if (clearContainer) {
    containerWithoutYoutube.innerHTML = "";
    containerWithYoutube.innerHTML = "";
  }

  postsToDisplay.forEach((post) => {
    const globalIndex = shuffledPosts.indexOf(post); // ✅ Fix globalIndex usage
    const postDiv = document.createElement("div");
    postDiv.className = "post-item";
    postDiv.dataset.index = globalIndex;
    postDiv.innerHTML = `
<p class="post-author" onclick="SHOWERProfilePopup('${post.author}')">${post.author}</p>

      <p class="post-date">${post.date}</p>
      <p class="post-content">${highlightHashtagsInText(post.content)}</p>
      <div class="post-actions">
        <span class="like-btn ${likedPosts.has(globalIndex) ? "liked" : ""}" data-index="${globalIndex}">
          ${formatLikes(post.likes)} Like
        </span>
        <span class="share-btn" data-index="${globalIndex}">Share</span>
      </div>
    `;

    const hasYoutubePlayer = post.content.includes('<div class="youtube-player">');

    if (hasYoutubePlayer) {
      containerWithYoutube.appendChild(postDiv);
    } else {
      containerWithoutYoutube.appendChild(postDiv);
    }
  });
}
// Function to highlight hashtags in text
function highlightHashtagsInText(text) {
  return text.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
}

// Function to format likes (e.g., 2000 becomes 2K)
function formatLikes(likes) {
  return likes >= 1000 ? (likes / 1000).toFixed(1) + "K" : likes;
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("like-btn")) {
    const index = parseInt(e.target.dataset.index, 10); // ✅ Convert index to number
    const post = shuffledPosts[index];
    if (!post) return;

    if (likedPosts.has(index)) {
      alert(`You unliked ${post.author}'s post`);
      likedPosts.delete(index);
      e.target.classList.remove("liked");
    } else {
      alert(`You liked ${post.author}'s post`);
      likedPosts.add(index);
      e.target.classList.add("liked");
    }
  }
});

// Search posts
function searchPosts() {
  const query = document.getElementById("search").value.trim().toLowerCase();
  const container = document.getElementById("post-container");

  if (!Array.isArray(shuffledPosts) || shuffledPosts.length === 0) {
    console.error("shuffledPosts is not defined or empty.");
    return;
  }

  if (query === "") {
    container.innerHTML = "";
    displayPosts(shuffledPosts.slice(0, 20));
    return;
  }

  const filteredPosts = shuffledPosts.filter(post =>
    post && post.content && post.author &&
    (post.content.toLowerCase().includes(query) ||
     post.author.toLowerCase().includes(query))
  );

  container.innerHTML = "";

  if (filteredPosts.length > 0) {
    displayPosts(filteredPosts.slice(0, 20));
  } else {
    container.innerHTML = "<p>No posts found. Showing related posts:</p>";
    const randomPosts = getRandomPosts(shuffledPosts, 5);
    displayPosts(randomPosts);
  }
}

// Function to get a random selection of posts
function getRandomPosts(postsArray, count) {
  if (!Array.isArray(postsArray) || postsArray.length === 0) return [];
  return postsArray.length <= count ? postsArray : shufflePosts([...postsArray]).slice(0, count);
}

// Function to check for shared posts in URL
function checkForSharedPost() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("post");
  if (postId && shuffledPosts[postId]) {
    displayPosts([shuffledPosts[postId]], true);
    document.querySelector(".load-more").style.display = "none";
  } else {
    loadMorePosts();
  }
}



window.loadMorePosts = loadMorePosts;
