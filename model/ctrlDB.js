const Models = require('./dataModel');

const ctrlDB = {
  // 获取人员异动总表
  getAllChangeInfo: async id=>{
    return {
      entry: await Models.Entry.find(),
      resignation: await Models.Resignation.find(),
      turnPositive: await Models.TurnPositive.find(),
      change: await Models.Change.find(),
    }
  },
  // 主页获取信息
  getAllInfoInIndexPage: async (email)=>{
    return {
      company: await Models.Organization.findOne(),
      user: await Models.User.findOne({email: email}),
    }
  },
  // 删除用户
  deleteUser: async (id)=>{
    let entrys = await Models.Entry.find({'employeeID': id})
    let changes = await Models.Change.find({'employeeID': id})
    let turnPositives = await Models.TurnPositive.find({'employeeID': id})
    let resignations = await Models.Resignation.find({'employeeID': id})

    let i=0
    for(i=0; i<entrys.length; i++){
      await Models.Entry.findOneAndRemove({'employeeID': id})
    }
    for(i=0; i<changes.length; i++){
      await Models.Change.findOneAndRemove({'employeeID': id})
    }
    for(i=0; i<turnPositives.length; i++){
      await Models.TurnPositive.findOneAndRemove({'employeeID': id})
    }
    for(i=0; i<resignations.length; i++){
      await Models.Resignation.findOneAndRemove({'employeeID': id})
    }
    
    return true
  }
};

module.exports = ctrlDB;
