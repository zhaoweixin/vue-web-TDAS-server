const fs = require('fs')
const staticBasePath = "../upload/"
const path = require('path');
const d3 = require('d3')

//命名空间 首先检查dataprocess是否已经被定义 
//如果是的话，那么使用现有的dataprocess全局对象
//否则，创建一个名为dataprocess的空对象用来封装方法，函数，变量和对象。
var dataProcess = dataProcess || {};

dataProcess = {
    storeData: function(filename, datatype){
        const rawdata = {
            "filename": filename,
            'datatype': datatype,
            'data': ''
        };

        //异步
        fs.readFile(path.join(__dirname, staticBasePath + filename + '.' + datatype), 'utf-8', function(err, data) {
            if(err){
                console.error(err);
            } else {
                //根据数据类型格式化数据
                if(datatype == 'csv'){
                    rawdata.data = d3.csvParse(data)
                } else if(datatype == 'json'){
                    if(typeof data === 'string'){
                        console.log(data)
                    }
                }

                //把读入的数据存入dataBuffer
                if(!dataBuffer.data.hasOwnProperty(filename)){
                    dataBuffer.data[filename] = rawdata
                }
            }
        })
    },
    leftJoin: function(){},
    rightJoin: function(){},
    deleteData: function(id, filename){
        dataName = filename.split('.')[0]
    },
    sortData: function(filename){
        dataName = filename.split('.')[0]
    }
}

const dataBuffer = {
    data: {},
    getDataNameList: function(){
        const l = []
        for(var i in dataBuffer.data){
            l.push[i]
        }
        return l;
    }
}

module.exports = {dataProcess, dataBuffer};
