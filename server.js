const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));


const db = new sqlite3.Database("./database.sqlite");


// テーブル作成
db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `);


    db.run(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            content TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

});


// ユーザー登録
app.post("/api/register", (req,res)=>{

    const {username,password}=req.body;


    db.run(
        "INSERT INTO users(username,password) VALUES(?,?)",
        [username,password],
        function(err){

            if(err){
                return res.status(400).json({
                    error:"ユーザー登録失敗"
                });
            }


            res.json({
                message:"登録成功"
            });

        }
    );

});


// ログイン
app.post("/api/login",(req,res)=>{

    const {username,password}=req.body;


    db.get(
        "SELECT * FROM users WHERE username=? AND password=?",
        [username,password],
        (err,user)=>{

            if(user){

                res.json({
                    success:true,
                    username:user.username
                });

            }else{

                res.json({
                    success:false
                });

            }

        }
    );

});



// 投稿
app.post("/api/posts",(req,res)=>{

    const {username,content}=req.body;


    db.run(
        "INSERT INTO posts(username,content) VALUES(?,?)",
        [username,content],
        ()=>{
            res.json({
                message:"投稿しました"
            });
        }
    );

});



// 投稿一覧
app.get("/api/posts", (req, res) => {

    db.all(
        `
        SELECT
            posts.id,
            users.username,
            posts.content,
            posts.created_at
        FROM posts
        INNER JOIN users
            ON posts.user_id = users.id
        ORDER BY posts.id DESC
        `,
        [],
        (err, rows) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    error: "投稿取得に失敗しました"
                });

            }

            res.json(rows);

        }
    );

});



app.listen(3000,()=>{

    console.log(
        "Mini SNS running on http://localhost:3000"
    );

});
