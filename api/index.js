const express = require("express");
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const serviceAccount = require("./serviceKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// apis for users
app.post("/users", async (req, res) => {
  // add new user
  await db.collection("users").add(req.body);
  console.log("Added user with the follwing details: ", req.body);
});

app.put("/users/:username", (req, res) => {
  //update user details
});

app.delete("/users/:username", (req, res) => {
  // delete user details
});
