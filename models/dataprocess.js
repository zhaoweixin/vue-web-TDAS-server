const fs = require('fs')
const staticBasePath = "../upload/"
const path = require('path');
const d3 = require('d3')
const csvToJson = require('convert-csv-to-json');
const flatten = require('flat');
const keys = require('all-object-keys');
const dsv = d3.dsvFormat(",")

//命名空间 首先检查dataprocess是否已经被定义 
//如果是的话，那么使用现有的dataprocess全局对象
//否则，创建一个名为dataprocess的空对象用来封装方法，函数，变量和对象。
var dataProcess = dataProcess || {};

dataProcess = {
    storeData: function(dataName, dataType){
        /*-----------------------------------------------------------------------------------------*/
        const jsonAddId = function(obj){
            //递归遍历确保所有变量加上id
            function recursion(obj) {
                for(let a in obj){
                    if(!Array.isArray(obj[a])){
                        recursion(obj[a]); //递归遍历
                    } else {
                        //循环赋值id
                        for(let i=0; i<obj[a].length;i++){
                            obj[a][i]['StoreId'] = createRandomId()
                            obj[a][i]['isDelete'] = false
                        }
                    }
                }
            }
            
            //判断数据是否为obj从而决定是否用递归赋值
            if(Array.isArray(obj)){
                for(let i=0; i<obj.length;i++){
                    obj[i]['StoreId'] = createRandomId()
                    obj[i]['isDelete'] = false
                    /*
                    let temp = obj[i]
                    obj[i] = flatten(temp)
                    */
                }
            } else {
                recursion(obj)
            }
            return obj
        }

        const createRandomId = function () {
            return (Math.random()*10000000).toString(16).substr(0,4)+'-'+(new Date()).getTime()+'-'+Math.random().toString().substr(2,5);
        }

        const addRawDataToBuffer = function (json, dataName) {
            //rawdata.data = json
            //把读入的数据存入dataBuffer
            if(!dataBuffer.data.hasOwnProperty(dataName)){
                dataBuffer.data[dataName] = json;
            }
        }

        const createIndex = function (json, dataName){
            if(!dataBuffer.index.hasOwnProperty(dataName)){
                dataBuffer.index[dataName] = {}

                for(let i=0; i<json.length; i++){
                    let key = json[i]['StoreId'];
                    let value = i;
                    if(!dataBuffer.index[dataName].hasOwnProperty(key)){
                        dataBuffer.index[dataName][key] = value
                    }     
                }
            }
        }

        const generateDimensions = function (columns, dataName) {
            let obj = {
                'name': dataName,
                'dimensions': []
            }
            columns.forEach(function(d,i){
                obj.dimensions.push({
                    'name': d,
                    'type': 'Ordinal'
                })
            })
            dataBuffer.dimensions.push(obj)
            //To do judge type
        }
        /*-----------------------------------------------------------------------------------------*/
        if(dataType == 'csv'){
            //使用插件convert-csv-to-json读入csv并转成json赋id
            fs.readFile(path.join(__dirname, staticBasePath + dataName + '.' + dataType), 'utf-8', function(err, data){
                if (err) throw err;
                //处理字符串首字符问题
                let firstCode = data.charCodeAt(0)
                if (firstCode < 0x20 || firstCode > 0x7f){
                    data = data.substring(1)
                }
                let json = dsv.parse(data)
                let rawdata = []
                let columns = json.columns

                json.forEach(function(d,i){
                    rawdata.push(d)
                })
                addRawDataToBuffer(rawdata, dataName);
                generateDimensions(columns, dataName);
                jsonAddId(rawdata);
                createIndex(rawdata, dataName);
                if(dataName == "package"){
                    console.log()
                }
                console.log(dataName + "." + dataType + " successful loading~")
            })
        } else if(dataType == 'json'){
            //使用fs读入json
            fs.readFile(path.join(__dirname, staticBasePath + dataName + '.' + dataType), 'utf-8', function(err, data) {
                if (err) throw err;

                //处理字符串首字符问题
                let firstCode = data.charCodeAt(0)
                if (firstCode < 0x20 || firstCode > 0x7f){
                    data = data.substring(1)
                }
                
                let rawdata = JSON.parse(data);
                let columns = Object.keys(flatten(rawdata[0]))

                addRawDataToBuffer(rawdata, dataName);
                generateDimensions(columns, dataName);
                jsonAddId(rawdata);
                createIndex(rawdata, dataName);
                console.log(dataName + "." + dataType + " successful loading~")
            })
        }
    },
    leftJoin: function(){},
    rightJoin: function(){},
    deleteData: function(StoreId, filename){
        dataName = filename.split('.')[0]
        index = dataBuffer.index[dataName][StoreId]
        //isDelete = true 表示已经删除
        dataBuffer.data[dataName][index].isDelete = true
    },
    unDeleteData: function(StoreId, filename){
        dataName = filename.split('.')[0]
        index = dataBuffer.index[dataName][StoreId]
        //isDelete = false 表示未删除
        dataBuffer.data[dataName][index].isDelete = false
    },
    sortData: function(filename){
        dataName = filename.split('.')[0]
    }
}

const dataBuffer = {
    data: {},
    index: {},
    dimensions: [],
    getDataKeysList: function(){
        return this.dimensions;
    },
    getDataNameList: function(){
        let l = []
        for(var key in this.data){
            //
            l.push(key)
        }
        return l;
    },
    getDataDimensions: function(dataName){
        for(let i in this.dimensions){
            if(this.dimensions[i]['name'] == dataName)
                return this.dimensions[i]['dimensions']
        }
    },
    getData: function(dataName){
        if(this.data.hasOwnProperty(dataName)) return this.data[dataName]
    },
    getIndex: function(dataName){
        if(this.index.hasOwnProperty(dataName)) return this.index[dataName]
    }
}

module.exports = {dataProcess, dataBuffer};
