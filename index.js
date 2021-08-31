const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );
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
  password: "",
  database: "delart",
});

app.use("/public", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
const multer = require("multer");

const multerConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("Only images are allowed.."));
  }
};

const upload = multer({
  storage: multerConfig,
  fileFilter: isImage,
});

app.post("/upload", upload.single("photo"), (req, res) => {
  // console.log(req.file);
  const imagePath = "public/" + req.file.filename;
  // console.log(imagePath);
  const { artworkName } = req.body;
  const { artworkDescription } = req.body;
  const { artworkArtist } = req.body;
  const { artworkPrice } = req.body;
  const { artworkCategory } = req.body;
  // console.log(artworkName);
  db.query(
    "INSERT INTO artwork (artwork_image, artwork_name, artwork_description, artwork_artist, artwork_price, artwork_category) VALUES (?,?,?,?,?,?)",
    [
      imagePath,
      artworkName,
      artworkDescription,
      artworkArtist,
      artworkPrice,
      artworkCategory,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});
/*
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
*/
/*
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
*/

//***********Artist registration ************/

app.post("/register", (req, res) => {
  const email = req.body.values.email;
  const password = req.body.values.password;
  const nic = req.body.values.nic;
  const firstName = req.body.values.firstname;
  const lastName = req.body.values.lastname;
  const phone = req.body.values.phone;
  //const profile = req.body.values.profile;
  const description = req.body.values.description;
  const location = req.body.values.location;
  //const userRole = req.body.values.userRole;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    db.query(
      "INSERT INTO user (email, password, user_role) VALUES (?,?,'artist')",
      [email, hash],
      (err, result) => {
        console.log("---" + err);
      }
    );

    db.query(
      "INSERT INTO artist (email, password, nic, first_name, last_name, contact_no, description, location) VALUES (?,?,?,?,?,?,?,?)",
      [
        email,
        hash,
        nic,
        firstName,
        lastName,
        phone,
        //profile,
        description,
        location,
        //userRole,
      ],
      (err, result) => {
        console.log(err);
      }
    );
  });
});

//**********Customer registration ************/

app.post("/register2", (req, res) => {
  const email = req.body.values.email;
  const password = req.body.values.password;
  const nic = req.body.values.nic;
  const firstname = req.body.values.firstname;
  const lastname = req.body.values.lastname;
  const phone = req.body.values.phone;
  const profile = req.body.values.profile;
  const location = req.body.values.location;

  /*email,
      password,
      nic,
      firstName,
      lastName,
      phone,
      //profile,
      description,
      location,
      //userRole,*/

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    db.query(
      "INSERT INTO customer (email, password, nic, first_name, last_name, contact_no, profile, address) VALUES (?,?,?,?,?,?,?,?)",
      [email, hash, nic, firstname, lastname, phone, profile, location],
      (err, result) => {
        console.log(err);
      }
    );

    db.query(
      "INSERT INTO user (email, password,  user_role) VALUES (?,?,'customer')",
      [email, hash],
      (err, result) => {
        console.log(err);
      }
    );
  });
});

//**********Staff registration ***************/

app.post("/register3", (req, res) => {
  const email = req.body.values.email;
  const password = req.body.values.password;
  const firstname = req.body.values.firstname;
  const lastname = req.body.values.lastname;
  const phone = req.body.values.phone;
  const profile = req.body.values.profile;
  const role = req.body.values.role;
  const nic = req.body.values.nic;

  /*email,
      password,
      nic,
      firstName,
      lastName,
      phone,
      //profile,
      description,
      location,
      //userRole,*/

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    db.query(
      "INSERT INTO staff (email, password, first_name, last_name, contact_no, profile, user_role , nic) VALUES (?,?,?,?,?,?,?,?)",
      [email, hash, firstname, lastname, phone, profile, role, nic],
      (err, result) => {
        console.log(err);
      }
    );

    db.query(
      "INSERT INTO user (email, password,  user_role) VALUES (?,?,?)",
      [email, hash, role],
      (err, result) => {
        console.log(err);
      }
    );
  });
});

app.post("/create", (req, res) => {
  const artworkName = req.body.artworkName;
  const artworkDescription = req.body.artworkDescription;
  const artworkUpload = req.body.artworkUpload;
  const artworkPrice = req.body.artworkPrice;
  const artworkCategory = req.body.artworkCategory;
  const artworkQuantity = req.body.artworkQuantity;

  db.query(
    "INSERT INTO artworks (artwork_name, artwork_description, artwork_image, artwork_price, artwork_category, artwork_quantity) VALUES (?,?,?,?,?,?)",
    [
      artworkName,
      artworkDescription,
      artworkUpload,
      artworkPrice,
      artworkCategory,
      artworkQuantity,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});
app.get("/artworks", (req, res) => {
  db.query("SELECT * FROM artwork", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/artworkdetail/:id", (req, res) => {
  db.query(
    `SELECT * FROM artwork WHERE artwork_id= ${req.params.id} `,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/productdetail/:id", (req, res) => {
  db.query(
    `SELECT * FROM tools WHERE tool_id= ${req.params.id} `,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/products", (req, res) => {
  db.query("SELECT * FROM tools", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
app.get("/brushes", (req, res) => {
  db.query(
    "SELECT * FROM tools WHERE tool_category = 'Brushes'",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
app.get("/canvas", (req, res) => {
  db.query(
    "SELECT * FROM tools WHERE tool_category = 'Art Boards & Canvas'",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
app.get("/supplies", (req, res) => {
  db.query(
    "SELECT * FROM tools WHERE tool_category = 'Painting Supplies'",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
app.get("/easels", (req, res) => {
  db.query(
    "SELECT * FROM tools WHERE tool_category = 'Easels'",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
app.get("/drawings", (req, res) => {
  db.query(
    "SELECT * FROM artwork WHERE artwork_category = 'Drawing'",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
app.get("/paintings", (req, res) => {
  db.query(
    "SELECT * FROM artwork WHERE artwork_category = 'Painting'",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
app.get("/historical", (req, res) => {
  db.query(
    "SELECT * FROM artwork WHERE artwork_category = 'Historical'",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
app.get("/fineart", (req, res) => {
  db.query(
    "SELECT * FROM artwork WHERE artwork_category = 'Fine Art'",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/getOrders", (req, res) => {
  const artist_id = req.body.artist_id;
  db.query(
    "SELECT * FROM orders WHERE artist_id = '" + artist_id + "'",
    (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.listen(5000, () => {
  console.log("Running Server on Port 5000");
});
