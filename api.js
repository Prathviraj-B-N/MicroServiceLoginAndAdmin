const express = require("express");
var app = express();
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser')
const dboperations = require('./models/dboperations');
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({ extended:  true }));
app.use(bodyParser.json());
app.use(cors());

router.use((request, response, next) => {
    console.log('middleware');
    next();
});


app.post('/signup',
  (req,res,next) =>{
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err){
            return res.status(500).json({
                error:err
            });
        }else{
            const user = {
                usn:req.body.usn,
                name:req.body.name,
                email:req.body.email,
                phone:req.body.phone,
                branch : req.body.branch,
                password:hash
                
            };
            try{
                dboperations.addUser(user).then(data  => {
                    res.status(201).json({message:'User created'});
                    console.log(user);
                  });
            }
            catch(err){
                
                console.log(err);
            }
        }
    });
      
      
      
  }
);

app.post('/login',(req,res)=>{
    try{
        dboperations.getUsers(req.body.usn).then((data)=>{
            console.log(data[0][0])
            if(bcrypt.compareSync(req.body.password, data[0][0]['password'])){
                res.status(202).json(data[0][0]);
            }else{
                res.status(401).json({message:'User inValid'});
            }
        })
    }catch(err){
        console.log(err);
    }
    
})




var port = process.env.PORT || 8090;
app.listen(port);
console.log('app listning on '+port);

