var express = require('express');
var router = express.Router();


function asyncHandler(cb){
  return async(req, res, next) => {
    try 
    {
      await cb(req, res, next)
    } 
    catch(err)
    {
      res.status(500).send(err);
    }
  }
}

router.get('/', asyncHandler(async (req, res) => {}));
router.get('/new', asyncHandler(async (req, res) => {}));
router.post('/new', asyncHandler(async (req, res) => {}));
router.get('/:id', asyncHandler(async (req, res) => {}));
router.post('/:id', asyncHandler(async (req, res) => {}));
router.post('/:id/delete', asyncHandler(async (req, res) => {}));

module.exports = router;
