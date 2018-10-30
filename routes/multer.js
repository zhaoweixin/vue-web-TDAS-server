const bytes = require('bytes')
const multer = require('multer')
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
  limits: {
    fileSize: bytes('1MB') // 限制文件在2MB以内，或者2048KB
  },
  fileFilter: function (req, files, callback) {
        // 只允许上传jpg|png|jpeg|gif格式的文件
    var type = '|' + files.mimetype.slice(files.mimetype.lastIndexOf('/') + 1) + '|'
    var fileTypeValid = '|jpg|png|jpeg|gif|'.indexOf(type) !== -1
    callback(null, !!fileTypeValid)
  }
})

module.exports = upload