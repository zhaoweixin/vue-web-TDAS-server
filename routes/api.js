const mongoose = require('../common/db');
const express = require('express');
const upload = require('./multer')
const router = express.Router();
const fs = require('fs')

const dataProcessFunc = require('../models/dataprocess');
const dataProcess = dataProcessFunc.dataProcess
const dataBuffer = dataProcessFunc.dataBuffer

//api
    //上传并保存数据
router.post('/changeavatar', upload.single(), function(req, res){
    const avatar = req.files.null;
    avatar.mv('./upload/'+ avatar.name, function(err){
        if(err)
            return res.status(500).send(err);
        dataname = avatar.name.split('.')[0];
        datatype = avatar.name.split('.')[1];
        dataProcess.storeData(dataname, datatype)
        res.send('File uploaded!')
    });
})
    //获取已上传数据列表
router.post('/getDatalist', function(req, res, next){
    res.json(dataBuffer.getDataNameList())
})

router.post('/getInitData' ,function(req, res, next){
    /*
        请求数据格式
        {
            dataName: value
        }
    */
    
    //随机表
    let dataNameList = dataBuffer.getDataNameList()
    let randomKey = Math.floor(Math.random() * dataNameList.length)
    let dataName = dataNameList[randomKey]
    console.log(dataNameList, randomKey)

    resData = {
        "dimensions": dataBuffer.getDataDimensions(dataName),
        "description": "",
        "data": {
            "values": dataBuffer.getData(dataName)
        }
    }
    
    res.json(resData)
})

    //暂时使用默认存入数据功能
const storeDefaultData = function(){
    let dataInfo = {
        "teachingdata": "json",
        "package": "json",
        "2013-2014NBAPlayerStats": "csv"
    }
    for(var key in dataInfo){
        dataProcess.storeData(key, dataInfo[key])
    }
}
storeDefaultData();

module.exports = router;