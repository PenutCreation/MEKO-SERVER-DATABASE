// Dynamically load the YouTube IFrame API script
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var players = [];

// Function to extract video ID from YouTube URL (including Shorts)
function extractVideoId(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([^&?]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Function to process and convert any unprocessed YouTube divs into iframes
function processYouTubePlayers() {
  console.log("Processing YouTube players...");

  // Find all elements with the class 'youtube-player' that haven't been processed
  const elements = document.querySelectorAll('.youtube-player:not([data-processed="true"])');

  // Loop through each unprocessed element
  elements.forEach((el) => {
    const videoUrl = el.getAttribute('data-video-url');
    const videoId = extractVideoId(videoUrl);

    if (videoId) {
      // Ensure the element is marked as processed
      el.setAttribute('data-processed', 'true');

      // Replace the div with an iframe element
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&modestbranding=1&rel=0`;
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.setAttribute('style', 'left: 0; width: 100%; height: 100%; position: absolute; border: 0;');
      iframe.setAttribute('loading', 'lazy');
          // Replace the div in the DOM with the iframe
      el.parentNode.replaceChild(iframe, el);

      console.log(`Processed YouTube video: ${videoId}`);
    } else {
      console.error(`Invalid YouTube URL: ${videoUrl}`);
    }
  });
}

// YouTube API callback function
function onYouTubeIframeAPIReady() {
  processYouTubePlayers();

}

// Detect and process new elements dynamically
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      processYouTubePlayers();
      
    }
  }
});

// Start observing the DOM for changes
observer.observe(document.body, { childList: true, subtree: true });



// Initial call and periodic updates to highlight hashtags


// Set all iframes to lazy loading
