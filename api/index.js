const express = require("express");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} = require("firebase/firestore");

const cors = require("cors");
const {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  deleteUser,
} = require("firebase/auth");

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

const app = express();
app.use(express.json());
app.use(cors());
const port = 3050;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// apis for users
app.post("/users", async (req, res) => {
  // add new user
  const userId = req.body.email;
  const email = req.body.email;
  const password = req.body.password;

  const auth = getAuth(firebaseApp);
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("Added user with the follwing details: ", req.body);
      res.status(201).json({ data: { id: userId, ...req.body, ...user } });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(
        "An error occured whiles creating user",
        errorCode,
        errorMessage
      );
      res.status(500).send({ error: errorMessage });
    });
});

app.post("/login", (req, res) => {
  const auth = getAuth(firebaseApp);
  signInWithEmailAndPassword(auth, req.body.email, req.body.password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      res.status(200).json({ data: user });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      res.status(errorCode).json({ error: errorMessage });
    });
});

app.delete("/users/:username", async (req, res) => {
  // delete user details
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = req.params.username;
  deleteUser(user)
    .then(() => {
      console.log(`Deleted user with ID: ${userId}`);
      res.status(204).send();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`Failed to delete user wit ID: ${userId}`);
      res.status(errorCode).json({ error: errorMessage });
    });
});

// apis for products
app.post("/products", async (req, res) => {
  // add new product
  const product = await addDoc(collection(db, "products"), {
    ...req.body,
  });

  console.log("Added product with the follwing details: ", {
    id: product.id,
    ...req.body,
  });
  res.status(201).json({ data: { id: product.id, ...req.body } });
});

app.get("/products", async (req, res) => {
  const products = [];
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((product) => {
    // console.log(product.id, "=>", product.data());
    products.push({ id: product.id, ...product.data() });
  });
  res.status(200).json({ data: products });
});

app.put("/products/:id", async (req, res) => {
  // update product details
  const productId = req.params.id;
  const productRef = doc(db, "products", productId);
  await updateDoc(productRef, { ...req.body });
  console.log(`Updated product ${productId} with data: ${req.body}`);
  res.status(200).json({ data: { id: productId, ...req.body } });
});

app.delete("/products/:id", async (req, res) => {
  // delete product details
  const productId = req.params.id;
  await deleteDoc(doc(db, "products", productId));
  console.log(`Deleted product with ID: ${productId}`);
  res.status(204).send();
});
