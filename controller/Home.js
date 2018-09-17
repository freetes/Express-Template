const Models = require('../model/dataModel');

// 处理主页的请求
const Home = {
  // GET /
  index: (req, res)=>{
    return res.render('contents/hello')
  },

};

module.exports = Home;
