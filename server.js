const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// process.env is an object that stores all of our environment variables as key value pairs.
// The || (or) operator will set port to 3000 if the enviroment variable does not exist.
const port = process.env.PORT || 3000;
var app = express();

// registerPartials is going to take the directory you wan to use for all of your handlebar partial files and we're going to be specifying that directory as the first and only argument.
hbs.registerPartials(__dirname + '/views/partials');

// app.set lets us set some various express related configurations
// there's a lot of built in one
// we will pass in a key-value pair
// In this case we are telling express what view engine that we are going to use
// Which is handlebars.
// NOTE: Configure the express settings before using express
// i.e do app.set followed by app.use
app.set('view engine', 'hbs');

// next exists so you can tell express that when your middleware function is done,
// and this is useful because you can have as much middleware as you would like to register to a single express app.
app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `${now}: ${req.method} ${req.url}`;

	console.log(log);
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log('Unable to append to server.log.');
		}
	});

	// Tells the application to continue to run.
	// If your middleware doesn't call next(), you handlers for each request are never going to fire.
	next(); // Tells the application to continue to run.
});

// app.use((req, res, next) => {
// 	res.render('maintenance.hbs');

// 	// next() is not used here.
// 	// It is missing because we do not want to execute the remaining helpers.
// 	// We want to stop processing here.
// });

// adding/registering middleware
// takes the middleware function that you want to use
// In this example, we will use a built in midleware.
// express.static() takes the absolute path to the folder that you want to serve up.
// __dirname stores the path to your project's directory, in this case it stores the path to node-web-server.
// NOTE: place this line after the handlers because the /public directory will remain accessible regardless of the registered handlers.
// In other words, with the maintenance helper code active, people can still access files within the /public directory.
// People should be able to access anything when the site is in mantenance mode. Therefore, the folder should be registered after the maintenance hander is registered.
app.use(express.static(__dirname + '/public'));

// registerHelper takes two arguments, it takes the name of the helper as the first argument,
// and the function to run as the second argument.
hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});

// register handler for an http get request
// first argument = url (root of the app)
// seconde argument = function to run (what to send back to the person who made the request.)
app.get('/', (req, res) => {
	// res.send('<h1>Hello Express!</h1>');
	/*
	res.send({
		name: 'Justin',
		likes: [
			'Biking',
			'Countryside'
		]
	})
	*/
	res.render('home.hbs', {
		pageTitle: 'Home Page',
		welcomeMessage: 'Welcome to my website!',
		//currentYear: new Date().getFullYear()
	});
});

app.get('/about', (req, res) => {
	//res.send('About Page');

	// res.render -> render is going to let you render any of the templates you have set up
	// with your current view engine.
	res.render('about.hbs', {
		pageTitle: 'About Page',
		//currentYear: new Date().getFullYear()
	});
});

app.get('/projects', (req, res) => {
	res.render('projects.hbs', {
		pageTitle: 'Projects Page',
		portfolioMessage: 'Portfolio page here'
	});
});

// /bad - send back json with errorMessage
app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'Unable to fulfill this request'
	});
});


// app.listen binds the application to a port on the machine
// does take a second optional argument -> a function
// this will let us do something once the server is up
app.listen(port, () => {
	console.log(`Server is up on port ${port}.`);
});

