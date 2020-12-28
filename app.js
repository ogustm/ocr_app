//ALL IMPORTS

// To create the routes 
const express = require("express");
// To initialize the App
const app = express();
// To read and create files 
const fs = require("fs");
// To allow uploading files to our server
const multer = require("multer");
// To read our images 
const { createWorker } = require("tesseract.js");
// To analize our images
const worker = createWorker();


//STORAGE
//To save uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads")
    }
});
const upload = multer({storage: storage}).single("avatar");


app.set("view engine", "ejs");

//ROUTES
app.get("/", (req, res) => {
    res.render('index');
})

app.post('/upload', (req, res) => {
    upload(req, res, error => {
        console.log(req.file);        
    })
})

//Start Up the Server
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`Hey I'm running at Port ${PORT}`));