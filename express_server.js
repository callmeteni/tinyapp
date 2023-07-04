const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8080;
app.set('view engine', 'ejs');
app.use(cookieParser());
const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};

const users = {};

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.listen(port, (req, res) => {
    console.log(`Example app listening on port ${port}`);
});

app.get('/urls.json', (req, res) => {
    res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
    const templateVars = { urls: urlDatabase, user: getUserByEmail(req.cookies.user_id) };
    res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
    const templateVars = { user: getUserByEmail(req.cookies.user_id) };
    res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
    const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user: getUserByEmail(req.cookies.user_id) };
    res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
    const templateVars = { user: getUserByEmail(req.cookies.user_id) };
    res.render("register", templateVars);
});


app.get("/login", (req, res) => {
    const user = getUserByEmail(req.cookies.user_id);

    if (user) {
      res.redirect("/urls");
    } else {
        templateVars = {user:null};
      res.render("login", templateVars);
    }
  });


app.post("/urls/:id/update", (req, res) => {
    const id = req.params.id;
    const longURL = req.body.longURL;
    urlDatabase[id] = longURL;
    res.redirect(`/urls/${id}`);
});

app.get("/u/:id/", (req, res) => {
    const id = req.params.id;
    const longURL = urlDatabase[id];
    if (longURL) {
        res.redirect(longURL);
    } else {
        res.status(404).send("Not Found");
    }
});

app.use(express.urlencoded({ extended: true }));

app.post("/register", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const existingUser = getUserByEmail(email);
    if (!email || !password) {
        return res.status(400).send("Please enter email and password");
    }
    if (existingUser) {
        return res.status(400).send("Email already exists");
    }

    const newUser = {
        id: generateRandomString(),
        email: email,
        password: bcrypt.hashSync(password, 10)
    };
    users[newUser.id] = newUser;

    res.cookie("user_id", newUser.id);
    res.redirect("/urls");
});

app.post ("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = getUserByEmail(email);
    if (!email ||!password) {
        return res.status(400).send("Please enter email and password");
    }
    if (!user) {
        return res.status(400).send("Invalid email or password");
    }
    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).send("Invalid email or password");
    }
    res.cookie("user_id", user.id);
    res.redirect("/urls");
});

app.post("/urls", (req, res) => {
    const shortURL = generateRandomString();
    const longURL = req.body.longURL;
    urlDatabase[shortURL] = longURL;
    res.redirect(`/urls/${shortURL}`);
});



app.post("/urls/:id/delete", (req, res) => {
    const id = req.params.id;;
    if (urlDatabase[id]) {
        delete urlDatabase[id];
        res.redirect("/urls");
    } else {
        res.status(404).send("Not Found");
    }
})

app.post("/logout", (req, res) => {
    res.clearCookie("user_id");
    res.redirect("/login");
});

function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        const randomChar = characters.charAt(randomIndex);
        randomString += randomChar;
    }

    return randomString;
}
function getUserByEmail(email) {
    for (const userId in users) {
        const user = users[userId];
        if (user.email === email) {
            return user;
        }
    }
    return null;
}
