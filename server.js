const express = require('express');
const multer  =   require('multer');
const path = require("path");
const mysql = require('mysql');
var readline = require('readline');
var stream = require('stream');
const app = express();


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

    var buf = Buffer(multerText);
    var bufferStream = new stream.PassThrough();
    bufferStream.end(buf);

    var rl = readline.createInterface({
        input: bufferStream,
    });

    var count = 0;
    rl.on('line', function (line) {
        console.log('Linha ' + (++count) + ' valor = ' + line);
        console.log('Transacao ' + line.slice(0,1));
        console.log('Data ' + line.slice(1,26));
        console.log('Produto ' + line.slice(26,56));
        console.log('Valor ' + line.slice(56,66));
        console.log('Vendedor ' + line.slice(66,86));
        var transaction = line.slice(0,1);
        var data = line.slice(1,26);
        var product = line.slice(26,56).replace(/\s+/g, ' ').trim();
        var amount = parseInt(line.slice(56,66)).toFixed(2);
        var seller = line.slice(66,86);

        connection.query('INSERT INTO sales_transactions VALUE(0,\'' + transaction + '\',\'' +data +'\',\''+ product +'\',\''+amount+'\',\''+seller+'\');', function (error, results) {
            if (error) {
               throw error
         };
        });
    });

connection.query('SELECT * FROM sales_transactions', function (error, results) {
    if (error) { 
       throw error
 };
 const rsSales = results.map(item => ({ 
     id: item.id, 
     type: item.type,
     datetime: item.datetime,
     product: item.product,
     value: item.value,
     seller: item.seller
  }));
  const result = {
    results: rsSales
  };

  res.send(result);
});

  });

  app.get('/sales', function(req, res) {
    connection.query('SELECT * FROM sales_transactions', function (error, results) {
       if (error) { 
          throw error
    };
    res.send(results.map(item => ({ 
        id: item.id, 
        type: item.type,
        datetime: item.datetime,
        product: item.product,
        value: item.value,
        seller: item.seller
     })));
   });
 });

 app.get('/clean', function(req, res) {
    connection.query('DELETE FROM sales_transactions', function (error, results) {
       if (error) { 
          throw error
    };
});
 });