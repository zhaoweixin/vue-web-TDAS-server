var express = require('express');
var multer = require('multer');
//var upload = require('./multer')
var router = express.Router();
var fs = require('fs')

var icd = require('../models/icd');
var maintable = require('../models/maintable');

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
        res.send('File uploaded!')
    });
})

module.exports =     router;