import bcrypt from "bcrypt";
import express from "express";
import mariadb from 'mariadb';


const app = express();
const port = 3000;

//Database connection pool
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password:'0000',
  database: 'Mariadb',
  connectionLimit: 10

})

app.use(express.json());

//const users = [];


app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM users WHERE email =?', [email]);
    
    if(rows.length >0){
      conn.end();
      return res.status(400).send('Email already exists!');
    }

    const hashPassword = await bcrypt.hash(password, 10);
        await conn.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashPassword]);
        conn.end();

        res.status(200).send("Registered successfully");
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});



app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
    conn.end();

    if(rows.length ===0){
      return res.status(400).send('Invalid email or password');
    }

    const findUser = rows[0]; // Get the first user from the result
    const passwordMatch = await bcrypt.compare(password, findUser.password);

    if (passwordMatch) {
      res.status(200).send("Login successful");
    } else {
      res.status(400).send("Invalid email or password!");
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


app.delete('/users/:id', async (req, res) => {
  try {
      const userId = req.params.id;
      const conn = await pool.getConnection();
      const result = await conn.query('DELETE FROM users WHERE id = ?', [userId]);
      conn.end();

      if (result.affectedRows === 0) {
          return res.status(404).send('User not found');
      }

      res.status(200).send('User deleted successfully');
  } catch (error) {
      res.status(500).send({ message: error.message });
  }
});

app.get('/users',async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM users');
    conn.end();
    res.send(rows);
    
  } catch (error) {
    res.status(500).send({message: error.message});
    
  }
    
});


app.listen(port, () => {
  console.log(`Server is started on port ${port}`);
});