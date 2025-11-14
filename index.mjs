import express, { urlencoded } from 'express';
import mysql, { setMaxParserCache } from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: "ysp9sse09kl0tzxj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "ib3grk3xv6qvnip1",
    password: "fn4g21gt0h5mjnx1",
    database: "xtn5f2aybvuuamte",
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get('/', (req, res) => {
   res.render('home.ejs')
});
app.get('/authors', async(req, res) => {
    let sql = `SELECT authorId, firstName, lastName
               FROM authors
               ORDER BY lastName ASC`
    const [authors] = await pool.query(sql);
   res.render('authors.ejs', {authors})
});
app.get('/quotes', async(req, res) => {
    let sql = `SELECT quoteId, quote
               FROM quotes`
    const [quotes] = await pool.query(sql);
   res.render('quotes.ejs', {quotes})
});
app.get('/updateQuote', async(req, res) => {
    let authorId = req.query.id;
    let sql = `SELECT *,
               WHERE authorId = ?`       
    const [quoteInfo] = await pool.query(sql, [quoteId]);
   res.render('updateQuotes.ejs', {quoteInfo})
});
app.post('/updateQuote', async(req,res) => {
    let fn = req.body.first;
    let ln = req.body.last;
    let birthPlace = req.body.bp;
    let gender = req.body.sex;
    let proffe = req.body.prof;
    let img = req.body.url;
    let info = req.body.bio;
    let authorId = req.body.id;
    let sql = `UPDATE authors
               SET firstName = ?,
                   lastName = ?,
                   dob = ?,
                   dod = ?, 
                   sex = ?
               WHERE authorId = ?`
    let sqlParams = [fn, ln, dofb, dofd, authorId];
    const [authorInfo] = await pool.query(sql, sqlParams);
    res.redirect('/authors');
})
app.get('/updateAuthor', async(req, res) => {
    let authorId = req.query.id;
    let sql = `SELECT *,
               DATE_FORMAT(dob, '%Y-%m-%d') ISOdob,
               DATE_FORMAT(dod, '%Y-%m-%d') ISOdod
               FROM authors
               WHERE authorId = ?`       
    const [authorInfo] = await pool.query(sql, [authorId]);
   res.render('updateAuthor.ejs', {authorInfo})
});
app.post('/updateAuthor', async(req,res) => {
    let fn = req.body.first;
    let ln = req.body.last;
    let birthPlace = req.body.bp;
    let gender = req.body.sex;
    let proffe = req.body.prof;
    let img = req.body.url;
    let info = req.body.bio;
    let authorId = req.body.id;
    let sql = `UPDATE authors
               SET firstName = ?,
                   lastName = ?,
                   dob = ?,
                   dod = ?, 
                   sex = ?
               WHERE authorId = ?`
    let sqlParams = [fn, ln, dofb, dofd, authorId];
    const [authorInfo] = await pool.query(sql, sqlParams);
    res.redirect('/authors');
})
app.post('/addAuthor', async (req, res) => {
    let fn = req.body.first;
    let ln = req.body.last;
    let birthPlace = req.body.bp;
    let gender = req.body.sex;
    let proffe = req.body.prof;
    let img = req.body.url;
    let info = req.body.bio;
    let sql = `INSERT INTO authors
                (firstName, lastName, dob, dod, sex, profession, country, portrait, biography)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    let sqlParams = [fn, ln, dofb, dofd, gender,proffe, birthPlace, img, info];
    const [rows] = await pool.query(sql, sqlParams);
   res.render('addAuthor.ejs')
});
app.get('/addQuote', async(req, res) => {
    let sql = `SELECT authorId, firstName, lastName
               FROM authors
               ORDER BY lastName`;
    const [rows] = await pool.query(sql);
    sql = `SELECT DISTINCT(category) 
           FROM quotes
           ORDER BY category`;
    const [cate] = await pool.query(sql);
   res.render('addQuote.ejs', {rows, cate})
});
app.post('/addQuote', async (req, res) => {
    let id = req.body.authorId;
    let q = req.body.quote;
    let cates = req.body.Category;
    let sql = `INSERT INTO quotes
                (quote,authorId,category)
                VALUES (?, ?, ?)`
    let sqlParams = [q, id, cates];
    const [insert] = await pool.query(sql, sqlParams);
    sql = `SELECT authorId, firstName, lastName
               FROM authors
               ORDER BY lastName`;
    const [rows] = await pool.query(sql);
    sql = `SELECT DISTINCT(category) 
           FROM quotes
           ORDER BY category`;
    const [cate] = await pool.query(sql);
   res.render('addQuote.ejs', {rows, cate})
});
app.get('/addAuthor', (req, res) => {
   res.render('addAuthor.ejs')
});
app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.listen(3000, ()=>{
    console.log("Express server running")
})