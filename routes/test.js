const express = require('express');
const multer = require('multer');
//var upload = require('./multer')
const router = express.Router();
const fs = require('fs')

const test = require('../models/test');
const maintable = require('../models/maintable');
const dataProcessFunc = require('../models/dataprocess');
const dataProcess = dataProcessFunc.dataProcess
const dataBuffer = dataProcessFunc.dataBuffer

var createFolder = function(folder){
    try{ 
        fs.accessSync(folder);  
    }catch(e){ 
        fs.mkdirSync(folder); 
    }   
};

var uploadFolder = './upload/'; 
 
createFolder(uploadFolder);

// 通过 filename 属性定制
var storage = multer.diskStorage({ 
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建 
    }, 
    filename: function (req, file, cb) { 
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943 
        cb(null, file.fieldname );   
    } 
});

var upload = multer({ storage: storage }) 

router.get('/getHospitalMoney', function(req, res, next){
    maintable.findHospitalMoney(function(err, result){
        res.json({message: result});
    })
})

router.get('/findAll', function(req, res, next){
    maintable.findAll(function(err, RankMoney){
        res.json({message: RankMoney})
    })
});

router.post('/changeavatar', upload.single(), function(req, res){
    var avatar = req.files.null;
    avatar.mv('./upload/'+ avatar.name, function(err){
        if(err)
            return res.status(500).send(err);
        dataname = avatar.name.split('.')[0];
        datatype = avatar.name.split('.')[1];
        dataProcess.storeData(dataname, datatype)
        res.send('File uploaded!')
    });
})

router.post('/getDatalist', function(req, res, next){
    res.json(dataBuffer.getDataNameList())
})
module.exports = router;