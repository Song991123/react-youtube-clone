import React from 'react';
import {Menu} from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../../Config';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

const {Item} = Menu;

function RightMenu({mode}) {
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
    if (user.userData && !user.userData.isAuth) {
        return (
            <Menu mode={mode}>
                <Menu.Item key="mail">
                    <a href="/login">Signin</a>
                </Menu.Item>
                <Menu.Item key="app">
                    <a href="/register">Signup</a>
                </Menu.Item>
            </Menu>
        );
    } else {
        return (
            <Menu mode={mode}>
                <Menu.Item key="upload">
                    <a href="/video/upload">Video</a>
                </Menu.Item>
                <Menu.Item key="logout">
                    <a onClick={logoutHandler}>Logout</a>
                </Menu.Item>
            </Menu>
        );
    }
}

export default RightMenu;
