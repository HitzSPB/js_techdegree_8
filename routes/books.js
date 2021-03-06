const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const Book = require('../models').Book;
const maxBooksApage = 5;

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

router.get('/', asyncHandler(async (req, res) => {
  // https://github.com/HitzSPB/js_techdegree_2/blob/main/js/script.js pagination
  const page = (req.query.page -1) || 0;
  const startIndex = page * maxBooksApage;

  let books = await Book.findAndCountAll({
    limit: maxBooksApage,
    offset: startIndex
  });

  const pages = Math.ceil(books.count / maxBooksApage);
  const pagecountArr = [];
  for(let i = 1; i<=pages; i++)
  {
    pagecountArr.push(i);
  }
  res.render('index', { books, title: 'Books', pagecountArr })}));

router.post('/', asyncHandler(async (req, res) => {
  let search = req.body.searchtext;
  const pagecountArr = [];
  let books;
  if ( search != '')
  {
    // https://sequelize.org/master/manual/model-querying-basics.html
    books = await Book.findAndCountAll({where: {
      [Op.or]: [
        {title: {[Op.like]: `%${search}%`}},
        {author: {[Op.like]: `%${search}%`}},
        {genre: {[Op.like]: `%${search}%`}},
        {year: {[Op.like]: `%${search}%`}}
      ]
    }});
  }
  else
  {    
    const page = (req.query.page -1) || 0;
    const startIndex = page * maxBooksApage;
    books = await Book.findAndCountAll({
      limit: maxBooksApage,
      offset: startIndex
    });
    const pages = Math.ceil(books.count / maxBooksApage);
    for(let i = 1; i<=pages; i++)
    {
      pagecountArr.push(i);
    }
  }
  res.render('index', { books, title: 'Books', pagecountArr })}));
router.get('/new', asyncHandler(async (req, res) => {res.render('new-book', { book: {}, title: 'New Book'})}));
router.post('/new', asyncHandler(async (req, res) => 
{
  let book;        
  try{
    book = await Book.create(req.body);
    res.redirect("/");
  }
  catch(err)
  {
    book = await Book.build(req.body);
    res.render('new-book',{ book, errors: err.errors, title: "Add a new book" })}
  }));
  
  router.get('/:id', asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if(book !== null)
    {
      res.render("update-book", { book, title: "Book Details" });
    }
    else
    {
      const err = new Error();
      err.status = 404;
      err.message = "The selected book ID have not been found";
      next(err);
    }
  }));

router.post('/:id', asyncHandler(async (req, res) => {
  try{
    let book = await Book.findByPk(req.params.id);
    await book.update(req.body)
    res.redirect("/");
  }
  catch(err)
  {
    const book = await Book.findByPk(req.params.id);
    res.render("update-book", { book, title: "Book Details", errors: err.errors });
  }}));
  
  router.post('/:id/delete', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect('/')}));

module.exports = router;
