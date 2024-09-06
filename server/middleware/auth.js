import cookieParser from 'cookie-parser';
import User from '../models/User.js';

/**
 * @description 인증 처리를 하는 미들웨어 함수
 * - 클라이언트의 요청에서 토큰을 추출하고, 유효성을 검사하여 인증 여부를 결정
 * - 인증이 성공하면 요청 객체에 사용자 정보를 추가하고, 다음 미들웨어로 이동
 * - 인증 실패 시 적절한 에러 응답을 클라이언트에 반환
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @param {Function} next - 다음 미들웨어로 넘어가는 함수
 * 
 * @returns {void} - 미들웨어 함수는 반환값이 없음
 */
export default async function auth(req, res, next){
    try{
        // 1. 클라이언트 쿠키에서 토큰을 가져온다
        let token = req.cookies.x_auth;
        // 토큰이 없으면 인증 실패
        if (!token) {
            return res.json({ isAuth: false, error: 'No token provided' });
        }
        // 2. 토큰을 복호화한 후 유저를 찾는다
        const user = await User.findByToken(token);
        // 3. 유저가 있으면 인증 OK
        // 3-1. 유저가 없으면 인증 NO
        if (!user) {
            return res.json({ isAuth: false, error: 'Invalid token' });
        }
        req.token = token;
        req.user = user;
        next();

    }catch(err){
        res.status(500).json({ error: err.message });
    }
}