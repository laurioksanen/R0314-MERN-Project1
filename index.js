//tuodaan moduleita
const { json } = require("body-parser");
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

//alustellaan
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

//staattinen sisältö siitä
app.use(express.static("./"));

//määritellään etusivu
app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/index.html")
});

//guestbook sivu joka repii tiedot lokaalista jsontiedostosta ja asettelee ne nätisti
app.get("/guestbook",(req,res)=>{
    var jsondata = require("./guestjson.json");
    var boots = "<link rel="+'stylesheet'+" href=https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css></link>"
    var content ="<body class='bg-dark'>" +boots+"<h1 class='text-light text-center'>Guest Messages</h1><br><table class='table table-bordered table-warning table-striped'><thead class=\"thead-dark\"><tr><th>#</th><th>Name</th><th>Country</th><th>Message</th><th>Date</th></tr></thead><tbody>";
    for(i=0;i<jsondata.length;i++) {
        content+="<tr><td>"+jsondata[i].id+"</td><td>"+jsondata[i].username+"</td><td>"+jsondata[i].country+
        "</td><td>"+jsondata[i].message+"</td><td>"+jsondata[i].date+"</td></tr>";
    }
    content+="</tbody></table></body>"
    res.send(content)
});

//newmessage reitti lataa lomakkeen
app.get("/newmessage",(req,res)=>{
    res.sendFile(__dirname+"/lomake.html")
    });
    
    //ajaxmessage samankaltaisen lomakkeen
app.get("/ajaxmessage*",(req,res)=>{
    res.sendFile(__dirname +"/lomake2.html")
});

//lomakkeen julkaisuu kutsuu tätä reittiä ja tämä lisää lomakkeen tiedot lokaaliin jsontiedostoon
app.post("/addmessage",(req,res)=>{
    var jsondata = require("./guestjson.json")
    var date = new Date()
    var i = jsondata.length;
    jsondata.push({
        "id": i+1,
        "username" : req.body.Name,
        "country" : req.body.Country,
        "date": date.toString(),
        "message": req.body.Message
    });

    fs.writeFile('guestjson.json', JSON.stringify(jsondata),(err)=>{
        if(err) return console.error(err);
    })
    res.redirect("/guestbook")
});
//käsitellään tuntemattomat reitit
app.get("*",(req,res)=>{
    res.send("404!",404)
});

app.listen(PORT, function () {
    console.log("Server is running!")
});