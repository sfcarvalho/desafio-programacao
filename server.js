const express = require('express');
const multer  =   require('multer');
const path = require("path");
const mysql = require('mysql');
const app = express();

// var storage =   multer.diskStorage({  
//     destination: function (req, file, callback) {  
//       callback(null, './uploads');  
//     },  
//     filename: function (req, file, callback) {  
//       callback(null, file.originalname);  
//     }  
//   });  

// var upload = multer({ storage : storage}).single('myfile'); 

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'text/plain') { // checking the MIME type of the uploaded file
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    fileFilter,
    storage
});

const connection = mysql.createConnection({
  host: 'mysql-container',
  user: 'root',
  password: 'docker',
  database: 'docker'
});

connection.connect();

app.get('/products', function(req, res) {
   connection.query('SELECT * FROM products', function (error, results) {
      if (error) { 
         throw error
   };
   res.send(results.map(item => ({ name: item.name, price: item.price })));
  });
});

app.get('/home', function(req, res) {
    res.send("Home");
});

app.get('/',function(req,res){  
    res.sendFile(__dirname + "/index.html");  
});  

app.post('/uploadjavatpoint',function(req,res){  
    upload(req,res,function(err) {  
        if(err) {  
            return res.end("Error uploading file.");  
        }  
        res.end("File is uploaded successfully!");  
    });  
});  

app.listen(3000, function() {
    console.log('Listening on port 3000');
})

app.post("/uploadFile", upload.single("myFile"), (req, res, next) => { 
    const file = req.file;
  
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
    const multerText = Buffer.from(file.buffer).toString("utf-8");
  
    const result = {
      fileText: multerText
    };
  
    res.send(result);
  });