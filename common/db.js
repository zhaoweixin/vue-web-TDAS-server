var mongoose = require('mongoose');
var url = 'mongodb://localhost/2017414'
mongoose.connect(url, {useNewUrlParser:true}, function(err){
    if(err){
        console.log('Connection Error: ' + err)
    }else{
        console.log('Connection success! url-> http://localhost:3000/api')
    }
});
//连接数据库

module.exports = mongoose;