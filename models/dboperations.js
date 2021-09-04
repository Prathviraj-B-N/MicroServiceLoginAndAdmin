const sql = require("mssql");
const Fs = require("fs");
const path = require('path');
const dbConfig = Fs.readFileSync(path.join(__dirname,'dbconfig.json'));
const dbConfigJson = JSON.parse(dbConfig);

async function getUsers(usn){
    try{
        let pool = await sql.connect(dbConfigJson);
        let users = await pool.request().input('input_parameter', sql.NVarChar,usn).query("SELECT * from student where usn = @input_parameter;");
        return users.recordsets;
    }
    catch(err){
        console.log(err);
    }
}

async function getHash(usn){
    try{
        let pool = await sql.connect(dbConfigJson);
        let users = await pool.request().input('input_parameter', sql.NVarChar,usn).query("SELECT password from student where usn = @input_parameter;");
        return users.recordset;
    }
    catch(err){
        console.log(err);
    }
}

async  function  addUser(user) {
    try {
      let  pool = await  sql.connect(dbConfigJson);
      let  insertUser = await  pool.request()
      .input('usn', sql.NVarChar, user.usn)
      .input('name', sql.NVarChar, user.name)
      .input('phone', sql.NVarChar, user.phone)
      .input('email', sql.NVarChar, user.email)
      .input('branch', sql.NVarChar, user.branch)
      .input('password', sql.Char, user.password)
      .execute('InsertUsers');
      return  insertUser.recordsets;
    }
    catch (err) {
      console.log(err);
    }
  }

module.exports = {
    getUsers:getUsers,
    addUser:addUser,
    getHash:getHash
}