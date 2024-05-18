$(document).ready(function(){
    // Fetch the HTML content https://cdn.jsdelivr.net/gh/JakinRogel/webflow-webula/crm-form.html
    $.get("https://raw.githubusercontent.com/JakinRogel/webflow-webula/crm-form.html", function(data) {
        // Inject the HTML content into the container
        $("#htmlContainer").html(data);
    });
    // Add event listener for form submission
    $('#myForm').submit(function(event) {
        event.preventDefault(); // Prevent form submission

        // Disable formSubmit button
        $('#formSubmit').prop('disabled', true);

        console.log("Form submitted");

        // Add loading bar next to the form submit button
        var loadingBar = '<div id="loading-bar">Loading...</div>';
        $(this).after(loadingBar);
    });

    // Add event listener for form submission
    $('#myForm').submit(function(event) {
        event.preventDefault(); // Prevent form submission

        // Define data object
        var data = {};

        // Iterate over input fields and populate data object
        $(this).find('input, select, textarea').each(function() {
            var fieldName = $(this).attr('name');
            var fieldValue = $(this).val();
            console.log("Field Name:", fieldName);
            console.log("Field Value:", fieldValue);
            data[fieldName] = fieldValue;
        });
        
        // Add timestamp to data object
        const timestamp = new Date().toISOString();
        const logsTimestamp = new Date().toLocaleString() + ' ' + Intl.DateTimeFormat().resolvedOptions().timeZone; // Get the current date and time in the browser's local time zone
        const username = document.getElementById("employeeName").textContent.trim(); // Use entire content as username
        const logs = "<p><sub> " + logsTimestamp + " </sub></p><blockquote><sub></sub><br> Auto Generated Log <br><br></blockquote><p><sub>Logged by: " + username + " <sub><p><p><sup>---------------------------------------------------------------------------------------------------------------</sup></p><p></p>";
        const tasks = `{"tasks":[{"id":1,"username":"` + username + `","title":"Complete project proposal","description":"Write a detailed project proposal for the upcoming client meeting.","status":"incomplete","due_date":"2024-05-15"},{"id":2,"username":"` + username + `","title":"Review design mockups","description":"Review and provide feedback on the latest design mockups for the website redesign project.","status":"incomplete","due_date":"2024-05-10"},{"id":3,"username":"` + username + `","title":"Prepare presentation slides","description":"Create presentation slides for the team meeting next week.","status":"incomplete","due_date":"2024-05-17"}]}`;
        
        data['date'] = timestamp;
        data['logs'] = logs;
        data['tasks'] = tasks;
        console.log(JSON.stringify(data));
        
        // Make POST request
        fetch('https://us-central1-webula-api-firebase.cloudfunctions.net/webflowNewClient/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json()) // Parse response as JSON
        .then(data => {
            console.log('Server response:', data);
            
            // AJAX call to reload the content after form submission
            $.ajax({
                url: 'https://webulaofficial.webflow.io/crm', // URL of the script to process the request
                type: 'GET', // Method type
                success: function(data) {
                    console.log("Data received: ");
                   
                   // Find the first div with class "crm-cms-container" in the AJAX response
                    var newClient = $(data).find('.crm-clients-collection-item.w-dyn-item').first().clone();
                    // Prepend the new div with class "crm-cms-container" to the container
                    $('#collectionList').prepend(newClient);
                    // Remove the loading bar if it exists
                    $('#loading-bar').remove();
                    // Enable the form submit button
                    $('#formSubmit').prop('disabled', false);
                    // Remove the form
                    $('#crmClientForm').css('display', 'none');
                    // Initialize and start the Lottie animation
                    lottie.loadAnimation({
                      container: document.getElementById('w-node-af138b35-bb96-6fc3-3441-432a5cad7c04-306c9c69'),
                      renderer: 'svg',
                      loop: true,
                      autoplay: true,
                      path: 'https://cdn.prod.website-files.com/660dd1ea1c199e177a64df8b/663ac3fd125b1c3a8b3ab043_Client%20Profile%20Image.json'
                    });
                },
                error: function(xhr, status, error) {
                    // Handle errors
                    console.error(xhr.responseText);
                    // Remove the loading bar if it exists
                    $('#loading-bar').remove();
                    // Enable the form submit button
                    $('#formSubmit').prop('disabled', false);
                }
            });
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            alert('Error submitting form. Please try again.');
            // Remove the loading bar in case of an error
            $('#loading-bar').remove();
            // Enable the formSubmit button
            $('#formSubmit').prop('disabled', false);
        });
    });
});
