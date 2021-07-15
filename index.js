const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "manager",
  database: "loginsystem",
});

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const first = req.body.first;
  const last = req.body.last;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    db.query(
      "INSERT INTO users (username, password,firstname,lastname) VALUES (?,?,?,?)",
      [username, hash, first, last],
      (err, result) => {
        console.log(err);
        res = result;
      }
    );
  });
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE username = ?;",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {
            req.session.user = result;
            console.log(req.session.user);
            res.send(result);
          } else {
            res.send({ message: "Wrong username/password combination!" });
          }
        });
      } else {
        res.send({ message: "User doesn't exist" });
      }
    }
  );
});
app.post('/create', (req, res) => {
  const artworkName = req.body.artworkName;
  const artworkDescription = req.body.artworkDescription;
  const artworkUpload = req.body.artworkUpload;
  const artworkPrice = req.body.artworkPrice;
  const artworkCategory = req.body.artworkCategory;
  const artworkQuantity = req.body.artworkQuantity;

  db.query('INSERT INTO artworks (artwork_name, artwork_description, artwork_image, artwork_price, artwork_category, artwork_quantity) VALUES (?,?,?,?,?,?)',
  [artworkName, artworkDescription, artworkUpload, artworkPrice, artworkCategory, artworkQuantity], 
  (err, result) => {
      if (err) {
          console.log(err);
      } else{
          res.send("Values Inserted");
      }
  }
  );
})
app.get('/artworks', (req, res) => {
  db.query("SELECT * FROM artworks", (err, result) => {
      if(err){
          console.log(err)
      }else{
          res.send(result)
      }
  })
})
app.get('/products', (req, res) => {
  db.query("SELECT * FROM art_tool", (err, result) => {
      if(err){
          console.log(err)
      }else{
          res.send(result)
      }
  })
})
app.get('/brushes', (req, res) => {
  db.query("SELECT * FROM art_tool WHERE tool_category = 'Brushes'", (err, result) => {
      if(err){
          console.log(err)
      }else{
          res.send(result)
      }
  })
})
app.get('/canvas', (req, res) => {
  db.query("SELECT * FROM art_tool WHERE tool_category = 'Art Boards & Canvas'", (err, result) => {
      if(err){
          console.log(err)
      }else{
          res.send(result)
      }
  })
})
app.get('/supplies', (req, res) => {
  db.query("SELECT * FROM art_tool WHERE tool_category = 'Painting Supplies'", (err, result) => {
      if(err){
          console.log(err)
      }else{
          res.send(result)
      }
  })
})
app.get('/easels', (req, res) => {
  db.query("SELECT * FROM art_tool WHERE tool_category = 'Easels'", (err, result) => {
      if(err){
          console.log(err)
      }else{
          res.send(result)
      }
  })
})
app.get('/drawings', (req, res) => {
  db.query("SELECT * FROM artworks WHERE artwork_category = 'Drawing'", (err, result) => {
      if(err){
          console.log(err)
      }else{
          res.send(result)
      }
  })
})
app.get('/paintings', (req, res) => {
  db.query("SELECT * FROM artworks WHERE artwork_category = 'Painting'", (err, result) => {
      if(err){
          console.log(err)
      }else{
          res.send(result)
      }
  })
})
app.get('/historical', (req, res) => {
  db.query("SELECT * FROM artworks WHERE artwork_category = 'Historical'", (err, result) => {
      if(err){
          console.log(err)
      }else{
          res.send(result)
      }
  })
})
app.get('/fineart', (req, res) => {
  db.query("SELECT * FROM artworks WHERE artwork_category = 'Fineart'", (err, result) => {
      if(err){
          console.log(err)
      }else{
          res.send(result)
      }
  })
})
app.listen(3001, () => {
  console.log("running server");
});
