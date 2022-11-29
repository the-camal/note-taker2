const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/notes.html"));
});
app.get("/api/notes", (req, res) => {
  console.log("Execute GET notes request");

  let data = fs.readFileSync("./db/db.json", "utf8");
  res.json(JSON.parse(data));
});
app.post("/api/notes", (req, res) => {
  const newNote = {
    ...req.body,
    id: uuidv4(),
  };
  console.log("post request for new notes");

  let data = fs.readFileSync("./db/db.json", "utf8");

  const dataJSON = JSON.parse(data);

  dataJSON.push(newNote);
  fs.writeFile("./db/db.json", JSON.stringify(dataJSON), (err, text) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("HELLO", text);
  });
  console.log("success, added a new note");
  res.json(data);
});
app.delete("/api/notes/:id", (req, res) => {
  let data = fs.readFileSync("./db/db.json", "utf8");
  const dataJSON = JSON.parse(data);
  const newNotes = dataJSON.filter((note) => {
    return note.id !== req.params.id;
  });
  fs.writeFile("./db/db.json", JSON.stringify(newNotes), (err, text) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  res.json(newNotes);
});
app.listen(PORT, function () {
  console.log("app listening on PORT: " + PORT);
});
