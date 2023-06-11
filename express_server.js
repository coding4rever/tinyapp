const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

//npx kill-port --port 8080 
// npm install nodemon
//npm run dev

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(express.urlencoded({ extended: true }));

// declare all characters
const characters ='hdfxfdxhjihidfghioehjtgjreio';

function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
  });

app.get("/urls", (req, res) => {
    const templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
  });

  app.get("/urls/new", (req, res) => {
    res.render("urls_new");
  });

  /*app.get("/urls/:id", (req, res) => {
    const templateVars = { id: req.params.id, longURL: href="http://www.lighthouselabs.ca" };
    res.render("urls_show", templateVars);
  });*/

  app.post("/urls", (req, res) => {
    //console.log(req.body); // Log the POST request body to the console
    //res.send("Ok"); // Respond with 'Ok' (we will replace this)
    const longUrl = req.body.longURL
    const shortUrl = generateString(6)
    //Add to the database
    urlDatabase[shortUrl] = longUrl
    console.log(shortUrl)
    console.log(urlDatabase)
    res.redirect(`/urls/${shortUrl}`);

  });

  /*app.get("/urls/:id", (req, res) => {
    const shortUrl = req.params.shortUrl
    const templateVars = { id: shortUrl, longURL: urlDatabase[shortUrl] };
    res.render("urls_show", templateVars);
  });*/

   app.get("/urls/:shortUrl", (req, res) => {
    const shortUrl = req.params.shortUrl
    const templateVars = { id: shortUrl, longURL: urlDatabase[shortUrl] };
    res.render("urls_show", templateVars);
  });

  app.get("/u/:shortUrl", (req, res) => {
  const longURL = urlDatabase[req.params.shortUrl];
  //console.log(longURL);
  res.redirect(longURL);
  });
  
  