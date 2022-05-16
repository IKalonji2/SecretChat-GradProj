const  express = require('express');
const router = express.Router();

module.exports = router;

router.all('/', (req, res) => {
    res.render('index.ejs', {});
});