const Router = require('express-promise-router')
const router = new Router();
const Sequelize = require('sequelize')
const Cinema = require("../../models/cinema");
const booking = require("../../models/booking");
const ticket = require("../../models/ticket");
const bcrypt = require('bcryptjs');
const express = require('express');
const { STRING } = require('sequelize');
const app = express();
const sequelize = require("../../models/dbconnect");

router.get('/',async function(req,res){
    var profile= null;
    if(req.session.profile!=null)
    {
      profile=req.session.profile;
    }
    var cinema =await sequelize.query(`SELECT * FROM cinemas`, { type:Sequelize.QueryTypes.SELECT}); 
    var film =await sequelize.query(`SELECT * FROM films`, { type:Sequelize.QueryTypes.SELECT}); 
    var movie = await sequelize.query(`SELECT m.id,m."filmID",m."cinemaID",m."DateStart" FROM movies as m
    where m."filmID"=${film[0].id} and m."cinemaID"=${cinema[0].id}`, { type:Sequelize.QueryTypes.SELECT}); 
    res.render('booking.ejs',{page: 'infoCinema', movie,cinema,film, profile }); 
})

router.post('/load',async (req,res)=>{ 
  const {filmID,cinemaID} = req.body;
  console.log(filmID +" - "+ cinemaID);
  var data = await sequelize.query(`SELECT m.id,m."DateStart" FROM movies as m
  where m."filmID"=${filmID} and m."cinemaID" = ${cinemaID}`, { type:Sequelize.QueryTypes.SELECT});
  console.log(data);
  res.json(data);
})

router.post('/',async function(req,res){
    const {film,cinema,timeStart,codeW,codeH} = req.body;
    var profile= null;
    if(req.session.profile!=null)
    {
      profile=req.session.profile;
      var movie =await sequelize.query(`SELECT * FROM movies as m
      where m.id=${timeStart}`, { type:Sequelize.QueryTypes.SELECT});
      var a = await booking.create(
      {
          profileID: profile.id,
          movieID: timeStart,
          DateCreate: new Date(),
          Amount: movie[0].price
      });
      await ticket.create(
      {
        bookingID: a.id,
        codeW: codeW,
        codeH: codeH,
        price: movie[0].price
      });
      res.redirect('/auth/history');
    }
    else
    {
      res.render('signin.ejs'); 
    }
})
module.exports = router;
