require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const { Client } = require("@notionhq/client");

const app = express();

const YOUR_CALLBACK_URL = 'http://localhost:5000/auth/notion/callback'; // Example: 'http://localhost:5000/auth/notion/callback'

app.use(bodyParser.json());
app.use(cookieParser());

// Handle the redirect to Notion's OAuth page
app.get('/auth/notion', (req, res) => {
    const redirectUri = encodeURIComponent(YOUR_CALLBACK_URL);
    const clientId = process.env.NOTION_CLIENT_ID;
    res.redirect(`https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`);
});

// Handle the callback from Notion and set the access token in a secure cookie
app.get('/auth/notion/callback', async (req, res) => {
    try {
        let code = req.query.code;
        console.log("Code:", code);
        notionClientId = process.env.NOTION_CLIENT_ID;
        notionClientSecret = process.env.NOTION_CLIENT_SECRET;
        const encoded = Buffer.from(`${notionClientId}:${notionClientSecret}`).toString('base64');

        const response = await axios.post('https://api.notion.com/v1/oauth/token', {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: YOUR_CALLBACK_URL
        }, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Basic ${encoded}`
            }
        });

        const accessToken = response.data.access_token;

        res.cookie('notion_access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000 // 1 hour
        });
        console.log("Access token set in cookie");
        res.redirect('/close');
    } catch (error) {
        console.error("Error in /auth/notion/callback:", error);
        res.status(500).send('Error during the authentication process. Please try again.');
    }
});

app.get('/close', (req, res) => {
    const closePage = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Close Window</title>
    </head>
    <body>
        <script type="text/javascript">
            window.close();
        </script>
    </body>
    </html>
    `;
    res.send(closePage);
});

// Fetch a list of databases for an authenticated user
app.get('/notion/databases', async (req, res) => {
    try {
        const userToken = req.cookies.notion_access_token;
        if (!userToken) {
            return res.status(401).send('Not authenticated');
        }

        const notion = new Client({ auth: userToken });
        const databases = await notion.databases.list();
        res.json(databases);
    } catch (error) {
        console.error("Error in /notion/databases:", error);
        res.status(500).send('Error fetching databases from Notion. Please check your connection and try again.');
    }
});

app.get('/api/getToken', (req, res) => {
    const accessToken = req.cookies.notion_access_token;
    if (!accessToken) {
        return res.status(401).json({ error: 'Not Authenticated' });
    }
    res.json({ accessToken });
});


// Save a bookmark to a selected database
app.post('/notion/save', async (req, res) => {
    try {
        const { title, url, databaseId, tags, notes } = req.body;
        const userToken = req.cookies.notion_access_token;

        if (!userToken) {
            return res.status(401).send('Not authenticated');
        }

        const notion = new Client({ auth: userToken });
        await notion.pages.create({
            parent: { type: "database_id", database_id: databaseId },
            properties: {
                "Name": {
                    "title": [
                        {
                            "text": {
                                "content": title
                            }
                        }
                    ]
                },
                "URL": {
                    "url": url
                },
                "Tags": {
                    "multi_select": tags.map(tag => ({
                        "name": tag
                    }))
                },
                "Notes": {
                    "rich_text": [
                        {
                            "type": "text",
                            "text": {
                                "content": notes
                            },
                            "annotations": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": false,
                                "underline": false,
                                "code": false,
                                "color": "default"
                            },
                            "plain_text": notes,
                            "href": null
                        }
                    ]
                }
            }

        });

        res.status(200).send('Bookmark saved');
    } catch (error) {
        console.error("Error in /notion/save:", error);
        res.status(500).send('Error saving the bookmark to Notion. Please ensure you have the right permissions and try again.');
    }
});

// Log out user and clear the token cookie
app.get('/logout', (req, res) => {
    res.clearCookie('notion_access_token');
    res.redirect('/login-page-or-any-other'); // Redirect to login page or home page after logout
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
