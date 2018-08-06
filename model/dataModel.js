const Employee = require('./employeeInfo'),
      Entry = require('./entryInfo'),
      Resignation = require('./resignationInfo'),
      TurnPositive = require('./turnPositiveInfo'),
      Change = require('./changeInfo'),
      Organization = require('./organizationInfo'),
      User = require('./userInfo'),
      DeleteLog = require('./deleteLog'),
      HireInfo = require('./hireInfo'),
      CompanyNews = require('./companyNews'),
      Affair = require('./affairInfo')

const Models = {
  Employee,
  Entry,
  Resignation,
  TurnPositive,
  Change,
  Organization,
  User,
  DeleteLog,
  Suggest: HireInfo.Suggest,
  Interview: HireInfo.Interview,
  CompanyNews,
  Affair
}

// Create user to test 

// Models.Organization({
//   name: '武汉然诺咨询有限公司',
//   subName: '武汉然诺',
//   logo: '',
//   department: []
// }).save(err=>{
//   Models.User({
//     email: 'lishuang@rulertech.com',
//     name: '李爽',
//     password: '1',
//     level: 1
//   }).save(err=>{
//     Models.User({
//       email: 'zsq@rulertech.com',
//       name: '张思琴',
//       password: '1',
//       level: 1
//     }).save()
//   })
// })

module.exports = Models;
