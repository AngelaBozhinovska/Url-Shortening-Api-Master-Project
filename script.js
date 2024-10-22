// Wait for the DOM content to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
  // Select elements from the DOM
  const input = document.querySelector('.link-converter input'); // Input field for entering the URL
  const button = document.querySelector('#shorten-button'); // Button to trigger URL shortening
  const resultContainer = document.querySelector('.result-container'); // Container for displaying the shortened link
  const errorMessage = document.querySelector('#error-message'); // Element for displaying error messages
  const bitlyToken = 'ab0f9ffa8ed9dad51704ce51da76f14e1cee5ee4'; // Bitly API token for authentication

  // Select elements for mobile navigation
  const menuIcon = document.getElementById("menu-icon"); // Menu icon for opening mobile nav
  const mobileNav = document.getElementById("mobile-nav"); // Mobile navigation menu

  // Toggle the mobile navigation menu on menu icon click
  menuIcon.addEventListener("click", function() {
    mobileNav.classList.toggle("active"); // Add or remove 'active' class to show/hide mobile nav
  });

  // Function to validate the URL format
  function isValidURL(url) {
    try {
      new URL(url); // Attempt to create a new URL object
      return true; // Return true if successful
    } catch (_) {
      return false; // Return false if an error occurs
    }
  }

  // Function to shorten the URL using the Bitly API
  async function shortenURL(url) {
    const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bitlyToken}`, // Include the API token for authentication
        'Content-Type': 'application/json' // Set the content type to JSON
      },
      body: JSON.stringify({ long_url: url }) // Send the long URL in the request body
    });
    const data = await response.json(); // Parse the response as JSON
    if (response.ok) {
      return data.link; // Return the shortened link if the response is successful
    } else {
      throw new Error(data.message || 'Unable to shorten URL'); // Throw an error if something goes wrong
    }
  }

  // Function to display the shortened link and original link in the UI
  function displayShortenedLink(shortURL, originalURL) {
    const shortenedLinkDiv = document.createElement('div'); // Create a new div for the shortened link
    shortenedLinkDiv.classList.add('shortened-link'); // Add a class for styling

    const originalLink = document.createElement('p'); // Create a paragraph for the original link
    originalLink.classList.add('original-link'); // Add a class for styling
    originalLink.textContent = originalURL; // Set the text to the original URL

    const Hr = document.createElement('hr'); // Create a horizontal rule for separation

    const shortLink = document.createElement('a'); // Create an anchor element for the shortened link
    shortLink.classList.add('short-link'); // Add a class for styling
    shortLink.href = shortURL; // Set the href to the shortened URL
    shortLink.textContent = shortURL; // Set the text to the shortened URL
    shortLink.target = '_blank'; // Open the link in a new tab

    const copyButton = document.createElement('button'); // Create a button to copy the shortened link
    copyButton.classList.add('copy-button'); // Add a class for styling
    copyButton.textContent = 'Copy'; // Set the initial button text

    // Add event listener to handle copying the shortened link to clipboard
    copyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(shortURL).then(() => { // Use the Clipboard API to copy the text
          copyButton.textContent = 'Copied!'; // Change the button text to indicate success
          copyButton.classList.add('clicked'); // Add a class to style the button when clicked
          setTimeout(() => {
              copyButton.textContent = 'Copy'; // Reset the button text after 5 seconds
              copyButton.classList.remove('clicked'); // Remove the 'clicked' class
          }, 5000);
      });
    });

    // Append all created elements to the shortened link div
    shortenedLinkDiv.appendChild(originalLink);
    shortenedLinkDiv.appendChild(Hr);
    shortenedLinkDiv.appendChild(shortLink);
    shortenedLinkDiv.appendChild(copyButton);

    // Add the shortened link div to the result container and make it visible
    resultContainer.appendChild(shortenedLinkDiv);
    resultContainer.classList.remove('hidden'); // Show the result container
  }

  // Event listener for the shorten button
  button.addEventListener('click', async () => {
    const url = input.value.trim(); // Get the trimmed input value
    if (!isValidURL(url)) { // Validate the URL
      input.classList.add('input-error'); // Add an error class if the URL is invalid
      errorMessage.classList.remove('hidden'); // Show the error message
    } else {
      input.classList.remove('input-error'); // Remove the error class if valid
      errorMessage.classList.add('hidden'); // Hide the error message
      try {
        const shortURL = await shortenURL(url); // Call the shortenURL function
        displayShortenedLink(shortURL, url); // Display the shortened link
        input.value = ''; // Clear the input field
      } catch (error) {
        console.error('Error shortening URL:', error); // Log any errors to the console
      }
    }
  });
});
