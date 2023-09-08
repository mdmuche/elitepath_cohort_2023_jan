const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/tmp/my-uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  const upload = multer({ 
    storage: storage, 
    limits: 3 * (1024 * 1024),
    fileFilter: function fileFilter (req, file, cb) {

        // The function should call `cb` with a boolean
        // to indicate if the file should be accepted
        if(file.mimetype == "image/png" || file.mimetype == "image/jpeg") {

        // To accept the file pass `true`, like so:
        cb(null, true)
      

    } else {
        // To reject this file pass `false`, like so:
        cb(null, false)
    
      
        // You can always pass an error if something goes wrong:
        cb(new Error(
            `Error: i dont accept ${file.mimetype}. i only accept jpeg or png `))
      
      }


    }
})

module.exports = upload;