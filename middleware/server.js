const express = require('express')
const app = express();
const path = require('path')

const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')

const cors = require('cors')

const PORT = process.env.PORT || 3500;

//custom middleware logger
app.use(logger)

//cross origin resource sharing
const whitelist = ['https://www.google.com', 'https://127.0.0.1:5500', 'https://localhost:3500']
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

//built in middleware:
app.use(express.urlencoded({extended: false}))

//built in middleware for json
app.use(express.json())

//serve static files
app.use(express.static(path.join(__dirname, '/public')))

/* '^/$|/index.html' -> must begin with a slash, must end with a slash
    or, '/index.html' but because of the brakets and question mark 
    around it, it doesn't need to be there to still work */
app.get('^/$|/index(.html)?', (req, res) => {
    //res.sendFile('./views/index.html', {root: __dirname})

    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.get('/new-page.(html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'))
})

app.get('/old-page.(html)?', (req, res) => {
    res.redirect(301, '/new-page.html')
})



// Route handlers
app.get('/hello(.html)?', (req, res, next) => {
    console.log('attempted to load hello.html');
    next()
}, (req, res) => {
    res.send('Hello World!');
});


// chaining route handlers
const one = (req, res, next) => {
    console.log('one');
    next();
}

const two = (req, res, next) => {
    console.log('two');
    next();
}

const three = (req, res) => {
    console.log('three');
    res.send('Finished!');
}

app.get('/chain(.html)?', [one, two, three]);


app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({error: "404 not found"})
    } else {
        res.type('txt').send("404 not found")
    }
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`server run on port ${PORT}`))