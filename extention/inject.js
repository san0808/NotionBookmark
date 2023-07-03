// // Wait for the page to finish loading
// window.addEventListener("load", function() {
//     // Select all tweet elements
//     var tweets = document.querySelectorAll("div.css-1dbjc4n");
  
//     // Loop through each tweet element
//     tweets.forEach(function(tweet) {
//       // Create a new bookmark tag element
//       var bookmarkTag = document.createElement("span");
//       bookmarkTag.classList.add("bookmark-tag");
  
//       // Create an icon element for the bookmark tag
//       var icon = document.createElement("i");
//       icon.classList.add("fa-regular", "fa-bookmark"); // Assuming you're using Font Awesome for icons
  
//       // Add the icon to the bookmark tag
//       bookmarkTag.appendChild(icon);
  
//       // Add the bookmark tag to the tweet element
//       tweet.appendChild(bookmarkTag);
//     });
//   });
  // Wait for the page to finish loading

window.addEventListener("load", function() {
  // Select all tweet elements
  var tweets = document.querySelectorAll("div.css-1dbjc4n.r-j5o65s.r-qklmqi.r-1adg3ll.r-1ny4l3");

  // Loop through each tweet element
  tweets.forEach(function(tweet) {
    // Create a new bookmark tag element
    var bookmarkTag = document.createElement("span");
    bookmarkTag.innerText = "Bookmark";

    // Add the bookmark tag to the tweet element
    tweet.appendChild(bookmarkTag);
  });
});

// article.css-1dbjc4n.r-1loqt21.r-18u37iz.r-1ny4l3l.r-1udh08x.r-1qhn6m8.r-i023vh.r-o7ynqcr-6416eg

