import util from 'util';
import multer from 'multer';
import GridFsStorage from 'multer-gridfs-storage';

export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = new GridFsStorage({
  url: process.env.DATABASE_URL,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ['image/png', 'image/jpeg'];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-bezkoder-${file.originalname}`;
      return filename;
    }
    return {
      bucketName: 'photos',
      filename: `${Date.now()}-bezkoder-${file.originalname}`,
    };
  },
});

const uploadFile = multer({ storage: storage }).single('file');
const uploadFilesMiddleware = util.promisify(uploadFile);
export default uploadFilesMiddleware;
