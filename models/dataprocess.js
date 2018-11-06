const fs = require('fs')
const staticBasePath = "../upload/"
const path = require('path');
const d3 = require('d3')
const csvToJson = require('convert-csv-to-json');
const flatten = require('flat')

//命名空间 首先检查dataprocess是否已经被定义 
//如果是的话，那么使用现有的dataprocess全局对象
//否则，创建一个名为dataprocess的空对象用来封装方法，函数，变量和对象。
var dataProcess = dataProcess || {};

dataProcess = {
    storeData: function(dataname, datatype){
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
                    let temp = obj[i]
                    obj[i] = flatten(temp)
                }
            } else {
                recursion(obj)
            }
            return obj
        }

        const createRandomId = function () {
            return (Math.random()*10000000).toString(16).substr(0,4)+'-'+(new Date()).getTime()+'-'+Math.random().toString().substr(2,5);
        }

        const addRawDataToBuffer = function (json) {
            //rawdata.data = json
            //把读入的数据存入dataBuffer
            if(!dataBuffer.data.hasOwnProperty(dataname)){
                dataBuffer.data[dataname] = json;
            }
        }

        const createIndex = function (json, dataname){
            if(!dataBuffer.index.hasOwnProperty(dataname)){
                dataBuffer.index[dataname] = {}
                for(let i=0; i<json.length; i++){
                    let key = json[i]['StoreId'];
                    let value = i;
                    if(!dataBuffer.index[dataname].hasOwnProperty(key)){
                        dataBuffer.index[dataname][key] = value
                    }
                        
                }
            }
        }

        const generateDimensions = function (json, dataname) {
            if(!dataBuffer.dimensions.hasOwnProperty(dataname)){
                dataBuffer.dimensions[dataname] = []
                //console.log(typeof dataBuffer.data[filename][0], dataBuffer.data[filename][0])
                
                dataBuffer.dimensions[dataname] = Object.keys(dataBuffer.data[dataname][0])
            }
            //need to improve
        }
        /*-----------------------------------------------------------------------------------------*/
        if(datatype == 'csv'){
            //使用插件convert-csv-to-json读入csv并转成json赋id
            let json = csvToJson.getJsonFromCsv(path.join(__dirname, staticBasePath + dataname + '.' + datatype));
            json = jsonAddId(json);
            addRawDataToBuffer(json);
            createIndex(json, dataname);
            generateDimensions(json, dataname);
            console.log(dataname + "." + datatype + " successful loading~")
        } else if(datatype == 'json'){
            //使用fs读入json
            fs.readFile(path.join(__dirname, staticBasePath + dataname + '.' + datatype), 'utf-8', function(err, data) {
                if (err) throw err;

                //处理字符串首字符问题
                let firstCode = data.charCodeAt(0)
                if (firstCode < 0x20 || firstCode > 0x7f){
                    data = data.substring(1)
                }
                
                let json = JSON.parse(data);

                json = jsonAddId(json);
                addRawDataToBuffer(json);
                createIndex(json, dataname);
                generateDimensions(json, dataname);
                console.log(dataname + "." + datatype + " successful loading~")
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
    sortData: function(filename){
        dataName = filename.split('.')[0]
    }
}

const dataBuffer = {
    data: {},
    index: {},
    dimensions: {},
    getDataNameList: function(){
        let l = []
        for(var i in this.data){
            l.push(i);
        }
        return l;
    },
    getDataDimensions: function(dataName){
        if(this.dimensions.hasOwnProperty(dataName)) return this.dimensions[dataName]
    },
    getData: function(dataName){
        if(this.data.hasOwnProperty(dataName)) return this.data[dataName]
    },
    getIndex: function(dataName){
        if(this.index.hasOwnProperty(dataName)) return this.index[dataName]
    }
}

module.exports = {dataProcess, dataBuffer};
