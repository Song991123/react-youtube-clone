import React from 'react';
import {Menu} from 'antd';

const {SubMenu, ItemGroup} = Menu;

function LeftMenu(props) {
    return (
        <Menu mode={props.mode}>
            <Menu.Item key="home">
                <a href="/">Home</a>
            </Menu.Item>
            <SubMenu title="Blogs" className='custom-submenu'>
                <ItemGroup title="Item 1">
                    <Menu.Item key="option1">Option 1</Menu.Item>
                    <Menu.Item key="option2">Option 2</Menu.Item>
                </ItemGroup>
                <ItemGroup title="Item 2">
                    <Menu.Item key="option3">Option 3</Menu.Item>
                    <Menu.Item key="option4">Option 4</Menu.Item>
                </ItemGroup>
            </SubMenu>
        </Menu>
    );
}

export default LeftMenu;
