import React from 'react';
import styled from 'styled-components';
import { SmileOutlined } from '@ant-design/icons';

const FooterDIV = styled.div`
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

function Footer() {
  return (
    <FooterDIV>
     <p>Happy Coding <SmileOutlined /></p> 
  </FooterDIV>
  )
}

export default Footer