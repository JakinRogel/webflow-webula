// Import jQuery
document.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>');

// Function to handle the delete button click
function handleDeleteButtonClick(event) {
  event.preventDefault(); // Prevent the default behavior of the anchor tag

  // Add loading bar next to the clicked delete button
  const loadingBar = '<div class="loading-bar">Loading...</div>';
  $(event.target).after(loadingBar); // Using event.target instead of this

  // Find the parent div containing the delete button
  let parentDiv = $(event.target).closest('.crm-button-container');
  console.log('Parent Div:', parentDiv);

  // Find the itemID stored in the text content of the parent div
  let itemId = parentDiv.find('#itemID').text().trim();
  console.log('Item ID:', itemId);

  console.log(JSON.stringify({ 'item-id': itemId }));

  // Make a fetch request to the API endpoint to delete the item
  fetch('https://us-central1-webula-api-firebase.cloudfunctions.net/webflowDeleteClient/', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 'item-id': itemId })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to delete item');
    }
    removeDeletedClient(event); // Pass the event object to removeDeletedClient
  });
}

// Function to reload the content after deletion
function removeDeletedClient(event) {
  // Find the closest clientLinkbox div and remove it
  $(event.target).closest('.crm-clients-collection-item.w-dyn-item').remove();
}

// Add event listener to the delete button
$(document).on('click', '#delete-button', handleDeleteButtonClick);

// Event listener to intercept page loading
window.addEventListener('DOMContentLoaded', async function(event) {
  console.log('Page loaded');
  // Perform authentication check before allowing the page content to load
  var isAuthenticated = false; // Initialize isAuthenticated
  console.log('isAuthenticated initialized:', isAuthenticated);

  // Function to check if the authentication cookie exists
  async function checkAuthCookie() {
    // Retrieve the authentication cookie
    const sessionCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('authToken='));

    // Check if the authentication cookie exists
    if (sessionCookie) {
      try {
        // Send request to checkAuthToken URL
        const response = await fetch('https://us-central1-webula-api-firebase.cloudfunctions.net/checkAuthToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ authToken: sessionCookie.split('=')[1] })
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        // Extract result from response body
        const data = await response.json();
        const result = data.result;
        const username = data.username; // Extract username from response

        if (result === true) {
          isAuthenticated = true;
          console.log('Authentication successful. isAuthenticated:', isAuthenticated);

          // Set the username to the div with ID of "employeeName"
          document.getElementById('employeeName').textContent = username;
          // Set the email to the div with ID of "employeeEmail"
          const firstWord = username.split(' ')[0]; // Get the first word of the username
          document.getElementById('employeeEmail').textContent = firstWord + "@webula.io";

          console.log('Username set to:', username); // Console log the username
        } else {
          console.log('Authentication failed. Redirecting to unauthorized page...');
          // Redirect the user to the unauthorized page
          window.location.href = 'https://webulaofficial.webflow.io/401';
        }
      } catch (error) {
        console.error('Authentication error:', error);
        // Handle authentication error
        alert("Authentication error");
      }
    } else {
      console.log('Session cookie not found. Redirecting to login page...');
      // Redirect the user to the login page
      window.location.href = 'https://webulaofficial.webflow.io/401';
    }
  }

  // Call the function to check the authentication cookie
  await checkAuthCookie();

  // Display the page content if the user is authenticated
  if (isAuthenticated) {
    // Display the page content by changing .shell-employees_wrapper styling
    document.querySelector('.shell-employees_wrapper').style.display = 'flex';
  }
});
