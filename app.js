const path = require('path');
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || localhost;
const users = require('./db/users.json');

const postsRouter = require('./routers/posts.js');
const errorsFormatter = require('./middlewares/errorsFormatter.js');
const routesNotFound = require('./middlewares/routesNotFound.js');
const auth = require('./controllers/auth.js');

// generic middleware
app.use(express.static('public'));
app.use(express.json());

app.post('/login', auth.login);

app.get('/home', (req, res) => res.sendFile( path.join(__dirname,'./index.html')));

app.use('/posts', postsRouter);


app.use(routesNotFound);
app.use(errorsFormatter);

app.listen(port, host, () => console.log(`Example app listening on http://${host}:${port}`));