
const express = require("express");
const {generateString, getUrlsByUserId, getUserByEmail} = require("./helpers.js")
const app = express();
const cookieParser = require("cookie-parser");
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

//Database to generate Id
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database to generate userID
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};


console.log(getUrlsByUserId("aJ48lW", urlDatabase))

app.use(express.urlencoded({ extended: true }));

//Get route for homepage
app.get("/", (req, res) => {
  //res.send("Hello!");
  const userIdCookie = req.cookies.user_id;
  const currentUser = users[userIdCookie];
  if (currentUser) {
    return res.redirect("/urls");
  }
  else {
   return res.redirect("/login")
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


//Get route for urls.json
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


//Get route for urls
app.get("/urls", (req, res) => {
  const userIdCookie = req.cookies.user_id;
  if (!userIdCookie) {
    return res.redirect("/login");
  }
  const currentUser = users[userIdCookie];
  const templateVars = { urls: getUrlsByUserId(userIdCookie, urlDatabase), currentUser };
 

  res.render("urls_index", templateVars);
});


//Get route for urls/new
app.get("/urls/new", (req, res) => {
  //res.render("urls_new");
  const userIdCookie = req.cookies.user_id;
  if (!userIdCookie) {
    return res.redirect("/login");
  }
  const shortUrl = req.params.shortUrl;
  
  const currentUser = users[userIdCookie];

  const templateVars = {
    id: shortUrl,
    longURL: urlDatabase[shortUrl],
    currentUser,
  };

 
  res.render("urls_new", templateVars);

});


//Post route for urls
app.post("/urls", (req, res) => {

  const userID = req.cookies.user_id;
  const longURL = req.body.longURL;
  const shortUrl = generateString(6);
  //                    //Add to the database
  urlDatabase[shortUrl] = {longURL, userID}
  
  console.log(urlDatabase);
  //res.redirect(`/urls/${shortUrl}`);
  res.redirect("/urls");


});
7


//Get route for urls/:shorturl
app.get("/urls/:shortUrl", (req, res) => {
  const userIdCookie = req.cookies.user_id;
  if (!userIdCookie) {
    return res.status(400).send("You are not logged in")
  }
  
  const shortUrl = req.params.shortUrl;
  if (!urlDatabase[shortUrl]){
    return res.status(404).send("This Url not found")
  }
  const currentUser = users[userIdCookie];
  const templateVars = {
    id: shortUrl,
    longURL: urlDatabase[shortUrl].longURL,
    currentUser,
  };
  res.render("urls_show", templateVars);
});


//Get route for u:shortUrl
app.get("/u/:shortUrl", (req, res) => {
  const longURL = urlDatabase[req.params.shortUrl];
  //console.log(longURL);
  if (longURL) {
    res.redirect(longURL.longURL);
  } else {
    res.status(404).send("URL Unavailable");
  }
});


//Post route for delete
app.post("/urls/:shortUrl/delete", (req, res) => {
  const shortUrl = req.params.shortUrl;
  delete urlDatabase[shortUrl];
  res.redirect("/urls");
  console.log(shortUrl);

  console.log(urlDatabase);
  console.log(urlDatabase[shortUrl]);
  console.log(urlDatabase[shortUrl]);
});


//Post route for edit
app.post("/urls/:shortUrl/edit", (req, res) => {
  const shortUrl = req.params.shortUrl;
  const newURL = req.body.updatedLongURL;
  urlDatabase[shortUrl].longURL = newURL;
  res.redirect("/urls"); // Redirect to the index page after editing the URL
});


//Post route for login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);
  if (user && user.password === password) {
    res.cookie("user_id", user.id);
    res.redirect("/urls");
  } else {
    res.status(401).send("Invalid email or password");
  }
});


//Get route for login
app.get("/login", (req, res) => {
  const userIdCookie = req.cookies.user_id;
  const currentUser = users[userIdCookie];
  if (currentUser) {
    return res.redirect("/urls");
  }
  const templateVars = {
   
    currentUser,
  };
  
  res.render("login", templateVars);
});


//Post route for logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  //res.redirect("/urls");
  res.redirect("/login");
});


//Get route for register
app.get("/register", (req, res) => {
  const userIdCookie = req.cookies.user_id;
  const currentUser = users[userIdCookie];
  const templateVars = {
   
    currentUser,
  };
  
  res.render("user_registration", templateVars);
});


//Post route for Register
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const id = generateString(6);

  if (getUserByEmail(email, users)) {
    res.status(400).end(`${email} is already registered`);
  } else {
    users[id] = {
      id: id,
      email: email,
      password: password,
    };
    res.cookie("user_id", id);
    res.redirect("/urls");
  }
  console.log(users);
});

