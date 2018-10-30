var mongoose = require('../common/db');

var maintable = new mongoose.Schema({
    hosname: String,
    CYSJ: Date,
    hos_lat: Number,
    hos_lng: Number,
    JBBM: String,
    NL: Number,
    flag0: Number,
    RYQK: Number,
    RYSJ: Date,
    RYTJ: Number,
    SSJCZMC1: String,
    code: Number,
    count: Number,
    pat_lat: Number,
    pat_lng: Number,
    pat_ID: String,
    flag1: Number,
    TimeInterval: Number
}, { collection: 'maintable'});

/*
Model.find(query, fields, options, callback)// fields 和 options 都是可选参数
*/
maintable.statics.findAll = function(callBack){
    let criteria = {}
    let fields = []
    let options = {limit: 1}
    this.find(criteria, fields, options, callBack);
}

//rank 最花钱rank
maintable.statics.findHospitalMoney = function(callBack){
    let criteria = {}
    let fields = ['hosname', 'count']
    let options = {}
    this.find(criteria, fields, options, callBack);
}

//住院时间rank
maintable.statics.findRankTime = function(callBack){
    let criteria = {}
    let fields = []
    let options = {limit: 1}
    this.find(criteria, fields, options, callBack);
}

//对应疾病住院时间

var maintableModel = mongoose.model('maintable', maintable);
module.exports = maintableModel;

