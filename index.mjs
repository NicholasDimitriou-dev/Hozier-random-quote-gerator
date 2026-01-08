import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));


//setting up database connection pool
const pool = mysql.createPool({
    host: "l7cup2om0gngra77.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "af5hlqhk9w73faj3",
    password: "rcyt9yynfyyzgk4z",
    database: "mjht3yl2c5wmggdk",
    connectionLimit: 10,
    waitForConnections: true
});


//routes
app.get('/', async (req, res) => {
    let sql = `SELECT quote
               FROM Quotes
               ORDER BY RAND()
               LIMIT 1`;
  const [randomQuote] = await pool.query(sql);
   res.render('home.ejs', {randomQuote});
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