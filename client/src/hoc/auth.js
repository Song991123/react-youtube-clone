import React, {useEffect} from "react";
import {useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from '../_actions/user_action';
/**
 * Authentication HOC (Higher Order Component)
 * 특정 컴포넌트에 대한 접근 제어를 설정하는 HOC.
 * 
 * @param {React.ComponentType} SpecificComponent - 인증이 필요한 컴포넌트
 * @param {boolean|null} option - null: 모두 접근 가능, true: 로그인한 사용자만 접근 가능, false: 로그인한 사용자는 접근 불가
 * @param {boolean} adminRoute - true: 관리자만 접근 가능, false: 일반 사용자도 접근 가능
 * @returns {React.ComponentType} - 인증 체크 후 접근이 허용된 컴포넌트 렌더링
 */
export default function (SpecificComponent, option, adminRoute) {
    function AuthenticationCheck(props){
        const navigate = useNavigate();
        const dispatch = useDispatch();
        useEffect(() => {
            dispatch(auth()).then(response => {
                console.log(option);
                console.log(response);
                // 로그인 하지 않은 상태
                if(!response.payload.isAuth){
                    if(option){
                        navigate('/login');
                    }
                } else{
                    //로그인 한 상태
                    if(adminRoute && !response.payload.isAdmin){
                        navigate('/');
                    } else{
                        if(option === false){ navigate('/'); }
                    }
                }
            })
        }, []);
        return(
            <SpecificComponent {...props}/>
        )
    }


    return AuthenticationCheck;
}