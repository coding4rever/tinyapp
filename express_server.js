const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

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

// declare all characters
const characters = "hdfxfdxhjihidfghioehjtgjreio";

function generateString(length) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

//npx kill-port --port 8080
// npm install nodemon
//npm run dev

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

function getUserByEmail(email) {
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

function getUrlsByUserId (userID, urlDB){
  const newUrlDb = {};
  for ( const url in urlDB ) {
    if(userID === urlDB[url].userID){
      newUrlDb[url] = urlDB[url]
    }
  }
  return newUrlDb
}
console.log(getUrlsByUserId("aJ48lW", urlDatabase))

app.use(express.urlencoded({ extended: true }));

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

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// app.get("/urls", (req, res) => {
//     const templateVars = { urls: urlDatabase };
//     const templateVars = { urls: urlDatabase, username: req.cookies.username };
//     res.render("urls_index", templateVars);
//   });

app.get("/urls", (req, res) => {
  const userIdCookie = req.cookies.user_id;
  if (!userIdCookie) {
    return res.redirect("/login");
  }
  const currentUser = users[userIdCookie];
  const templateVars = { urls: getUrlsByUserId(userIdCookie, urlDatabase), currentUser };
 

  res.render("urls_index", templateVars);
});

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

  //res.render("urls_show", templateVars);
  res.render("urls_new", templateVars);
  //res.render("urls_new", { username: req.cookies.username });
  //res.render("urls_new", { user: req.cookies.user_id });
  //res.render("urls_new", { user: req.cookies.username });
});

/*app.get("/urls/:id", (req, res) => {
    const templateVars = { id: req.params.id, longURL: href="http://www.lighthouselabs.ca" };
    res.render("urls_show", templateVars);
  });*/

app.post("/urls", (req, res) => {
  //console.log(req.body); // Log the POST request body to the console
  //res.send("Ok"); // Respond with 'Ok' (we will replace this)
  const userID = req.cookies.user_id;
  const longURL = req.body.longURL;
  const shortUrl = generateString(6);
  //                    //Add to the database
  urlDatabase[shortUrl] = {longURL, userID}
  
  console.log(urlDatabase);
  //res.redirect(`/urls/${shortUrl}`);
  res.redirect("/urls");

  // const longURL = req.body.longURL;
  //   const id =  generateString(6);
  //   urlDatabase[id] = {
  //     longURL: longURL,
  //     userID: req.cookie.user.id
  //   };
  //   res.redirect(`/urls/${id}`);
  // });
});

/*app.get("/urls/:id", (req, res) => {
    const shortUrl = req.params.shortUrl
    const templateVars = { id: shortUrl, longURL: urlDatabase[shortUrl] };
    res.render("urls_show", templateVars);
  });*/

app.get("/urls/:shortUrl", (req, res) => {
  const userIdCookie = req.cookies.user_id;
  const shortUrl = req.params.shortUrl;
  const currentUser = users[userIdCookie];
  const templateVars = {
    id: shortUrl,
    longURL: urlDatabase[shortUrl].longURL,
    currentUser,
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortUrl", (req, res) => {
  const longURL = urlDatabase[req.params.shortUrl];
  //console.log(longURL);
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("URL Unavailable");
  }
});

app.post("/urls/:shortUrl/delete", (req, res) => {
  const shortUrl = req.params.shortUrl;
  delete urlDatabase[shortUrl];
  res.redirect("/urls");
  console.log(shortUrl);

  console.log(urlDatabase);
  console.log(urlDatabase[shortUrl]);
  console.log(urlDatabase[shortUrl]);
});

app.post("/urls/:shortUrl/edit", (req, res) => {
  const shortUrl = req.params.shortUrl;
  const newURL = req.body.updatedLongURL;
  urlDatabase[shortUrl].longURL = newURL;
  res.redirect("/urls"); // Redirect to the index page after editing the URL
});

// app.post("/login", (req, res) => {
//   const username = req.body.username;
//   res.cookie("username", username);
//   res.redirect("/urls");
// });

// app.post("/logout", (req, res) => {
//    res.clearCookie("username");
//    res.redirect("/urls");
//  });

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    res.cookie("user_id", user.id);
    res.redirect("/urls");
  } else {
    res.status(401).send("Invalid email or password");
  }
});

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

// app.get("/login", (req, res) => {
//   if(req.cookie.user.id){
//     res.redirect("/urls")
//   }
//   else {
//     res.render("login")
//   }
//    });

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  //res.redirect("/urls");
  res.redirect("/login");
});

// app.post("/register", (req, res) => {
//   const { email, password } = req.body;
//   const id = generateRandomString(6);

//   if(getUserByEmail(email)) {
//       res.status(400).end(`${email} is already registered`);
//     } else {
//       users[id] = { id, email, password };
//       res.cookie("user_id", id);
//       res.redirect("/urls");
//     }
// });

// app.get("/register", (req, res) => {
//   res.render("register");
// });

app.get("/register", (req, res) => {
  // const templateVars = {
  //   username: req.cookies["username"],
  // };
  // res.render("user_registration", templateVars);


  const userIdCookie = req.cookies.user_id;
  const currentUser = users[userIdCookie];
  const templateVars = {
   
    currentUser,
  };
  
  res.render("user_registration", templateVars);
});

// app.get("/register", (req, res) => {
//   res.render("register");
// });

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const id = generateString(6);

  if (getUserByEmail(email)) {
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

//  app.get("/register", (req, res) => {
//   const templateVars = {
//     username: req.cookies['user']
//   };
//  res.render("user_registration", templateVars);
// });

// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}!`);
// });

// app.post("/login", (req, res) => {
//   const username = req.body.username;
//   res.cookie("username", username);
//   res.redirect("/urls");
// });