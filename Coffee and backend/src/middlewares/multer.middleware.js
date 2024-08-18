/*import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage, 
}) */

import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./public/temp";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Directory created: ${dir}`);
    }
    console.log(`Saving file to: ${dir}`);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}_${file.originalname}`;
    console.log(`Generated filename: ${filename}`);
    cb(null, filename);
  }
});

export const upload = multer({ storage });
