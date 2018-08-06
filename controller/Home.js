const Models = require('../model/dataModel');
const CtrlDB = require('../model/ctrlDB');
const multiparty = require('multiparty');
const fs = require("fs");

// 处理主页的请求
const Home = {
  // GET /
  index: (req, res)=>{
    if(!req.session.user)
      return res.redirect('/signin')
    // 这里获取数据
    CtrlDB.getAllInfoInIndexPage(email=JSON.parse(req.session.user).email).then(data=>{
      return res.render('contents/hello', {
        title: '公司首页-' + JSON.parse(req.session.company).name,
        company: data.company,
        user: data.user,
      });
    })
  },

  // POST /
  indexPost: (req, res)=>{
    if(!req.session.user)
      return res.redirect('/signin')
      if(!req.session.user)
      return res.redirect('/signin')

    let options = {
      uploadDir: './public/file/update',
      encoding: 'utf8'
    }
    let form = new multiparty.Form(options);

    Models.Organization.findOne({}, (err, organization)=>{
      form.parse(req, function(err, fields, files) {
        let logos = files.logo

        if(logos[0].size != 0){
          // 删除原文件
          for(let item of organization.logo){
            if(fs.existsSync('./public' + item.path))
              fs.unlinkSync('./public'+item.path);
          }
          const companyDirectory = './public/file/' + JSON.parse(req.session.company)._id + '/logo/'
          for(let i=0; i<logos.length; i++){
            if(logos[i].size == 0){
              logos.splice(i, 1)
              fs.unlinkSync(logos[i].path);
            }
            else{         
              if(!fs.existsSync('./public/file/' + JSON.parse(req.session.company)._id))
                fs.mkdirSync('./public/file/' + JSON.parse(req.session.company)._id);
              if(!fs.existsSync(companyDirectory))
                fs.mkdirSync(companyDirectory);
          
              const dstPath = companyDirectory + logos[i].originalFilename;
              fs.renameSync(logos[i].path, dstPath)
              // 更新信息
              logos[i].path = dstPath.slice(8)
              logos[i].name = logos[i].originalFilename
              delete logos[i].originalFilename
              delete logos[i].headers
              delete logos[i].size
              delete logos[i].fieldName
            }
          }

          organization.logo = logos
        }
        
        organization.name = fields.name[0]
        organization.subName = fields.subName[0]
        organization.industry = fields.industry[0]
        organization.introduction = fields.introduction[0]
        organization.welfare = fields.welfare[0]

        Models.Organization.findOneAndUpdate({}, organization, (err, organization)=>{
          return res.redirect('/company')
        })
      });
    });
  },

  // GET /company
  company: (req, res)=>{
    if(!req.session.user)
      return res.redirect('/signin')
    // 这里获取数据
    CtrlDB.getAllInfoInIndexPage(email=JSON.parse(req.session.user).email).then(data=>{
      Models.CompanyNews.find({}, (err, news)=>{
        return res.render('contents/company', {
          title: '企业故事-' + JSON.parse(req.session.company).name,
          company: data.company,
          user: data.user,
          news
        });
      })
    })
  },

  // GET /organization
  organization: (req, res)=>{
    if(!req.session.user)
      return res.redirect('/signin')

    Models.Organization.findOne({}, (err, organization)=>{
      if(err) return res.end(err)
      Models.Employee.find({}, (err, employees)=>{
        return res.render('contents/organization',{
          title: '组织结构-' + JSON.parse(req.session.company).name,
          company: organization,
          employees,
          user: JSON.parse(req.session.user)
        })  
      })
    })
  },

  // GET /hire
  hire: (req, res)=>{
    if(!req.session.user)
      return res.redirect('/signin')

    Models.Suggest.find({}, (err, suggests)=>{
      Models.Interview.find({}, (err, interviews)=>{
        return res.render('contents/hire',{
          title: '招聘数据-' + JSON.parse(req.session.company).name,
          company: JSON.parse(req.session.company),
          user: JSON.parse(req.session.user),
          suggests,
          interviews
        })
      })
    })
  },

  // POST /hire
  hireNewSuggest: (req, res)=>{
    if(!req.session.user)
      return res.redirect('/signin')

    let options = {
      uploadDir: './public/file/update',
      encoding: 'utf8'
    }
    let form = new multiparty.Form(options);
  
    form.parse(req, function(err, fields, files) {
      let file = files.file[0]

      const companyDirectory = './public/file/' + JSON.parse(req.session.company)._id + '/pdf/'
      if(!fs.existsSync('./public/file/' + JSON.parse(req.session.company)._id))
        fs.mkdirSync('./public/file/' + JSON.parse(req.session.company)._id);
      if(!fs.existsSync(companyDirectory))
        fs.mkdirSync(companyDirectory);
  
      let dstPath = companyDirectory + 'CV-' + (JSON.parse(req.session.user)).name + '-' + Date.now() + '.pdf';
      //重命名为真实文件名
      fs.rename(file.path, dstPath, err=>{
        fields.file = {
          name: file.originalFilename,
          path: dstPath.slice(8)
        }
        fields.status = 0
        fields.operator = (JSON.parse(req.session.user)).name
        fields.date = Date.now()
        Models.Suggest(fields).save(err=>{
          return res.redirect('/hire')
        })
      })
    });
  },

  // POST /changeSuggest
  changeSuggest: (req, res)=>{
    if(!req.session.user)
      return res.json(false)
    Models.Suggest.findByIdAndUpdate({_id: req.body.id}, {status: req.body.status, remark: req.body.remark}, (err, data)=>{
      if(req.body.status == 1){
        Models.Interview({
          name: data.name,
          job: data.job,
          company: data.company,
          file: data.file,
          reason: data.reason,
          date: req.body.date,
          operator: (JSON.parse(req.session.user)).name,
          status: 0,
        }).save(err=>{
          return res.json(true)
        })  
      }
      else
        return res.json(true)
    })
  },

  // POST /changeInterview
  changeInterview: (req, res)=>{
    if(!req.session.user)
      return res.json(false)
    Models.Interview.findByIdAndUpdate({_id: req.body.id}, {status: req.body.status, remark: req.body.remark}, (err, data)=>{
      return res.json(true)
    })
  },

  // GET /salary
  salary: (req, res)=>{
    if(!req.session.user)
      return res.redirect('/signin')

    return res.render('contents/salary',{
      title: '薪酬数据-' + JSON.parse(req.session.company).name,
      company: JSON.parse(req.session.company),
      user: JSON.parse(req.session.user)
    })
  },

  // GET /workerChange
  workerChange: (req, res)=>{
    if(!req.session.user)
      return res.redirect('/signin')

    // 获取数据
    CtrlDB.getAllChangeInfo().then(data=>{
      return res.render('contents/workerChange',{
        title: '人员异动-' + JSON.parse(req.session.company).name,
        company: JSON.parse(req.session.company),
        user: JSON.parse(req.session.user),
        data
      })
    })
  },

  // GET /risk
  risk: (req, res)=>{
    if(!req.session.user)
      return res.redirect('/signin')

    return res.render('contents/risk',{
      title: '风险评估-' + JSON.parse(req.session.company).name,
      company: JSON.parse(req.session.company),
      user: JSON.parse(req.session.user)
    })
  },

  // GET /admin
  admin: (req, res)=>{
    if(!req.session.user)
      return res.redirect('/signin')

    Models.User.find({}, (err, users)=>{
      return res.render('contents/admin',{
        title: '账号管理-' + JSON.parse(req.session.company).name,
        company: JSON.parse(req.session.company),
        user: JSON.parse(req.session.user),
        users
      })
    })
  },

  // GET /affair
  affair: (req, res)=>{
    if(!req.session.user)
      return res.redirect('/signin')

    Models.Affair.find({}, (err, affairs)=>{
      return res.render('contents/affair',{
        title: '事务管理-' + JSON.parse(req.session.company).name,
        company: JSON.parse(req.session.company),
        user: JSON.parse(req.session.user),
        affairs
      })
    })
  },
  // GET /affair/:id
  affairInfo: (req, res)=>{
    if(!req.session.user)
      return res.redirect('/signin')
    Models.Affair.find({}, (err, affairs)=>{
      let affair
      for(let item of affairs)
        if(item._id == req.params.id)
          affair = item
      
      if(typeof affair == 'undefined')
        return res.redirect('/signin')
      else{
        return res.render('contents/affairInfo',{
          title: affair.name + '-' + JSON.parse(req.session.company).name,
          company: JSON.parse(req.session.company),
          user: JSON.parse(req.session.user),
          affair,
          affairs
        })
      }
    })
  },
  // POST /affair/:id
  createList: (req, res)=>{
    if(!req.session.user)
      return res.redirect('/signin')

    Models.Affair.findById(req.params.id, (err, affair)=>{
      affair.lists.push({
        name: req.body.name,
        date: Date.now(),
        items: []
      })
      Models.Affair.findByIdAndUpdate(req.params.id, affair, (err)=>{
        return res.redirect('/affair/'+req.params.id)
      })
    })
  },
};

// 判断是否登录
function isLogin(req, res){
  if(!req.session.user)
    return res.redirect('/signin')
}

module.exports = Home;
