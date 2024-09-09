import express from 'express';
import Video from '../models/Video.js';
import auth from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Ffmpeg from 'fluent-ffmpeg';

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

// 썸네일 라우트 
router.post("/thumbnail", (req, res) => {
    // 썸네일 생성하고 비디오 러닝타임도 가져오기 ==========
    let filePath     = "";
    let fileDuration = "";

    Ffmpeg.setFfmpegPath("C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe");

    // -------------------- 비디오 정보 가져오기 --------------------
    Ffmpeg.ffprobe(req.body.url, function(err, metadata){
        console.dir(metadata); // all metadata
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration; // 총 비디오 시간
    })

    //-------------------- 썸네일 생성 --------------------
    Ffmpeg(req.body.url)   // 입력파일 지정
    // 파일 이름 생성
    .on('filenames', function(filenames){
        console.log('Will generate ' + filenames.join(', '));
        console.log(filenames)

        filePath = "uploads/thumbnails/" + filenames[0];
    })
    // 모든걸 다 생성한 후 어떻게 할 것인지
    .on('end', function () {
        console.log('Screenshots taken');
        return res.json({ success: true, url: filePath, fileDuration: fileDuration});
    })
    // 에러가 떴을 때 
    .on('error', function(err){
        console.error(err);
        return res.json({success: false, err});
    })
    .screenshots({
        // Will take screens at 20%, 40%, 60% and 80% of the video
        count: 3,
        folder: 'uploads/thumbnails',
        size:'320x240',
        // %b input basename ( filename w/o extension )
        filename:'thumbnail-%b.png'
    });
});



export default router;