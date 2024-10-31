const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 3000;
const hdb = require("express-handlebars");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));

const route = require("./routes");
const db = require("./config/db");

// app.use(BacBaoVe)
// function BacBaoVe(req, res, next){
//     if(['vethuong','vevip'].includes(req.query.ve)){
//         req.face = 'gach gach gach'
//         return next()
//     }
//     res.status(403).json({
//         message: "Access denied"
//     })
// }

// app.get('/middleware',
//     function(req, res, next){
//         if(['vethuong','vevip'].includes(req.query.ve)){
//             req.face = 'gach gach gach'
//             return next()
//         }
//         res.status(403).json({
//             message: "Access denied"
//         })
//     },
//     function(req, res, next){
//         res.json({
//             message: 'Successfully',
//             face: req.face
//         })
//     }
// )

//database connnect
db.connect();

// Template Engine
app.engine("hbs", hdb.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resoureces/views"));

// HTTP Logger
app.use(morgan("combined"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

//router init
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
// Bản mới nhất mà vẫn chạy được, mời các bạn tham khảo
