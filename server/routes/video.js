import express from 'express';
import Video from '../models/Video.js';
import auth from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();


//=================================
//             Video
//=================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const uniqueName = `${uuidv4()}${fileExtension}`;
        cb(null, uniqueName);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true);
    }
})

const upload = multer({ storage: storage }).single("file");

// 파일 업로드 라우트
router.post("/uploadfiles", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            // 오류 발생 시, Express의 오류 처리기로 넘기기
            return res.json({success:false, err});
        }
        // 파일 업로드 성공 시
        res.json({success:true, url: req.file.path, fileName: req.file.filename});
    });
});



export default router;