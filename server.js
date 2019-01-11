
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/quotingJson', { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () { });

const PersonSchema = new mongoose.Schema({
    name: { type: String },
}, { timestamps: true });

PersonSchema.methods.speak = function () {
    let greeting = this.name ? `My name is ${this.name}` : "Um, I don't have a name!";
    console.log(greeting);
};

const Person = mongoose.model('Person', PersonSchema);

const moment = require("moment");
const express = require('express');

const flash = require('express-flash');

const app = express();

const bodyParser = require('body-parser');

const path = require('path');

const session = require('express-session');

app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, './public')));

app.use(flash());

app.set('views', path.join(__dirname, './views'));

app.set('view engine', 'ejs');



app.get('/', function (request, response) {
    Person.find({}, function (err, data) {
        if (err) {
            console.log("Something went wrong!:", err);
            for (var key in err.errors) {
                request.flash('registration', err.errors[key].message);
            }
            response.json({ message: "Error", error: err });
        } else {
            response.json({ message: "Success", data: data });
        }
    });
});

app.get('/:name', function (request, response) {
    Person.find({ name: request.params.name }, function (err, data) {
        if (err) {
            console.log("Something went wrong!:", err);
            for (var key in err.errors) {
                request.flash('registration', err.errors[key].message);
            }
            response.json({ message: "Error", error: err });
        } else {
            response.json({ message: "Success", data: data });
        }
    });
});

app.get('/new/:name', function (request, response) {
    Person.create({ name: request.params.name }, function name(err, data) {
        if (err) {
            console.log("Something went wrong!:", err);
            for (var key in err.errors) {
                request.flash('registration', err.errors[key].message);
            }
            response.json({ message: "Error", error: err });
        } else {
            response.json({ message: "Success", data: data });
        }
    });
});


app.get('/remove/:name', function (request, response) {
    Person.remove({ name: request.params.name }, function (err) {
        if (err) {
            console.log("Something went wrong!:", err);
            for (var key in err.errors) {
                request.flash('registration', err.errors[key].message);
            }
            response.json({ message: "Error", error: err });
        } else {
            response.json({ message: "Success", data: data });
        }
    });

});



app.listen(5000, function () {
    console.log("listening on port 5000");
});

