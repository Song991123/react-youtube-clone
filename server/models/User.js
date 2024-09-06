import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  let user = this;
  if (user.isModified("password")) {
    // 비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else{
    next();
  }
});

/**
 * @description
 * 사용자 인스턴스에서 비밀번호를 비교하는 메서드
 * - 사용자가 입력한 비밀번호(plainPassword)를 암호화된 비밀번호(this.password)와 비교
 * - bcrypt를 사용하여 비밀번호를 비교하며, 결과를 반환
 * 
 * @param {string} plainPassword - 사용자가 입력한 비밀번호 (일반 텍스트)
 * 
 * @returns {Promise<boolean>} 비밀번호가 일치하는지 여부 (boolean)
 *   - 프로미스가 해결되면 비밀번호가 일치하는지 여부 (boolean)
 *   - 프로미스가 거부되면 에러 객체
 * 
 * @throws {Error} 비밀번호 비교 중 오류가 발생할 경우
 */
userSchema.methods.comparePassword = async function(plainPassword) {
  try {
    // plainPassword == 암호화된 비밀번호
    const isMatch = await bcrypt.compare(plainPassword, this.password);
    return isMatch;
  } catch (err) {
    throw new Error('비밀번호 비교 중 오류 발생');
  }
};

/**
 * @description
 * 사용자 인스턴스에서 JSON Web Token(JWT)을 생성하는 메서드
 * - 사용자의 `_id`와 'secretToken'을 사용하여 JWT를 생성
 * - 생성된 토큰을 사용자 인스턴스의 `token` 속성에 저장
 * - 사용자 인스턴스를 데이터베이스에 저장하여 변경 사항을 적용
 * 
 * @returns {Promise<Object>} 업데이트된 사용자 인스턴스
 *   - 프로미스가 해결되면 저장된 사용자 인스턴스 (토큰이 포함된)
 *   - 프로미스가 거부되면 에러 객체
 * 
 * @throws {Error} 토큰 생성 및 저장 중 오류가 발생할 경우
 */
userSchema.methods.generateToken = async function() {
  let user = this;

  // jsonwebtoken을 이용해서 token을 생성하기
  let token = jwt.sign({ _id: user._id }, 'secretToken'); // (해당 유저의 _id + 'secretToken' = Token)
  user.token = token;
  
  // save()가 프로미스를 반환하므로, async/await로 처리
  try {
    const updatedUser = await user.save();
    return updatedUser;
  } catch (err) {
    throw err; // 에러를 호출하는 곳으로 전파
  }
}

/**
 * @description
 * 주어진 토큰을 기반으로 데이터베이스에서 사용자를 찾는 정적 메서드
 * - 클라이언트가 제공한 토큰을 복호화하여 사용자 `_id`를 추출
 * - 추출된 `_id`와 제공된 토큰을 데이터베이스에서 확인하여 일치하는 사용자 문서 검색
 * 
 * @param {string} token - 클라이언트에서 제공한 JSON Web Token (JWT)
 * 
 * @returns {Promise<Object|null>} 사용자 문서
 *   - 프로미스가 해결되면 검색된 사용자 문서 (일치하는 토큰을 가진 사용자) 또는 `null`
 *   - 프로미스가 거부되면 에러 객체
 * 
 * @throws {Error} 토큰 복호화 또는 사용자 검색 중 오류가 발생할 경우
 */
userSchema.statics.findByToken = async function(token) {
  // 토큰을 decode 한다.
  //유저 아이디를 이용해 유저를 찾은 후, 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하나 확인
  try{
    const decoded = jwt.verify(token, 'secretToken');
    return this.findOne({ "_id" : decoded, "token" : token});
  }catch(err){
    throw err;
  }
}

const User = mongoose.model("User", userSchema);
export default User;
