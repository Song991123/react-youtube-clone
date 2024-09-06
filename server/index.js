import express from 'express';
import mongoose from 'mongoose';
import User from './models/User.js';
import config from './config/key.js';
import cookieParser from 'cookie-parser';
import auth from './middleware/auth.js';

const app = express();
const port = 5000;


mongoose.connect(config.mongoURI).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/hello', (req, res) => res.send('Hi'));
// 회원가입 기능
app.post('/users/register', async (req, res) => {
    const user = new User(req.body);
    try {
        const userInfo = await user.save();
        res.status(200).json({ success: true, userInfo });
    } catch (err) {
        res.json({ success: false, err });
    }
});

app.post('/users/login', async (req, res) => {
    try {
        // 1. 요청된 이메일을 DB에서 찾기
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            });
        }

        // 2. 요청된 이메일이 DB에 있다면, 비밀번호가 맞는 비밀번호인지 확인
        const isMatch = await user.comparePassword(req.body.password);

        if (!isMatch) {
            return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });
        }

        // 3. 비밀번호가 일치하면 토큰 생성
        const updatedUser = await user.generateToken();

        // 클라이언트에게 토큰을 쿠키로 설정
        res.cookie('x_auth', user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id });


    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.get('/users/auth', auth, async (req, res) => {
    // 미들웨어를 통과했다 = Authentication이 true다.
    res.status(200).json({
        _id: req.user._id,
        isAdmin : req.user.role === 0 ? false : true,
        isAuth: true,
        email : req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    });
})

app.get('/users/logout', auth, async (req, res) => {
    try {
        await User.findOneAndUpdate({_id:req.user._id}, {token:""});
        return res.status(200).send({success:true});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.listen(port, () => console.log(`Server running at http://127.0.0.1:${port}/`));