const express = require('express');
const fs = require('fs');
const app = express();

let comments = []; // Initialize an empty array to hold comments

// Read comments from comments.json initially
fs.readFile('comments.json', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    comments = JSON.parse(data); // Parse existing comments if the file exists
  }
});

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to show comments
app.get('/show', (req, res) => {
  res.json(comments);
});

// Endpoint to receive and store new comment
app.post('/send', (req, res) => {
  const { name, comment } = req.body;
  if (!name || !comment) {
    res.status(400).send('Your Name/Comment is undefined :(');
  } else {
    const date = new Date();
    const newComment = {
      name: name,
      comment: comment,
      date: `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
    };
    comments.push(newComment); // Add new comment to the array

    // Write updated comments array to comments.json
    fs.writeFile('comments.json', JSON.stringify(comments, null, 2), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send('Failed to send');
      } else {
        res.send('Success Send!');
      }
    });
  }
});

// Endpoint to serve different scripts based on key type
app.get('/script', (req, res) => {
  const key = req.query.key;
  const x = JSON.parse(fs.readFileSync('k.json'));

  if (key in x) {
    if (x[key].type === 'Free') {
      res.status(200).send(fs.readFileSync('./src/free-script.lua'));
    } else if (x[key].type === 'VIP') {
      res.status(200).send(fs.readFileSync('./src/vip_script-TSBNS.lua'));
    } else {
      res.status(400).send('Unknown script type');
    }
  } else {
    res.status(400).send('Key is Invalid!');
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Running on port 5000');
});
