var express = require('express');
const models=require('../models');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json(models.Book.findAll());
});

module.exports = router;
