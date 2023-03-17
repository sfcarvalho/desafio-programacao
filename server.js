const express = require('express');
const multer = require('multer');
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

app.get('/products', function (req, res) {
    connection.query('SELECT * FROM products', function (error, results) {
        if (error) {
            throw error
        };
        res.send(results.map(item => ({ name: item.name, price: item.price })));
    });
});

app.get('/home', function (req, res) {
    res.send("Home");
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post('/uploadjavatpoint', function (req, res) {
    var upload = multer({ storage: storage }).single('myfile');
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded successfully!");
    });
});

app.listen(3000, function () {
    console.log('Listening on port 3000');
})

app.post("/uploadFile", upload.single("myFile"), (req, res, next) => {
    const file = req.file;

    if (!file) {
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
    }

    // Create a buffer from the file using multer
    const multerText = Buffer.from(file.buffer).toString("utf-8");

    var buf = Buffer(multerText);
    var bufferStream = new stream.PassThrough();
    bufferStream.end(buf);

    // Using readline native NodeJS method
    var rl = readline.createInterface({
        input: bufferStream,
    });

    var count = 0;
    // Starting to iterate each line
    rl.on('line', function (line) {
        rsImport = [];
        console.log('Linha ' + (++count) + ' valor = ' + line);
        var transaction = line.slice(0, 1);
        var data = line.slice(1, 26);
        var product = line.slice(26, 56).replace(/\s+/g, ' ').trim();
        var amount = transaction == "3" ? (parseInt(line.slice(56, 66)).toFixed(2) / 100) * -1 : parseInt(line.slice(56, 66)).toFixed(2) / 100;
        var seller = line.slice(66, 86);
        connection.query('INSERT INTO sales_transactions VALUE(0,\'' + transaction + '\',\'' + data + '\',\'' + product + '\',\'' + amount + '\',\'' + seller + '\');', function (error, results) {
            if (error) {
                throw error
            };
        });
    });
    // Closing the Buffer Stream with last inserted lines count
    rl.on('close', function () {
        console.log("Count" + count);
        connection.query('SELECT * from sales_transactions order by id desc limit '+ count, function (error, results) {
            if (error) {
                throw error
            };
            var rsSells = results.map(item => ({
                id: item.id,
                type: item.type,
                datetime: item.datetime,
                product: item.product,
                value: item.value,
                seller: item.seller
            }));
            // Sending to grid
            res.send(rsSells);
        });
    })
});

app.get('/sales', function (req, res) {
    connection.query('select seller as Vendedor,sum(Case when value > 0 then value else 0 end) as Saldo_Produtor,  Sum(Case when value < 0 then value else 0 end) as Comissoes, (Sum(Case when value > 0 then value else 0 end))+(Sum(Case when value < 0 then value else 0 end)) as Valor_Ganho  from sales_transactions group by seller', function (error, results) {
        if (error) {
            throw error
        };
        res.send(results.map(item => ({
            seller: item.Vendedor,
            producer: item.Saldo_Produtor,
            discounts: item.Comissoes,
            amount_earned: item.Valor_Ganho
        })));

    });
});

app.get('/clean', function (req, res) {
    connection.query('DELETE FROM sales_transactions', function (error, results) {
        if (error) {
            throw error
        };
    });
});