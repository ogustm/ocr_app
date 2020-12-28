// To create the routes 
const express = require("express");
// To initialize the App
const app = express();
// To read and create files 
const fs = require("fs");
// To allow uploading files to our server
const multer = require("multer");
// To read our images 
const { TesseractWorker } = require("tesseract.js");
// To analize our images
const worker = new TesseractWorker();