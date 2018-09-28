require('dotenv').config()

//Load libraries
const express = require('express');
const path = require('path');
const mysql = require('mysql');
var cors = require('cors');


//create an instance of express
const app=express();
app.use(cors());

const sqlFindAll = "SELECT * FROM books OFFSET=0 LIMIT=10";

const sqlFindByID = "SELECT id, author_lastname, author_firstname, title, cover_thumbnail FROM books WHERE id=?"; //"?" is subtituted by args, passed in line 74 through filmId

const sqlFindBooks = "SELECT id, author_lastname, author_firstname, title, cover_thumbnail FROM books WHERE (author_lastname LIKE ? OR author_firstname LIKE ?) AND title LIKE ? ORDER BY title ASC LIMIT ? OFFSET 0"; 

const sqlFindByName = "SELECT id, author_lastname, author_firstname, title, cover_thumbnail FROM books WHERE name LIKE ?"; 

const sqlUpdateItem = "UPDATE books SET author_lastname=?, author_firstname=?, title=? WHERE id=?"; 

const sqlInsertItem = "INSERT INTO books (author_lastname,author_firstname,title) VALUES(?, ?, ?)"; 

 

//Takes value from .env file
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: process.env.DB_CONLIMIT
})


//Create a reuseable function to query MySQL, wraps around with Promise
var makeQuery = (sql, pool)=>{
    console.log("SQL statement >>> ",sql);

    return  (args)=>{
        let queryPromise = new Promise((resolve,reject)=>{
            pool.getConnection((err,connection)=>{
                if(err){
                    reject(err);
                    return;
                }
                console.log("args>>> ", args);
                connection.query(sql, args || {}, (err,results)=>{
                    connection.release();
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(results);
                })
            });

        });
        return queryPromise;

    }
}

var findAll = makeQuery(sqlFindAll, pool);
var findByID = makeQuery(sqlFindByID, pool);
var findBooks = makeQuery(sqlFindBooks, pool);
var findByName = makeQuery(sqlFindByName, pool);
var updateItem = makeQuery(sqlUpdateItem, pool);
var insertItem = makeQuery(sqlInsertItem, pool);



//create routes
app.get('/books',(req,res)=>{

        let title = req.query.title;
        let fname = req.query.author;
        let lname = req.query.author;
        var limit = (req.query.limit*1);
        if (limit == 0) {
            limit = 10;
        }
        let qparams = [lname,fname,title,limit]; //ordering of parameters need to follow SQL statement ordering exactly

        console.log("Search Params *** ", qparams);
        findBooks(qparams).then((results)=>{
            console.log(results);
            res.json(results);
        }).catch((error)=>{
            console.log(error);
            res.status(500).json(error);
        });
    
/*
    allFilms().then((results)=>{
        res.json(results);
    }).catch((error)=>{
        console.log(error);
        res.status(500).json(error);
    });
*/
});


app.get("/books/:id", (req, res)=>{
    console.log("/ID !");
    let id = req.params.id;
    console.log(id);
    findByID([parseInt(id)]).then((results)=>{
        console.log(results);
        res.json(results);
    }).catch((error)=>{
        res.status(500).json(error);
    })
    
})


//Start web server
//start server on port 3000 if undefined on command line
const PORT=parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000

app.listen(PORT, ()=>{
    console.info(`Application started on port ${PORT} at ${new Date()}`);
});
