const express = require("express");
const path = require("path")
const session = require("express-session")
const SessionStore = require("connect-mongodb-session")(session)
const flash = require("connect-flash")
const socketIO =  require("socket.io")

const homeRouter = require("./routes/home.route");
const authRouter = require("./routes/auth.route");
const friendsRouter = require("./routes/friends.route");
const profileRouter = require("./routes/profile.route");
const friendRouter = require("./routes/friend.route");
const chatRouter = require("./routes/chat.route");
const groupsRouter = require("./routes/groups.route");

const friendRequests = require("./models/user.model").friendRequests

const app = express();
const server = require("http").createServer(app);
const io = socketIO(server);

io.onlineUsers = {};

require("./sockets/friend.socket")(io);
require("./sockets/init.socket")(io);
require("./sockets/chat.socket")(io);

app.use(express.static(path.join(__dirname,"assets")))
app.use(express.static(path.join(__dirname,"images")))
app.use(flash())

const STORE = new SessionStore({
    uri: "mongodb://127.0.0.1:27017/chat-app",
    collection: "sessions"
})

app.use(session({
    secret: "this herango how fliyings... .",
    saveUninitialized: false,
    store: STORE,
    resave:false
}))

app.set("view engine","ejs")
app.set("views","views")




app.use((req,res,next)=>{
    let id = req.session.userId
    if(id){
        friendRequests(id).then((requests)=>{
            req.friendRequests = requests
            next()
        }).catch(err => {
            res.redirect("/error")
    })
    }else{
        next()
    }
})

app.use("/",homeRouter)
app.use("/",authRouter)
app.use("/",friendsRouter)
app.use("/profile",profileRouter)
app.use("/friend",friendRouter)
app.use("/friend",chatRouter)
app.use("/",groupsRouter)

app.get("/error",(req,res,next)=>{
    res.status(500)
    let problem  = req.session.problem
    delete req.session.problem

    res.render("error.ejs",{
        problem: problem,
        pageTitle: "Error",
        friendRequests: []
    })
})

app.use((req,res,next)=>{
    res.status(404)
    res.render("not-found",{
        pageTitle: "Page Not Found",
        friendRequests: []
    })
})







let port = process.env.PORT || 3000;

server.listen(port,()=>{
    console.log("server is listen in " + port);
})