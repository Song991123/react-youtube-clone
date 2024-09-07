import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config/key.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/users.js';
import videoRoutes from './routes/video.js';

const app = express();

//mongoose 연결
mongoose
    .connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// CORS 미들웨어
app.use(cors());
// JSON과 URL 인코딩된 데이터 처리
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// 쿠키 파서 미들웨어
app.use(cookieParser());

// 라우트 설정
app.use('/users', userRoutes);
app.use('/video', videoRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        // API 요청과 정적 파일 요청이 충돌하지 않도록 확인
        res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
    });
}

// 업로드된 파일 접근
app.use('/uploads', express.static('uploads'));

// 서버 설정
const port = process.env.PORT || 5000;
app.listen(
    port,
    () => console.log(`Server running at http://127.0.0.1:${port}/`)
);