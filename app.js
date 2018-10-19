var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	passport		= require("passport"),
	LocalStrategy 	= require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User 			= require("./models/user");

mongoose.connect("mongodb://localhost/travel_test_app");
app.use(bodyParser.urlencoded({extended:true}));

app.use(require("express-session")({
	secret: "Headout got 10M funding :o !",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
	res.render("home.ejs");
});

app.get("/userRegister",function(req,res){
	res.render("userRegister.ejs");
});

app.post("/userRegister",function(req,res){
	var newUser = new User({username: req.body.username,email: req.body.email});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("userRegister.ejs");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/userHomePage");
		});
	});
});

app.get("/userLogin",function(req,res){
	res.render("userLogin.ejs");
});

app.listen(process.env.PORT||2008,function(){
	console.log("SERVER STARTED");
});