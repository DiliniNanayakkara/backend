require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const path = require("path");

const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    res.send("Need a token. Please give it");
  } else {
    jwt.verify(token, process.env.ACCESS_KEY, (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "You failed authentication" });
      } else {
        req.userId = decoded.email;
        next();
      }
    });
  }
};

const app = express();

//app.use(cors());
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
      expires: 60 * 60 * 24 * 1000,
    },
  })
);

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "PASSWORD",
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

//******************Login for all the users**************//

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/login", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    db.query(
      // "SELECT * FROM user WHERE email = '" + email + "'",
      "SELECT * FROM user WHERE email = ?",
      email,
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }

        if (result.length > 0) {
          bcrypt.compare(password, result[0].password, (error, response) => {
            if (response) {
              const email = result[0].email;
              const token = jwt.sign({ email }, process.env.ACCESS_KEY);

              req.session.user = result;

              res.json({
                auth: true,
                token: token,
                username: result[0].email,
                password: result[0].password,
                role: result[0].user_role,
              });
              //console.log(req.session.user);

              //res.send({ message: "Logged in!" });
            } else {
              //res.send({ message: "Wrong username/password combination!" });
              res.json({
                auth: false,
                message: "Wrong username/password combination!",
              });
            }
          });
        } else {
          //res.send({ message: "User doesn't exist" });
          res.json({ auth: false, message: "User doesn't exist" });
        }
      }
    );
  } catch (err) {
    console.log("Error", err);
  }
});

