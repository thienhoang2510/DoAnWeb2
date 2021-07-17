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
    var cinemaGroup =await sequelize.query(`SELECT c."cinemagroupName",SUM(b."Amount") as SumAmount, b."DateCreate"
    FROM "cinemaGroups" as c join movies as m on c.id = m."filmID"
    join bookings as b on m.id = b."movieID"
    group by c.id, b."DateCreate"`, { type:Sequelize.QueryTypes.SELECT}); 
    var film =await sequelize.query(`SELECT f."filmName",SUM(b."Amount") as SumAmount, b."DateCreate"
    FROM films AS f join movies as m on f.id = m."filmID"
    join bookings as b on m.id = b."movieID"
    group by f.id, b."DateCreate"`, { type:Sequelize.QueryTypes.SELECT}); 
    var cinemaGroup2 =await sequelize.query(`SELECT c."cinemagroupName",SUM(b."Amount") as SumAmount
    FROM "cinemaGroups" as c join movies as m on c.id = m."filmID"
    join bookings as b on m.id = b."movieID"
    group by c.id`, { type:Sequelize.QueryTypes.SELECT}); 
    var film2 =await sequelize.query(`SELECT f."filmName",SUM(b."Amount") as SumAmount
    FROM films AS f join movies as m on f.id = m."filmID"
    join bookings as b on m.id = b."movieID"
    group by f.id`, { type:Sequelize.QueryTypes.SELECT}); 
    res.render('dashboard.ejs',{page: 'infoCinema', cinemaGroup, film,cinemaGroup2, film2,profile });
})

router.post('/',async function(req,res){
    var profile= null;
    if(req.session.profile!=null)
    {
      profile=req.session.profile;
    }
    const {DateStart,DateEnd} = req.body;
    var cinemaGroup =await sequelize.query(`SELECT c."cinemagroupName",SUM(b."Amount") as SumAmount, b."DateCreate"
    FROM "cinemaGroups" as c join movies as m on c.id = m."filmID"
    join bookings as b on m.id = b."movieID"
    where b."DateCreate" >= '`+DateStart+`' and b."DateCreate" <= '`+DateEnd+`'` +`
    group by c.id, b."DateCreate"`, { type:Sequelize.QueryTypes.SELECT}); 
    var film =await sequelize.query(`SELECT f."filmName",SUM(b."Amount") as SumAmount, b."DateCreate"
    FROM films AS f join movies as m on f.id = m."filmID"
    join bookings as b on m.id = b."movieID"
    where b."DateCreate" >= '`+DateStart+`' and b."DateCreate" <= '`+DateEnd+`'` +`
    group by f.id, b."DateCreate"`, { type:Sequelize.QueryTypes.SELECT}); 
    var cinemaGroup2 =await sequelize.query(`SELECT c."cinemagroupName",SUM(b."Amount") as SumAmount
    FROM "cinemaGroups" as c join movies as m on c.id = m."filmID"
    join bookings as b on m.id = b."movieID"
    where b."DateCreate" >= '`+DateStart+`' and b."DateCreate" <= '`+DateEnd+`'` +`
    group by c.id`, { type:Sequelize.QueryTypes.SELECT}); 
    var film2 =await sequelize.query(`SELECT f."filmName",SUM(b."Amount") as SumAmount
    FROM films AS f join movies as m on f.id = m."filmID"
    join bookings as b on m.id = b."movieID"
    where b."DateCreate" >= '`+DateStart+`' and b."DateCreate" <= '`+DateEnd+`'` +`
    group by f.id`, { type:Sequelize.QueryTypes.SELECT}); 
    
    res.render('dashboard.ejs',{page: 'infoCinema', cinemaGroup, film,profile,cinemaGroup2, film2 });
})

router.post('/load',async (req,res)=>{ 
    var profile= null;
    if(req.session.profile!=null)
    {
      profile=req.session.profile;
    }
    const {DateStart,DateEnd} = req.body;
    var cinemaGroup =await sequelize.query(`SELECT c."cinemagroupName",SUM(b."Amount") as SumAmount, b."DateCreate"
    FROM "cinemaGroups" as c join movies as m on c.id = m."filmID"
    join bookings as b on m.id = b."movieID"
    where b."DateScreate" >= ${DateStart} and b."DateScreate" <= ${DateEnd}
    group by c.id, b."DateCreate"`, { type:Sequelize.QueryTypes.SELECT}); 
    var film =await sequelize.query(`SELECT f."filmName",SUM(b."Amount") as SumAmount, b."DateCreate"
    FROM films AS f join movies as m on f.id = m."filmID"
    join bookings as b on m.id = b."movieID"
    group by f.id, b."DateCreate"`, { type:Sequelize.QueryTypes.SELECT}); 
    res.json({cinemaGroup: cinemaGroup, film: film,profile});
})
module.exports = router;
