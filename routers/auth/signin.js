const Router = require("express-promise-router");
const router = new Router();
const Users = require("../../models/user");
const Sequelize = require("sequelize");
const express = require('express');
const app = express();
 
app.set("view engine", "ejs");
app.set("views", "./views");
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
const bcrypt = require('bcryptjs');
const sequelize = require("../../models/dbconnect");
//const bcrypt = require('bcrypt');

router.get("/", function(req, res) {
  // res.json({result: req.session});
  res.render('signin.ejs'); 
    // if (req.session.profile) {
    //     res.redirect("/");
    // } else {
    //     res.render("signin.ejs", {page:"signin",err:0});
    // }
});



router.post("/", async function(req, res){
  const { Email, password } = req.body;
  const user = await Users.findOne({
    where: {
      Email: Email
    }
  });
  console.log('1')
  if(!user)
  {
    console.log('2')
    //Email or password is wrong
    //res.render('auth/signin', {page:"signin",err:1});
    res.render('signin.ejs'); 
  }
  else
  {
    console.log('3')
    if(bcrypt.compareSync(password,user.password))
    {
      console.log('4')
      if(!user.status)
      {
        res.send('Vui lòng xác thực tài khoản email trước khi đăng nhập')
      }
      else
      {
        console.log('5')
        //check premission of user 
       
        //var url = req.session.url;
        var profile = user; 
        
        req.session.profile = user;
        console.log(user);

        //sau khi signin redirect lai trang do
        //res.redirect('/');
          var movie =await sequelize.query(`SELECT * FROM films`, { type:Sequelize.QueryTypes.SELECT}); 
          res.render('index.ejs', {page: 'infoMovie', movie,profile }); 
          //res.redirect('/');
      }
    }
    else{
      console.log('6')
        //Email or password is wrong
        //res.render('auth/signin', {page:"signin",err:1});
        res.render('signin.ejs'); 
    }
  }
  
});

module.exports = router;