import express ,{Request,Response} from 'express';
import multer from 'multer';
import path from 'path';
import { requireAuth,sellerOnly } from '@karkaushal/common';
const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
   
   const fileName=`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(
      null,fileName
      
    )
  },
})
console.log(__dirname);
function checkFileType(file:any,cb:any) {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Images only!')
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})


router.post('/api/upload',requireAuth,sellerOnly,upload.single('image'),(req:Request, res:Response) => {
  const url = req.protocol + '://' + req.get('host');
  const newImgUrl=url+'/'+req.file?.path;
   console.log(newImgUrl);
   console.log(url)
  res.send({
    path:newImgUrl
  })
});

export {router as  uploadImageRouter };