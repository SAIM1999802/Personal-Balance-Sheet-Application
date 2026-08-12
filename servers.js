require('dotenv').config()
const express = require('express')
const mysql = require('mysql2')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname,'public')))

const JWT_SECRET = process.env.JWT_SECRET

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true 
})

const db = pool.promise()

const authenticateToken = (req,res,next) =>{
    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split(' ')[1];
    if (!token) {return res.status(401).json({message:"Token is missing"})};

    jwt.verify(token,JWT_SECRET,(err,user)=>{
        if(err){return res.status(401).json({message:"Invalid or expired token"})};
        req.user = user;
        next();
    });
};

app.post('/api/auth/signup', async(req, res)=>{
    const{user_name,email,password} = req.body;
    try{
        const [existing] = await db.query('SELECT * FROM users WHERE user_name =? ',[user_name])
        if(existing.length > 0 ){
            return res.status(400).json({success:false ,message:"Username already registered!!"})
        }

        const hashpass = await bcrypt.hash(password,10) 
        const [result]= await db.query('INSERT INTO users (user_name,email,password)  VALUES (?,?,?)' ,[user_name,email,hashpass])
        return res.json({success:true ,message:"User registered Successfully!!"})
    }catch(error){
        return res.status(500).json({success:false,message: error.message})
    }
})

app.post('/api/auth/signin', async(req,res)=>{
    const {user_name,password} = req.body

    try{
        const [users] = await db.query('SELECT * FROM users WHERE user_name = ?',[user_name])
        if(users.length === 0){
            return res.status(400).json({success:false,message:"User not found!!"})
        } 
        const user = users[0]
        const validPass = await bcrypt.compare(password, user.password)
        if(!validPass){
            return res.json({success:false,message:"Invalid Credentials"})
        }
        const token = jwt.sign({id:user.id,email:user.email,user_name:user.user_name},JWT_SECRET,{expiresIn:'1d'})
        return res.json({success:true,token,user:{user_name:user.user_name,email:user.email }})
    }catch(err){
        return res.status(500).json({success:false, message: err.message})
    }
});

app.get('/transactions', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM transactions WHERE user_id = ? ORDER BY id ASC", 
            [req.user.id]
        );
        res.json(rows);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

app.post('/transactions', authenticateToken,async (req,res) =>{
    const {desc,val,bal,type} = req.body
    try{
        await db.query('INSERT INTO transactions (user_id,descriptions,amount,balance,typess) VALUES (?,?,?,?,?)',
        [req.user.id,desc,val,bal,type])
        return res.json({success:true, message:"Transaction added Successfully"})
    }catch(err){res.status(500).json({success:false, message: err.message})}
});

app.delete('/transactions', authenticateToken,async (req,res)=>{
    try{
        await db.query('DELETE FROM transactions WHERE user_id = ?',[req.user.id])
        return res.json({success:true, message:"Transaction Cleared Successfully"})
    }catch(err){res.status(500).json({success:false, message: err.message})}
});

const PORT = process.env.PORT

app.listen(PORT,()=>console.log(`Server is running on http://localhost:${PORT}`));