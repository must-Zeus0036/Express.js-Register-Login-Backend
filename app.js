import express from "express";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;

app.use(express.json());

const users = [];

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const findUser = users.find((data) => email === data.email);
    if (findUser) {
      return res.status(400).send("Email already exists!");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashPassword });
    console.log(users);
    res.status(200).send("Registered successfully");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const findUser = users.find((data) => email === data.email);
    if (!findUser) {
      return res.status(400).send("Invalid email or password!");
    }

    const passwordMatch = await bcrypt.compare(password, findUser.password);
    if (passwordMatch) {
      res.status(200).send("Login successful");
    } else {
      res.status(400).send("Invalid email or password!");
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.delete('/users/:email', (req, res) => {
    const{email} = req.params;

    const userIndex = users.findIndex((user) => user.email === email);
    if(userIndex === -1){
        return res.status(404).send("User not found");

    }
    users.splice(userIndex, 1); // Remove the user from the array
  res.status(200).send("User deleted successfully");
  console.log(users);
});

app.get('/users', (req, res) => {
    res.send(users);
});

app.listen(port, () => {
  console.log(`Server is started on port ${port}`);
});