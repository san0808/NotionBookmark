document.getElementById("bookmarkForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  // Retrieve form values
  var title = document.getElementsByName("title")[0].value;
  var languages = document.getElementsByName("languages")[0].value;
  var url = document.getElementsByName("url")[0].value;
  // var tags = document.getElementsByName("tags")[0].value;
  var notes = document.getElementsByName("notes")[0].value;

  // Create an object with the bookmark data
  var bookmark = {
    title: title,
    
    url: url,
    // tags: tags,
    notes: notes,
  };
  console.log(bookmark);

  try {
    const response = await fetch("http://localhost:5000/api/bookmarks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

  

