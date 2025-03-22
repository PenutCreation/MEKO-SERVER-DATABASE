// Check if Facebook SDK is loaded
  function loadFBSDK() {
    if (typeof FB === 'undefined') {
      // Load the Facebook SDK if it's not already loaded
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2';
      script.async = true;
      script.onload = () => FB.XFBML.parse(); // Parse after the SDK is loaded
      document.body.appendChild(script);
    } else {
      // If SDK is already loaded, just parse the Facebook elements
      FB.XFBML.parse();
    }
  }

  // Set an interval to load the video every 2 seconds
  const intervalId = setInterval(() => {
    const fbVideoElement = document.getElementById('fb-video');
    
    if (fbVideoElement) {
      loadFBSDK();
      clearInterval(intervalId); // Stop the interval after loading the video
    }
  }, 1000); // Every 2 seconds