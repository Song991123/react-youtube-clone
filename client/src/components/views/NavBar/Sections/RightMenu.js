import React from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../../Config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function RightMenu({ mode }) {
    const navigate = useNavigate();
    const user = useSelector(state => state.user);

    const logoutHandler = async () => {
        try {
            const response = await axios.get(`${USER_SERVER}/logout`);
            if (response.status === 200) {
                navigate('/login');
            } else {
                alert('Log Out Failed');
            }
        } catch (error) {
            console.error('Logout error', error);
            alert('Log Out Failed');
        }
    };

    const items = user.userData && !user.userData.isAuth ? [
        {
            key: 'mail',
            label: <a href="/login">Signin</a>,
        },
        {
            key: 'app',
            label: <a href="/register">Signup</a>,
        },
    ] : [
        {
            key: 'upload',
            label: <a href="/video/upload">Video</a>,
        },
        {
            key: 'logout',
            label: <a onClick={logoutHandler}>Logout</a>,
        },
    ];

    return <Menu mode={mode} items={items} />;
}

export default RightMenu;
