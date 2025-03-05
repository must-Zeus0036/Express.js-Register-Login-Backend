import express from "express"
import bcrypt from "bcrypt"

const app = express()
const port = 3000;

app.use(express.json()) //middleware

// array in memory becuse I will later using database to save user information and password
const users = [];


app.post('/register', (req, res) => {
    const {email, password } = req.body;

    //Check if email already exists
    if (users.find(user => user.email === email)){
        return res.status(400).send('Email already registered');
    }
    // Add the new user
    users.push({email, password});
    res.status(200).send('User registered successfully');
})
/*app.post("/register", async (req, res) => {
    try {
        const {email, password} = req.body
        //Check the user if exists
        const findUser = users.find((data) => email == data.email )
        if(findUser){
            return res.status(400).send("Username or password already exists!")
        }
        //Hash password
        const hashPassword = await bcrypt.hash(password, 10);
        users.push({email, password: hashPassword});
        console.log(users)
        res.status(200).send("Registered successfully");

    } catch (err) {
        res.status(500).send({message: err.message})
        
    }
})*/

//login function
app.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;
        //Check the user if exists
        const findUser = users.find((data) => email == data.email )
        if(!findUser){
            return res.status(400).send("Username or password already exists!")
        } else {
        const newUser = new User({ email, password });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
        }
        

        const passwordMatch = await bcrypt.compare(password, findUser.password);
        if(passwordMatch){
            res.status(201).send("Login successfully")
        } else {
            res.status(400).send("wrong email or password!");
        }
    } catch (err) {
        res.status(500).send({message: err.message});
        
    }
});

app.listen(port, () => {
    console.log('Server is started on port ${port}')
})