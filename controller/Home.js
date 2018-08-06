const Models = require('../model/dataModel');
const CtrlDB = require('../model/ctrlDB');
const multiparty = require('multiparty');
const fs = require("fs");

// 处理主页的请求
const Home = {
  // GET /
  index: (req, res)=>{
    return res.render('hello')
  },

};

module.exports = Home;
