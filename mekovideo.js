    function convertDivTovideo() {
      const divs = document.querySelectorAll('.convert-me-video');
      
      divs.forEach(div => {
        // Only convert the div if it's not already converted (by checking if it has been replaced by iframe)
        if (!div.dataset.converted) {
          const videoUrl = div.getAttribute('data-meko-url');
          
          if (videoUrl) {
            // Create an iframe element
            const video = document.createElement('video');
            video.setAttribute('src', videoUrl); // Set the video URL as the src of the iframe
            video.setAttribute('controlsList', 'nodownload');
            video.setAttribute('controls', 'true');
            video.setAttribute('allowfullscreen', 'true');
            
            // Mark this div as converted so we don't convert it again
            div.dataset.converted = 'true';

            // Replace the div with the iframe
            div.parentNode.replaceChild(video, div);
          }
        }
      });
    }


setInterval(function() {
    convertDivTovideo();
}, 1000);

// Missing Some Styling ....

/*global console, document, window*/


/*global console, document, window*/
function checkAndReplaceVideos(videos, getNewLink, className = "convert-me-video") {

    if (!videos || videos.length === 0) {
        console.error("No video elements found on the page.");
        return;
    }

    videos.forEach((videoElement, index) => {
        // Add a specific class to the video for identification
        if (!videoElement.classList.contains(className)) {
            console.log("Video found");
            videoElement.classList.add(className);
            console.log(`Class "${className}" added to video ${index + 1}.`);
        }

        // Check each video's error state
        if (videoElement.readyState === 0 || videoElement.error) {
            console.warn(`Video ${index + 1} link is expired or not working.`);

            // Fetch a new link for this video
            getNewLink(index, videoElement.src)
                .then((newLink) => {
                    if (newLink) {
                        // Replace the expired link with the new one
                        videoElement.src = newLink;
                        console.log(`Video ${index + 1} link updated successfully:`, newLink);

                        // Reload and play the updated video
                        videoElement.load();
                        videoElement.play();
                    } else {
                        console.error(`Failed to fetch a new link for video ${index + 1}.`);
                    }
                })
                .catch((error) => {
                    console.error(`Error updating video ${index + 1}:`, error);
                });
        }
    });
}

// Example of how to get a new link
async function getNewLink(index, oldLink) {
    // Replace this with logic to fetch or generate a new link
    console.log(`Fetching new link for video ${index + 1}, old link: ${oldLink}`);
    const newLink = `https://example.com/new-video-${index + 1}.mp4`; // Dummy new URL
    return newLink;
}

// Initialize the script and run it every 2 seconds
document.addEventListener("DOMContentLoaded", () => {
    const videoElements = document.querySelectorAll("video"); // Select all video elements
    setInterval(() => {
        checkAndReplaceVideos(videoElements, getNewLink, "convert-me-video"); // Run the script
    }, 2000); // 2 seconds interval
});


