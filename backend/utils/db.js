import mysql from 'mysql'

const con = mysql.createConnection({
    host: "localhost",
    user: "test",
    password: "test",
    database: "admin"
})

con.connect(function(err) {
    if(err) {
        console.log("connection error")
    } else {
        console.log("Connected")
    }
})

export default con;

