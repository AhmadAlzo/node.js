const express = require('express')
const app = express()
const port = 3000
app.use(express.json())


const mysql = require("mysql2");

var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "test1"
});

app.post("/",(req,res)=>{
  value =  Object.values(req.body)
  pool.query("SELECT * FROM user WHERE id = ?",value , (err,ree)=>{
    
    if(err){
        res.send(err)
    }
    else{
        res.json(ree)
        // return
    }
  })
})


class ClassSql {
  constructor(dictall) {
      if(dictall.select){
          this.tableselect = Object.keys(dictall.select)
          for(let i = 0; i < this.tableselect.length; i++){
            for(let j =0 ; j < dictall.select[this.tableselect[i]].length ; j++){
              app.post("/"+this.tableselect[i]+"/"+dictall.select[this.tableselect[i]][j].link,(req,res)=>{     
                pool.query("SELECT "+dictall.select[this.tableselect[i]][j].columns.join(",")+" FROM "+this.tableselect[i]+" "+ dictall.select[this.tableselect[i]][j].operation,Object.values(req.body) , (err,ree)=>{
    
                  if(err){
                      res.send(err)
                  }
                  else{
                      res.json(ree)
                  }
                })
              })
            }
          }
      }
      if(dictall.insert){
          for(let i = 0; i<dictall.insert.length; i++){
              app.post("/"+dictall.insert[i]+"/insert",(req,res)=>{
                  pool.query("INSERT INTO "+dictall.insert[i]+" ("+Object.keys(req.body).join(",")+") VALUES (+"+Object.keys(req.body).map(_ele=>"?")+");" , Object.values(req.body), (err,ree)=>{
                      if(err){
                          res.send(err)
                      }
                      else{
                          res.json(ree)
                      }
                  })
              })
          }
      }
      if(dictall.update){
        this.tableupd = Object.keys(dictall.update)            
        for(let i = 0; i < this.tableupd.length; i++){      
          for(let j =0 ; j < dictall.update[this.tableupd[i]].length ; j++){  
            app.post("/"+this.tableupd[i]+"/"+dictall.update[this.tableupd[i]][j].link,(req,res)=>{   
              pool.query("UPDATE " + this.tableupd[i] + " SET " +dictall.update[this.tableupd[i]][j].columns.join("=?,")+"= ? " +dictall.update[this.tableupd[i]][j].operation,Object.values(req.body), (err,ree)=>{
  
                if(err){
                    res.send(err)
                }
                else{
                    res.send(ree)
                }
              })
            })
          }
        }
      }
      if(dictall.delete){
          this.tabledel = Object.keys(dictall.delete)
          for(let i = 0; i<this.tabledel.length; i++){
              app.post("/"+this.tabledel[i]+"/delete",(req,res)=>{
                  pool.query("DELETE FROM "+this.tabledel[i] + " " + dictall.delete[this.tabledel[i]], Object.values(req.body) , (err,ree)=>{
                      if(err){
                          res.send(err)
                      }
                      else{
                          res.json(ree)
                      }
                  })
              })
          }
      }
  }
}


add = new ClassSql({
  select:{
      "user":[
        {
          columns:["*"],
          operation:"WHERE id = ? ",
          link:"getnamebyid"
        },
        {
          columns:["password"],
          operation:"WHERE id = ? AND name = ?",
          link:"getpassbyid"
        }
      ],
      "teacher":[
        {
          columns:["name","email"],
          operation:"WHERE id = ?",
          link:"getbyid"
        }
      ]
  },
  insert:["user","teacher"],
  update:{
    "user":[
      {
        columns:["name"],
        operation:"WHERE id = ? ",
        link:"updname"
      },
      {
        columns:["password"],
        operation:"WHERE id = ? AND name = ?",
        link:"updpass"
      }
    ],
    "teacher":[
      {
        columns:["name","email"],
        operation:"WHERE id = ?",
        link:"updname"
      }
    ]
  },
  delete:{
      "user":"WHERE id = ?"
  }
})







app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

