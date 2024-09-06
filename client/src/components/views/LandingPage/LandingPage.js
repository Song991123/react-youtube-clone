import React, {useEffect} from 'react';
import axios from "axios";
import { FaCode } from "react-icons/fa";


function LandingPage() {
  useEffect(() => {
    axios.get('/api/hello').then(response => console.log(response)).catch(error => {
      if (error.response) {
        // 서버가 2xx 외의 상태로 응답한 경우
        console.error('Response error:', error.response.status, error.response.data);
      } else if (error.request) {
        // 요청이 전송되었으나 응답이 없는 경우
        console.error('No response received:', error.request);
      } else {
        // 요청 설정 중에 오류가 발생한 경우
        console.error('Error setting up request:', error.message);
      }
    });
  },[]);
  
  return (
    <>
      <div className="app">
        <FaCode style={{ fontSize: '4rem' }} /><br />
        <span style={{ fontSize: '2rem' }}>Let's Start Coding!</span>
      </div>
    </>
  )
}

export default LandingPage