app.get("/isUserAuth", verifyJWT, (req, res) => {
  res.send("You are authenticated");
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

app.get("/delivery/:id", (req, res) => {
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

const dateObj = new Date();
const month = dateObj.getUTCMonth() + 1; //months from 1-12
const day = dateObj.getUTCDate();
const year = dateObj.getUTCFullYear();

newdate = year + "/" + month + "/" + day;
console.log(newdate);

app.post("/request", (req, res) => {
  const { user } = req.body;
  const { artname } = req.body;
  const status = "pending";
  const { delivery } = req.body;
  const { price } = req.body;
  const { artistemail } = req.body;

  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1; //months from 1-12
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();

  const newdate = year + "/" + month + "/" + day;

  db.query(
    "INSERT INTO request (user, artname, artist, location, status, price, date) VALUES (?,?,?,?,?,?,?)",
    [user, artname, artistemail, delivery, status, price, newdate],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.post("/cartremove", (req, res) => {
  const { cartid } = req.body;
  db.query(`DELETE FROM cart WHERE cart_id = ${cartid} `, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/artworksearch", (req, res) => {
  const search = req.body.search;

  db.query(
    'SELECT * FROM artworks WHERE artwork_artist LIKE "%Sachini%" ',
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/cart/:id", (req, res) => {
  db.query(
    "SELECT * FROM cart WHERE user= '" + req.params.id + "'",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/order/:id", (req, res) => {
  db.query(
    "SELECT * FROM temp_order WHERE user= '" + req.params.id + "'",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/artworkorder/:id", (req, res) => {
  db.query(
    "SELECT * FROM artworkcart WHERE user= '" + req.params.id + "'",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/orderlist/:id", (req, res) => {
  db.query(
    "SELECT * FROM temp_order WHERE user= '" + req.params.id + "'",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/confirmed/:id", (req, res) => {
  db.query(
    "SELECT * FROM request WHERE user= '" +
      req.params.id +
      "' AND status= 'approved' ",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
app.get("/pending/:id", (req, res) => {
  db.query(
    "SELECT * FROM request WHERE user= '" +
      req.params.id +
      "' AND status= 'pending' ",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
app.get("/rejected/:id", (req, res) => {
  db.query(
    "SELECT * FROM request WHERE user= '" +
      req.params.id +
      "' AND status= 'rejected' ",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/addtocart", (req, res) => {
  const { user } = req.body;
  const { toolname } = req.body;
  const { toolcategory } = req.body;
  const { toolprice } = req.body;
  const { toolquantity } = req.body;

  db.query(
    "INSERT INTO cart (user, cart_tool, cart_category, cart_price, cart_quantity) VALUES (?,?,?,?,?)",
    [user, toolname, toolcategory, toolprice, toolquantity],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Added To Cart");
      }
    }
  );
});

app.post("/artworkcart", (req, res) => {
  const { user } = req.body;
  const { art } = req.body;
  const { location } = req.body;
  const { price } = req.body;

  db.query(
    "INSERT INTO artworkcart (user, art_name, art_location, art_price) VALUES (?,?,?,?)",
    [user, art, location, price],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Added To Cart");
      }
    }
  );
});

app.post("/addtoorder", (req, res) => {
  const { user } = req.body;
  const { carttool } = req.body;
  const { cartprice } = req.body;
  const { cartquantity } = req.body;

  db.query(
    "INSERT INTO temp_order (user, tool, price, quantity) VALUES (?,?,?,?)",
    [user, carttool, cartprice, cartquantity],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Added To Cart");
      }
    }
  );

  // db.query(
  //     `DELETE FROM cart WHERE user = '"${user}"' `,
  //     (err, result) => {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         res.send(result);
  //       }
  //     }
  //   );
});

app.post("/removefromcart/:id", (req, res) => {
  const { user } = req.body;
  db.query(
    "DELETE FROM cart WHERE user= '" + req.params.id + "' ",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/quantityupdate", (req, res) => {
  const { tool } = req.body;
  const { quantity } = req.body;

  db.query(
    " UPDATE tools SET tool_quantity = '5' WHERE tool_name = '" + tool + "'",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/ordercomplete", (req, res) => {
  const { user } = req.body;
  db.query(
    "DELETE FROM temp_order WHERE user = '" + user + "' ",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

/*******************************A R T I S T  P R O F I L E ********************************************************************** */
app.get("/Artistdis", (req, res) => {
  db.query(
    "SELECT first_name, last_name, description FROM artist WHERE email ='artist@gmail.com'",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
/******************************************************************************************************************ARTIST PROFILE */
app.get("/pencilearts", (req, res) => {
  db.query(
    "SELECT first_name, last_name, email, contact_no, gig FROM artistgig WHERE email ='artist@gmail.com'",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
/*******************************A R T I S T  P R O F I L E ********************************************************************** */
app.get("/Artistprofile", (req, res) => {
  db.query(
    "SELECT artist_Id, email, first_name, last_name, contact_no, location FROM artist WHERE email ='artist@gmail.com'",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
/******************************************************************************************************************ARTIST PROFILE */
// app.post("/getOrders", (req, res) => {
//   const username = req.body.username;
//   db.query(
//     "SELECT * FROM orders WHERE username = '" + username + "'",
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.send(err);
//       } else {
//         res.send(result);
//       }
//     }
//   );
// });

app.get("/getOrders/:id", (req, res) => {
  db.query(
    "SELECT * FROM request WHERE artist = '" +
      req.params.id +
      "' AND status = 'pending'",
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

// app.post("/approvedOrders", (req, res) => {
//   const buyerId = req.body.buyerId;
//   db.query(
//     "SELECT * FROM orders WHERE artist_approve_status = 1 ",
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.send(err);
//       } else {
//         res.send(result);
//       }
//     }
//   );
// });

// app.post("/statusUpdate", (req, res) => {
//   const order_id = req.body.order_id;
//   db.query(
//     " UPDATE orders SET artist_approve_status = 1 WHERE order_id = '" +
//       order_id +
//       "'",
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.send(err);
//       } else {
//         res.send(result);
//       }
//     }
//   );
// });
app.post("/approvestatusUpdate", (req, res) => {
  const request_id = req.body.request_id;

  db.query(
    " UPDATE request SET status = 'approved' WHERE request_id = '" +
      request_id +
      "'",
    (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
  // const artname = req.body.artname;
  // const location = req.body.location;
  // const price = req.body.price;
  // const requser = req.body.user;
  // const artist = req.body.artist;
  // db.query(
  //   "INSERT INTO approved (request_id, user, artname, artist, location, price) VALUES (?,?,?,?,?,?)",
  // [
  //   requestid,
  //   requser,
  //   artname,
  //   artist,
  //   location,
  //   price,
  // ],
  // (err, result) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.send("Approved");
  //   }
  // }
  // " UPDATE request SET status = 'approved' WHERE request_id = '" +
  //   request_id +
  //   "'",
  // (err, result) => {
  //   if (err) {
  //     console.log(err);
  //     res.send(err);
  //   } else {
  //     res.send(result);
  //   }
  // }
  // );
});

app.post("/rejectstatusUpdate", (req, res) => {
  const request_id = req.body.request_id;
  db.query(
    " UPDATE request SET status = 'rejected' WHERE request_id = '" +
      request_id +
      "'",
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
// app.post("/setCart", (req, res) => {
//   const order_id = req.body.orderId;
//   const buyer_id = req.body.buyerId;
//   db.query(
//     "INSERT INTO cart (order_id, buyer_id) VALUES ('" +
//       order_id +
//       "', '" +
//       buyer_id +
//       "')",
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.send(err);
//       } else {
//         res.send(result);
//       }
//     }
//   );
// });

// app.get("/staff", (req, res) => {
//   db.query(
//     "SELECT email, first_name, last_name, contact_no, user_role, nic FROM staff",
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         res.send(result);
//       }
//     }
//   );
// });

app.get("/Allartist", (req, res) => {
  db.query(
    "SELECT email, first_name, last_name, contact_no, user_role, nic FROM artist",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/ArtistList", (req, res) => {
  db.query("SELECT count(*) count FROM user", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
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
  const { artistdistrict } = req.body;
  const { perkmcharge } = req.body;
  const { artworkDimension } = req.body;
  const { artworkArtistEmail } = req.body;

  if (artistdistrict == "Ampara") {
    db.query(
      "INSERT INTO artwork (artist_email, artwork_image, artwork_name, artwork_description, artwork_dimension, artwork_artist, artist_province, artwork_price, perkm, artwork_category, Colombo, Gampaha, Kalutara, Kandy, Matale, NuwaraEliya, Galle, Hambantota, Matara, Badulla, Moneragala, Kegalle, Rathnapura, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya, Ampara, Batticaloa, Trincomalee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        artworkArtistEmail,
        imagePath,
        artworkName,
        artworkDescription,
        artworkDimension,
        artworkArtist,
        artistdistrict,
        artworkPrice,
        perkmcharge,
        artworkCategory,
        408,
        416,
        366,
        188,
        199,
        189,
        299,
        208,
        271,
        147,
        93,
        249,
        269,
        225,
        310,
        236,
        133,
        407,
        357,
        338,
        318,
        278,
        50,
        102,
        214,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  } else if (artistdistrict == "Anuradhapura") {
    db.query(
      "INSERT INTO artwork (artist_email, artwork_image, artwork_name, artwork_description, artwork_dimension, artwork_artist, artist_province, artwork_price, perkm, artwork_category, Colombo, Gampaha, Kalutara, Kandy, Matale, NuwaraEliya, Galle, Hambantota, Matara, Badulla, Moneragala, Kegalle, Rathnapura, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya, Ampara, Batticaloa, Trincomalee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        artworkArtistEmail,
        imagePath,
        artworkName,
        artworkDescription,
        artworkDimension,
        artworkArtist,
        artistdistrict,
        artworkPrice,
        perkmcharge,
        artworkCategory,
        198,
        171,
        257,
        135,
        110,
        220,
        300,
        413,
        332,
        211,
        233,
        164,
        217,
        108,
        73,
        50,
        103,
        186,
        136,
        118,
        131,
        57,
        235,
        182,
        100,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  } else if (artistdistrict == "Batticaloa") {
    db.query(
      "INSERT INTO artwork (artist_email, artwork_image, artwork_name, artwork_description, artwork_dimension, artwork_artist, artist_province, artwork_price, perkm, artwork_category, Colombo, Gampaha, Kalutara, Kandy, Matale, NuwaraEliya, Galle, Hambantota, Matara, Badulla, Moneragala, Kegalle, Rathnapura, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya, Ampara, Batticaloa, Trincomalee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        artworkArtistEmail,
        imagePath,
        artworkName,
        artworkDescription,
        artworkDimension,
        artworkArtist,
        artistdistrict,
        artworkPrice,
        perkmcharge,
        artworkCategory,
        296,
        266,
        420,
        191,
        183,
        205,
        353,
        263,
        325,
        164,
        154,
        251,
        294,
        197,
        250,
        176,
        78,
        338,
        288,
        278,
        237,
        210,
        101,
        50,
        132,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  } else if (artistdistrict == " Badulla") {
    db.query(
      "INSERT INTO artwork (artist_email, artwork_image, artwork_name, artwork_description, artwork_dimension, artwork_artist, artist_province, artwork_price, perkm, artwork_category, Colombo, Gampaha, Kalutara, Kandy, Matale, NuwaraEliya, Galle, Hambantota, Matara, Badulla, Moneragala, Kegalle, Rathnapura, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya, Ampara, Batticaloa, Trincomalee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        artworkArtistEmail,
        imagePath,
        artworkName,
        artworkDescription,
        artworkDimension,
        artworkArtist,
        artistdistrict,
        artworkPrice,
        perkmcharge,
        artworkCategory,
        328,
        337,
        287,
        115,
        137,
        52,
        220,
        129,
        192,
        50,
        58,
        157,
        131,
        155,
        274,
        213,
        148,
        383,
        333,
        315,
        328,
        254,
        145,
        167,
        265,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  } else if (artistdistrict == "Colombo") {
    db.query(
      "INSERT INTO artwork (artist_email, artwork_image, artwork_name, artwork_description, artwork_dimension, artwork_artist, artist_province, artwork_price, perkm, artwork_category, Colombo, Gampaha, Kalutara, Kandy, Matale, NuwaraEliya, Galle, Hambantota, Matara, Badulla, Moneragala, Kegalle, Rathnapura, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya, Ampara, Batticaloa, Trincomalee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        artworkArtistEmail,
        imagePath,
        artworkName,
        artworkDescription,
        artworkDimension,
        artworkArtist,
        artistdistrict,
        artworkPrice,
        perkmcharge,
        artworkCategory,
        30,
        33,
        81,
        122,
        151,
        171,
        125,
        237,
        157,
        328,
        315,
        82,
        93,
        99,
        133,
        200,
        223,
        384,
        334,
        255,
        329,
        255,
        407,
        306,
        275,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  } else if (artistdistrict == "Galle") {
    db.query(
      "INSERT INTO artwork (artist_email, artwork_image, artwork_name, artwork_description, artwork_dimension, artwork_artist, artist_province, artwork_price, perkm, artwork_category, Colombo, Gampaha, Kalutara, Kandy, Matale, NuwaraEliya, Galle, Hambantota, Matara, Badulla, Moneragala, Kegalle, Rathnapura, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya, Ampara, Batticaloa, Trincomalee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        artworkArtistEmail,
        imagePath,
        artworkName,
        artworkDescription,
        artworkDimension,
        artworkArtist,
        artistdistrict,
        artworkPrice,
        perkmcharge,
        artworkCategory,
        125,
        133,
        83,
        222,
        251,
        253,
        50,
        129,
        52,
        219,
        206,
        183,
        147,
        200,
        253,
        302,
        324,
        486,
        436,
        375,
        431,
        357,
        299,
        354,
        372,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  } else if (artistdistrict == "Gampaha") {
    db.query(
      "INSERT INTO artwork (artist_email, artwork_image, artwork_name, artwork_description, artwork_dimension, artwork_artist, artist_province, artwork_price, perkm, artwork_category, Colombo, Gampaha, Kalutara, Kandy, Matale, NuwaraEliya, Galle, Hambantota, Matara, Badulla, Moneragala, Kegalle, Rathnapura, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya, Ampara, Batticaloa, Trincomalee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        artworkArtistEmail,
        imagePath,
        artworkName,
        artworkDescription,
        artworkDimension,
        artworkArtist,
        artistdistrict,
        artworkPrice,
        perkmcharge,
        artworkCategory,
        34,
        30,
        90,
        90,
        119,
        139,
        134,
        246,
        166,
        337,
        324,
        50,
        75,
        67,
        125,
        172,
        191,
        356,
        306,
        247,
        301,
        227,
        416,
        270,
        239,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  } else if (artistdistrict == "Hambantota") {
    db.query(
      "INSERT INTO artwork (artist_email, artwork_image, artwork_name, artwork_description, artwork_dimension, artwork_artist, artist_province, artwork_price, perkm, artwork_category, Colombo, Gampaha, Kalutara, Kandy, Matale, NuwaraEliya, Galle, Hambantota, Matara, Badulla, Moneragala, Kegalle, Rathnapura, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya, Ampara, Batticaloa, Trincomalee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        artworkArtistEmail,
        imagePath,
        artworkName,
        artworkDescription,
        artworkDimension,
        artworkArtist,
        artistdistrict,
        artworkPrice,
        perkmcharge,
        artworkCategory,
        237,
        245,
        195,
        239,
        261,
        158,
        128,
        50,
        100,
        125,
        111,
        194,
        126,
        312,
        365,
        414,
        267,
        511,
        461,
        487,
        456,
        382,
        204,
        259,
        371,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  } else if (artistdistrict == "Jaffna") {
    db.query(
      "INSERT INTO artwork (artist_email, artwork_image, artwork_name, artwork_description, artwork_dimension, artwork_artist, artist_province, artwork_price, perkm, artwork_category, Colombo, Gampaha, Kalutara, Kandy, Matale, NuwaraEliya, Galle, Hambantota, Matara, Badulla, Moneragala, Kegalle, Rathnapura, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya, Ampara, Batticaloa, Trincomalee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        artworkArtistEmail,
        imagePath,
        artworkName,
        artworkDescription,
        artworkDimension,
        artworkArtist,
        artistdistrict,
        artworkPrice,
        perkmcharge,
        artworkCategory,
        380,
        353,
        439,
        303,
        279,
        379,
        483,
        511,
        514,
        380,
        402,
        342,
        400,
        288,
        255,
        184,
        272,
        50,
        55,
        123,
        98,
        127,
        419,
        338,
        214,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  } else if (artistdistrict == "Kalutara") {
    db.query(
      "INSERT INTO artwork (artist_email, artwork_image, artwork_name, artwork_description, artwork_dimension, artwork_artist, artist_province, artwork_price, perkm, artwork_category, Colombo, Gampaha, Kalutara, Kandy, Matale, NuwaraEliya, Galle, Hambantota, Matara, Badulla, Moneragala, Kegalle, Rathnapura, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya, Ampara, Batticaloa, Trincomalee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        artworkArtistEmail,
        imagePath,
        artworkName,
        artworkDescription,
        artworkDimension,
        artworkArtist,
        artistdistrict,
        artworkPrice,
        perkmcharge,
        artworkCategory,
        81,
        89,
        50,
        178,
        207,
        185,
        83,
        195,
        114,
        285,
        272,
        106,
        75,
        156,
        209,
        258,
        280,
        442,
        392,
        331,
        387,
        313,
        365,
        420,
        328,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  } else if (artistdistrict == "Kandy") {
    db.query(
      "INSERT INTO artwork (artist_email, artwork_image, artwork_name, artwork_description, artwork_dimension, artwork_artist, artist_province, artwork_price, perkm, artwork_category, Colombo, Gampaha, Kalutara, Kandy, Matale, NuwaraEliya, Galle, Hambantota, Matara, Badulla, Moneragala, Kegalle, Rathnapura, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya, Ampara, Batticaloa, Trincomalee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        artworkArtistEmail,
        imagePath,
        artworkName,
        artworkDescription,
        artworkDimension,
        artworkArtist,
        artistdistrict,
        artworkPrice,
        perkmcharge,
        artworkCategory,
        121,
        91,
        146,
        30,
        35,
        76,
        221,
        243,
        253,
        72,
        152,
        62,
        120,
        42,
        126,
        135,
        134,
        306,
        256,
        237,
        251,
        177,
        189,
        210,
        188,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  }
  if (artistdistrict == "Kegalle") {
    db.query(
      "INSERT INTO artwork (artist_email, artwork_image, artwork_name, artwork_description, artwork_dimension, artwork_artist, artist_province, artwork_price, perkm, artwork_category, Colombo, Gampaha, Kalutara, Kandy, Matale, NuwaraEliya, Galle, Hambantota, Matara, Badulla, Moneragala, Kegalle, Rathnapura, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya, Ampara, Batticaloa, Trincomalee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        artworkArtistEmail,
        imagePath,
        artworkName,
        artworkDescription,
        artworkDimension,
        artworkArtist,
        artistdistrict,
        artworkPrice,
        perkmcharge,
        artworkCategory,
        82,
        53,
        91,
        63,
        85,
        106,
        174,
        191,
        206,
        194,
        240,
        50,
        65,
        54,
        140,
        164,
        178,
        348,
        298,
        280,
        293,
        219,
        252,
        257,
        226,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  }
  if (artistdistrict == "Kilinochchi") {
    db.query(
      "INSERT INTO artwork (artist_email, artwork_image, artwork_name, artwork_description, artwork_dimension, artwork_artist, artist_province, artwork_price, perkm, artwork_category, Colombo, Gampaha, Kalutara, Kandy, Matale, NuwaraEliya, Galle, Hambantota, Matara, Badulla, Moneragala, Kegalle, Rathnapura, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya, Ampara, Batticaloa, Trincomalee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        artworkArtistEmail,
        imagePath,
        artworkName,
        artworkDescription,
        artworkDimension,
        artworkArtist,
        artistdistrict,
        artworkPrice,
        perkmcharge,
        artworkCategory,
        332,
        305,
        391,
        256,
        231,
        331,
        435,
        463,
        466,
        332,
        354,
        294,
        351,
        240,
        207,
        136,
        224,
        57,
        50,
        124,
        62,
        79,
        371,
        290,
        166,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  }
  if (artistdistrict == "Kurunegala") {
    db.query(
      "INSERT INTO artwork (artist_email, artwork_image, artwork_name, artwork_description, artwork_dimension, artwork_artist, artist_province, artwork_price, perkm, artwork_category, Colombo, Gampaha, Kalutara, Kandy, Matale, NuwaraEliya, Galle, Hambantota, Matara, Badulla, Moneragala, Kegalle, Rathnapura, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya, Ampara, Batticaloa, Trincomalee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        artworkArtistEmail,
        imagePath,
        artworkName,
        artworkDescription,
        artworkDimension,
        artworkArtist,
        artistdistrict,
        artworkPrice,
        perkmcharge,
        artworkCategory,
        99,
        69,
        156,
        42,
        52,
        112,
        200,
        312,
        231,
        155,
        193,
        54,
        112,
        40,
        85,
        109,
        124,
        290,
        240,
        222,
        235,
        161,
        242,
        203,
        172,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  }
  if (artistdistrict == "Matale") {
    db.query(
      "INSERT INTO artwork (artist_email, artwork_image, artwork_name, artwork_description, artwork_dimension, artwork_artist, artist_province, artwork_price, perkm, artwork_category, Colombo, Gampaha, Kalutara, Kandy, Matale, NuwaraEliya, Galle, Hambantota, Matara, Badulla, Moneragala, Kegalle, Rathnapura, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya, Ampara, Batticaloa, Trincomalee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        artworkArtistEmail,
        imagePath,
        artworkName,
        artworkDescription,
        artworkDimension,
        artworkArtist,
        artistdistrict,
        artworkPrice,
        perkmcharge,
        artworkCategory,
        154,
        120,
        206,
        35,
        30,
        99,
        250,
        300,
        281,
        137,
        191,
        85,
        143,
        50,
        135,
        111,
        110,
        281,
        231,
        213,
        227,
        152,
        215,
        189,
        163,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  } else if (artistdistrict == "Mannar") {
    db.query(
      "INSERT INTO artwork (artist_email, artwork_image, artwork_name, artwork_description, artwork_dimension, artwork_artist, artist_province, artwork_price, perkm, artwork_category, Colombo, Gampaha, Kalutara, Kandy, Matale, NuwaraEliya, Galle, Hambantota, Matara, Badulla, Moneragala, Kegalle, Rathnapura, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya, Ampara, Batticaloa, Trincomalee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        artworkArtistEmail,
        imagePath,
        artworkName,
        artworkDescription,
        artworkDimension,
        artworkArtist,
        artistdistrict,
        artworkPrice,
        perkmcharge,
        artworkCategory,
        267,
        287,
        343,
        237,
        213,
        313,
        387,
        499,
        419,
        314,
        336,
        280,
        333,
        222,
        136,
        118,
        205,
        112,
        112,
        50,
        137,
        79,
        338,
        284,
        167,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  } else if (artistdistrict == "Matara") {
    db.query(
      "INSERT INTO artwork (artist_email, artwork_image, artwork_name, artwork_description, artwork_dimension, artwork_artist, artist_province, artwork_price, perkm, artwork_category, Colombo, Gampaha, Kalutara, Kandy, Matale, NuwaraEliya, Galle, Hambantota, Matara, Badulla, Moneragala, Kegalle, Rathnapura, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya, Ampara, Batticaloa, Trincomalee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        artworkArtistEmail,
        imagePath,
        artworkName,
        artworkDescription,
        artworkDimension,
        artworkArtist,
        artistdistrict,
        artworkPrice,
        perkmcharge,
        artworkCategory,
        153,
        162,
        112,
        251,
        280,
        222,
        44,
        98,
        40,
        188,
        175,
        211,
        175,
        228,
        281,
        331,
        331,
        515,
        465,
        403,
        460,
        386,
        268,
        323,
        400,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  } else if (artistdistrict == "Moneragala") {
    db.query(
      "INSERT INTO artwork (artist_email, artwork_image, artwork_name, artwork_description, artwork_dimension, artwork_artist, artist_province, artwork_price, perkm, artwork_category, Colombo, Gampaha, Kalutara, Kandy, Matale, NuwaraEliya, Galle, Hambantota, Matara, Badulla, Moneragala, Kegalle, Rathnapura, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya, Ampara, Batticaloa, Trincomalee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        artworkArtistEmail,
        imagePath,
        artworkName,
        artworkDescription,
        artworkDimension,
        artworkArtist,
        artistdistrict,
        artworkPrice,
        perkmcharge,
        artworkCategory,
        314,
        323,
        273,
        154,
        165,
        116,
        205,
        106,
        177,
        58,
        50,
        216,
        175,
        195,
        297,
        236,
        161,
        406,
        356,
        338,
        351,
        277,
        92,
        154,
        266,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  } else if (artistdistrict == "Mullaitivu") {
    db.query(
      "INSERT INTO artwork (artist_email, artwork_image, artwork_name, artwork_description, artwork_dimension, artwork_artist, artist_province, artwork_price, perkm, artwork_category, Colombo, Gampaha, Kalutara, Kandy, Matale, NuwaraEliya, Galle, Hambantota, Matara, Badulla, Moneragala, Kegalle, Rathnapura, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya, Ampara, Batticaloa, Trincomalee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        artworkArtistEmail,
        imagePath,
        artworkName,
        artworkDescription,
        artworkDimension,
        artworkArtist,
        artistdistrict,
        artworkPrice,
        perkmcharge,
        artworkCategory,
        328,
        300,
        386,
        251,
        227,
        326,
        430,
        458,
        462,
        327,
        349,
        293,
        346,
        235,
        202,
        131,
        219,
        130,
        80,
        147,
        50,
        74,
        352,
        242,
        161,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  }
});

//*********************Moderator Function***************//
app.post("/sendComplain", (req, res) => {
  const email = req.body.values.email;
  const firstname = req.body.values.firstname;
  const lastname = req.body.values.lastname;
  const phone = req.body.values.phone;
  const role = req.body.values.role;
  const complain = req.body.values.complain;

  db.query(
    "INSERT INTO complain (email, first_name, last_name, contact_no,  user_role , complain) VALUES (?,?,?,?,?,?,?,?)",
    [email, firstname, lastname, phone, role, complain],
    (err, result) => {
      console.log(err);
    }
  );
});

app.listen(5000, () => {
  console.log("Running Server on Port 5000");
});
