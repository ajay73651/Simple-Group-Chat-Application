const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// login => GET
app.get("/login", (req, res, next) => {
  console.log("in another middle ware");
  res.send(
    '<form id="loginForm" action="/login" method="POST"><input type= "text" name="username"></input><button type="submit">Login</button></form>'
  );
});

// login => POST
app.post("/login", (req, res, next) => {
  res.send(`
        <script>
            localStorage.setItem("username", "${req.body.username}");
            window.location.href = "/";
        </script>
    `);
});

//  => GET
app.get("/", (req, res, next) => {
  fs.readFile("username.txt", "utf8", (err, fileContent) => {
    if (err) {
      console.error("Error reading username file:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.send(`
                <p>:: ${fileContent}</p>
                <form action='/' method='POST'>
                    <input type='hidden' id='storedUsername' name='username' value=''>
                    <input type= 'text' name='message'>
                    <button type='submit'>Send</button>
                </form>
                <script>
                    const storedUsername = localStorage.getItem('username');
                    document.getElementById('storedUsername').value = storedUsername;
                </script>
            `);
    }
  });
});

//  => POST
app.post("/", (req, res, next) => {
  const username = req.body.username;
  const message = req.body.message;
  const dataToAppend = `${username}: ${message}`;
  fs.appendFile("username.txt", dataToAppend + "\n", (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    }
  });
  res.redirect("/");
});

app.use((req, res, next) => {
  res.status(404).send("<h1>Page Not Found</h1>");
});

app.listen(4000);
