import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;
const {Pool} = pg
let order = "id";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const db = new Pool({
connectionString:"postgres://tushar:WprKew1wlwtcZO8xg63triUcbMR7ry0z@dpg-cmknoo8l5elc738on76g-a.singapore-postgres.render.com/tushardb",
ssl:{
rejectUnauthorized : false
}

})

db.connect();

app.get("/", async (req, res) => {
  const result = await db.query(`SELECT * FROM booknote ORDER BY ${order} ASC`);
  res.render("index.ejs", { result: result.rows, order: order });
});

app.get("/add/:id", async (req, res) => {
  try {
    const result = await axios.get(
      `https://openlibrary.org/isbn/${req.params.id}.json`
    );
    let data = result.data;
    res.render("add.ejs", { title: data.title, isbn: req.params.id });
  } catch (error) {
    res.status(500).send("Failed to fetch activity. please try again.");
  }
});

app.post("/order", function (req, res) {
  order = req.body.order;
  res.redirect("/");
});

app.post("/Submit", async (req, res) => {
  let { title, description, ISBN, rating } = req.body;
  if (rating > 5) {
    rating = 5;
  } else if (rating < 0) {
    rating = 0;
  }
  await db.query(
    " INSERT INTO booknote(title, description, isbn, rating ) VALUES  ($1,$2,$3,$4) ",
    [title, description, ISBN, rating]
  );
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  let { title, description, rating, id } = req.body;

  await db.query(
    "UPDATE booknote SET title = $1, description = $2, rating = $3 WHERE id = $4",
    [title, description, rating, id]
  );
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  req.body.isbn;
  await db.query("DELETE FROM booknote WHERE isbn = $1", [req.body.isbn]);
  res.redirect("/");
});

app.get("/*", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
