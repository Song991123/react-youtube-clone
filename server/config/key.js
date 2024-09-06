import devConfig from './dev.js';
import prodConfig from './prod.js';

// 환경 변수 NODE_ENV의 값에 따라 설정을 다르게 적용
// - 'production': 배포 환경에서의 설정 (prodConfig)
// - 그 외의 환경 (예: 개발 환경): 로컬 환경에서의 설정 (devConfig)
const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

export default config;