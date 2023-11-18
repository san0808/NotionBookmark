// Function to retrieve the access token from the server
async function getAccessToken() {
    try {
        const response = await fetch("http://localhost:5000/api/getToken", {
            method: "GET",
            credentials: 'include',  // Ensures cookies are sent with the request
        });
        if (response.ok) {
            const data = await response.json();
            const accessToken = data.accessToken;
            return accessToken;
        } else {
            console.error("Failed to retrieve access token");
        }
    } catch (error) {
        console.error(error);
    }
}

// Event listener for the "Authorize with Notion" button
document.getElementById("authButton").addEventListener("click", function() {
    chrome.tabs.create({ url: "http://localhost:5000/auth/notion" });
});

// Event listener for the bookmark form submission
document.getElementById("bookmarkForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Retrieve form values
    var title = document.getElementsByName("title")[0].value;
    var url = document.getElementsByName("url")[0].value;
    var notes = document.getElementsByName("notes")[0].value;
    var tags = document.getElementsByName("tags")[0].value.split(',').map(tag => tag.trim());

    // Create an object with the bookmark data
    var bookmark = {
        title: title,
        url: url,
        notes: notes,
        tags: tags
    };
    console.log(bookmark);

    try {
        const response = await fetch("http://localhost:5000/notion/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify(bookmark),
        });

        if (response.ok) {
            console.log("Bookmark saved successfully");
            // Handle success case
        } else {
            console.error("Failed to save bookmark");
            // Handle error case
        }
    } catch (error) {
        console.error(error);
        // Handle error case
    }

    // Clear form inputs
    document.getElementById("bookmarkForm").reset();
});


  

