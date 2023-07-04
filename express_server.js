const express = require('express');
const app = express();
const port = 8080;
app.set('view engine', 'ejs');

const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};

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
    const templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
    res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
    const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
    res.render("urls_show", templateVars);
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

    app.post("/urls", (req, res) => {
        const shortURL = generateRandomString();
        const longURL = req.body.longURL;
        urlDatabase[shortURL] = longURL;
        res.redirect(`/urls/${shortURL}`);
    });

    app.post("/urls/:id/delete", (req, res) => {
    const id = req.params.id;;
    if (urlDatabase[id]){
        delete urlDatabase[id];
        res.redirect("/urls");
    }else {
        res.status(404).send("Not Found");
    }
})

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