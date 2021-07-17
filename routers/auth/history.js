const Router = require('express-promise-router')
const router = new Router();
const Sequelize = require('sequelize')
const Cinema = require("../../models/cinema");
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
    var history =await sequelize.query(`SELECT f."filmName", b."DateCreate",b."Amount",CONCAT(t."codeH",t."codeW") as code FROM bookings as b 
    left join profiles as p on b."profileID" = p.id
    left join movies as m on m.id=b."movieID"
    left join films as f on f.id=m."filmID"
    left join tickets as t on t."bookingID" = b.id
    where p.id=`+profile.id, { type:Sequelize.QueryTypes.SELECT}); 
    res.render('history.ejs',{page: 'infoCinema', history,profile }); 
})

router.post('/',async function(req,res){
    // const {ID,cinemaName,cinemaGroup, cinemaType,cinemaN,cinemaD} = req.body;
    // console.log(ID);
    
    // if(ID != "")
    // {
    //     await Cinema.update(
    //         {
    //             cinemaName: cinemaName,
    //             cinemagroupID: cinemaGroup,
    //             cinemaType: cinemaType,
    //             length: cinemaD,
    //             width: cinemaN     
    //         },
    //         {
    //             where:{ id: ID}
    //         }
    //     )
    // }
    // else
    // {
    //     await Cinema.create(
    //         {
    //             cinemaName: cinemaName,
    //             cinemagroupID: cinemaGroup,
    //             cinemaType: cinemaType,
    //             length: cinemaD,
    //             width: cinemaN
    //         }
    //     )
    // }
    res.redirect('/auth/history');
})
module.exports = router;
