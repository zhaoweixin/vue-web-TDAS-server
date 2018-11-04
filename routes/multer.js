const bytes = require('bytes')
const multer = require('multer')
const dataprocess = require('../models/dataprocess')
// 配置multer
// 详情请见https://github.com/expressjs/multer
var uploadFolder = './upload/'

const storage = multer.diskStorage({
  destination: (req, file, cb) => { // 设置上传目录
    cb(null, uploadFolder)
  },
  filename: (req, file, cb) => { // 上传更改名称
    console.log(file.fieldname)
    cb(null, file.fieldname + '.jpg')
  }
})

const upload = multer({
  storage: storage,
  fileFilter: function (req, files, callback) {
        // 只允许上传csv|json格式的文件
    var type = '|' + files.mimetype.slice(files.mimetype.lastIndexOf('/') + 1) + '|'
    var fileTypeValid = '|csv|json|'.indexOf(type) !== -1
    callback(null, !!fileTypeValid)
  }
})

module.exports = upload