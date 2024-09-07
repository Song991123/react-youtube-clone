import React from 'react';
import {Menu} from 'antd';

const items = [
    {
        key: 'home',
        label: <a href="/">Home</a>
    }, {
        key: 'blogs',
        label: 'Blogs',
        children: [
            {
                key: 'itemGroup1',
                label: 'Item 1',
                children: [
                    {
                        key: 'option1',
                        label: 'Option 1'
                    }, {
                        key: 'option2',
                        label: 'Option 2'
                    }
                ]
            }, {
                key: 'itemGroup2',
                label: 'Item 2',
                children: [
                    {
                        key: 'option3',
                        label: 'Option 3'
                    }, {
                        key: 'option4',
                        label: 'Option 4'
                    }
                ]
            }
        ]
    }
];

function LeftMenu(props) {
    return (<Menu mode={props.mode} items={items}/>);
}

export default LeftMenu;
