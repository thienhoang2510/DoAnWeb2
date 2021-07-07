const Router = require('express-promise-router')
const router = new Router();

router.use("/cinema", require("./admin/cinema"));
router.use("/cinemaGroup", require("./admin/cinemaGroup"));
router.use("/movie", require("./admin/movie"));
router.use("/film", require("./admin/film"));
router.use("/dashboard", require("./admin/dashboard"));

module.exports = router
