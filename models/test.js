var mongoose = require('../common/db');

var icd = new mongoose.Schema({
    ICDCodeSeven: String,
    ICDChineseName: String
}, { collection: 'icdfullname'})

//查找所有
icd.statics.findAll = function (callBack) {
    let criteria = {}
    let fields = []
    let options = {limit: 20}
    this.find(criteria, fields, options, callBack);
}

//查找icd码对应中文名
icd.statics.findByicdCode = function (id,callBack) {
    //this.find({ICDCodeSeven: id}, callBack)
};

var icdModel = mongoose.model('icd', icd);

module.exports = icdModel;