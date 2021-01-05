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
      fs.readFile(`./uploads/${req.file.originalname}`, (err, imageData) => {
        if(error) return console.log('This is your error', err);
        
        (async () => {
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const { data: { text } } = await worker.recognize(imageData);            
            
            const pdfPromise = await worker.getPDF();
            
            const regex = /\.gif|\.jpg|\.png|\.webg|\.jpeg/gi;
            let fileName = req.file.originalname;
            fileName = fileName.replace(regex, '.pdf');

            fs.writeFileSync(fileName, Buffer.from(pdfPromise.data));
            
            res.redirect("/download?fileName=" + fileName);
            
          })()
          
      });
               
    });
});

app.get("/download", (req, res) => {

    const file = `${__dirname}/${req.query.fileName}`;
    res.download(file);
});



//Start Up the Server
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`Hey I'm running at Port ${PORT}`));