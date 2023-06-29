require('dotenv').config();
const { Client } = require("@notionhq/client");
const bodyParser = require('body-parser');
const express = require('express');
const app = express();


app.use(bodyParser.json());
const notion = new Client({ auth: process.env.NOTION_API_TOKEN });

app.post("/api/bookmarks", async (req, res) => {
    try {
      const { title, url, tags, notes } = req.body;
  
      // Create an object with the bookmark data
      const bookmark = {
        title,
        url,
        tags,
        notes,
      };
  
      // Save the bookmark to the Notion database
      const databaseId = process.env.NOTION_DATABASE_ID; 
  
      const response = await notion.pages.create({
        "parent": { 
          "type": "database_id",
          "database_id": databaseId 
        },
        "properties": {
          "Name": {
            "title": [
              {
                "text": {
                  "content": bookmark.title,
                },
              },
            ],
          },
          "URL": {
            "url": url,
          },
          // "Tags": {
          //  " multi_select": [
          //     {
          //       "name": bookmark.tags,
          //     },
          //   ],
          // },
          "Notes": {
           "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": bookmark.notes,
                  "link": null
                },
                "annotations": {
                  "bold": false,
                  "italic": false,
                  "strikethrough": false,
                  "underline": false,
                  "code": false,
                  "color": "default"
                },
                "plain_text": "There is some ",
                "href": null
              },
            ],
          },
        },
      });
      
  
      res.status(200).json({ message: "Bookmark saved successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while saving the bookmark" });
    }
  });
  

const port = 5000; // Replace with your desired port number
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
