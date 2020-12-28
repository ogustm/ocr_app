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

//To save uploaded images

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "./uploads")
    },
    filename: (req, res, cb) => {
        cb(null, req.file);
    }
});

const upload = multer({storage: storage}).single("avatar");
app.set("view engine", "ejs");

//Start Up the Server
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`Hey I'm running at Port ${PORT}`));