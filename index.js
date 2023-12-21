const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const ejs =require('ejs');


const config = require('./config');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const connection = mysql.createConnection(config.database);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + connection.threadId);
});

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/submit-form', (req, res) => {
    const formData = req.body;

    connection.query('INSERT INTO admin SET ?', formData, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal Server Error', details: error});
        } else {
            console.log('Data inserted successfully.');
       res.redirect('/home');
        }
    });
});



app.get('/home', (req, res) => {
    // Retrieve data from the database
    connection.query('SELECT * FROM admin', (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal Server Error', details: error });
        } else {
            // Render the data in an HTML table using EJS
            res.render('home', { data: results });
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
