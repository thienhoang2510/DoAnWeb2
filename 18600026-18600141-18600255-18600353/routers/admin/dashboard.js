const Router = require('express-promise-router')
const router = new Router();
const Sequelize = require('sequelize')
const Cinema = require("../../models/cinema");
const bcrypt = require('bcryptjs');
const express = require('express');
const { STRING } = require('sequelize');
const app = express();
const sequelize=new Sequelize(process.env.DATABASE_URL ||'postgres://postgres:baolerop@localhost:5432/ltweb2');

router.get('/',async function(req,res){
    var cinemaGroup =await sequelize.query(`SELECT c."cinemagroupName",SUM(b."Amount") as SumAmount, b."DateCreate"
    FROM "cinemaGroups" as c left join movies as m on c.id = m."filmID"
    left join bookings as b on m.id = b."movieID"
    group by c.id, b."DateCreate"`, { type:Sequelize.QueryTypes.SELECT}); 
    var film =await sequelize.query(`SELECT f."filmName",SUM(b."Amount") as SumAmount, b."DateCreate"
    FROM films AS f left join movies as m on f.id = m."filmID"
    left join bookings as b on m.id = b."movieID"
    group by f.id, b."DateCreate"`, { type:Sequelize.QueryTypes.SELECT}); 
    res.render('dashboard.ejs',{page: 'infoCinema', cinemaGroup, film });
})

router.post('/',async function(req,res){
    const {ID,cinemaName,cinemaGroup, cinemaType,cinemaN,cinemaD} = req.body;
    console.log(ID);
    
    if(ID != "")
    {
        await Cinema.update(
            {
                cinemaName: cinemaName,
                cinemagroupID: cinemaGroup,
                cinemaType: cinemaType,
                length: cinemaD,
                width: cinemaN     
            },
            {
                where:{ id: ID}
            }
        )
    }
    else
    {
        await Cinema.create(
            {
                cinemaName: cinemaName,
                cinemagroupID: cinemaGroup,
                cinemaType: cinemaType,
                length: cinemaD,
                width: cinemaN
            }
        )
    }
    res.redirect('/admin/dashboard');
})
module.exports = router;
