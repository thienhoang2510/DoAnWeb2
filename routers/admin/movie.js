const Router = require('express-promise-router')
const router = new Router();
const Sequelize = require('sequelize')
const movie = require("../../models/movie");
const { STRING } = require('sequelize');
const sequelize = require("../../models/dbconnect");

router.get('/',async function(req,res){
    var movie =await sequelize.query(`SELECT * FROM movies`, { type:Sequelize.QueryTypes.SELECT}); 
    var film =await sequelize.query(`SELECT * FROM films`, { type:Sequelize.QueryTypes.SELECT});
    var cinema =await sequelize.query(`SELECT * FROM cinemas`, { type:Sequelize.QueryTypes.SELECT});
    var movie1 =await sequelize.query(`SELECT m.id,f."filmName",c."cinemaName",m."DateStart",m."DateEnd",m."price" FROM movies as m 
    left join films as f on f.id=m."filmID" 
    left join cinemas as c on c.id = m."cinemaID"`, { type:Sequelize.QueryTypes.SELECT}); 
    res.render('movie.ejs',{page: 'infoCinema', movie,film,cinema, movie1}); 
})

router.post('/',async function(req,res){
    const {ID,filmID,cinemaID, DateStart,DateEnd,price} = req.body;

    console.log(DateStart);
    
    if(ID != "")
    {
        await movie.update(
            {
                filmID: filmID,
                cinemaID: cinemaID,
                DateStart: DateStart,
                DateEnd: DateEnd,
                price: price     
            },
            {
                where:{ id: ID}
            }
        )
    }
    else
    {
        await movie.create(
            {
                filmID: filmID,
                cinemaID: cinemaID,
                DateStart: DateStart,
                DateEnd: DateEnd,
                price: price 
            }
        )
    }
    res.redirect('/admin/movie');
})
router.get('/:id',async function(req,res){
    var IDs = req.params.id;
    IDs = IDs.substring(1,IDs.length-1);
    var lstID = IDs.split(',');
    if(lstID != null || lstID != "")
    {
        for(let i = 0; i < lstID.length ; i++ )
        {
            await sequelize.query(`DELETE FROM movies WHERE id = '${lstID[i]}'`, { type: Sequelize.QueryTypes.DELETE });
        }
    }
    
    res.redirect('/admin/movie');
})
module.exports = router;
