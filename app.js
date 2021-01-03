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
const worker = createWorker({
    logger: m => console.log(m), // Add logger here
  });


//STORAGE
//To save uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
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
      fs.readFile(`./uploads/${req.file.originalname}`, (err, data) => {
        if(error) return console.log('This is your error', err);
        
        (async () => {
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const { data: { text } } = await worker.recognize(data, "eng", {tessjs_create_pdf: '1'});
            res.send(text);                    
          })()
          
      });
               
    });
})

//Start Up the Server
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`Hey I'm running at Port ${PORT}`));