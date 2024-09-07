import React, { useState } from 'react'
import styled from 'styled-components'
import { Typography, Button, Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Dropzone from 'react-dropzone';
import { PlusOutlined } from '@ant-design/icons';  // Plus 아이콘 임포트
import axios from 'axios';

const { Title } = Typography;

const VideoDiv = styled.div`
  max-width: 700px;
  margin: auto;
  padding-top: 6rem;
`;

const TitleDiv = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const MediaDiv = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem; /* 간격 조절 */
`;

const DropMediaDiv = styled.div`
  width: 300px;
  height: 240px;
  display: flex;
  border: 1px solid lightgray;
  align-items: center;
  justify-content: center;
`;

const FormItem = styled.div`
  margin-bottom: 2rem; /* 각 입력 요소 간의 간격 */
`;

const SelectDiv = styled.div`
  margin-bottom: 2rem;
`;

const PrivateOptions = [
  { value: 0, label:"Private" },
  { value: 1, label:"Public"  }
]

const CategoryOptions = [
  { value: 0, label: "Film & Animation" },
  { value: 1, label: "Autos & Vehicles" },
  { value: 2, label: "Music"            },
  { value: 3, label: "Pets & Animals"   },
]

function VideoUploadPage() {
  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Private, setPrivate] = useState(0);
  const [Catetory, setCatetory] = useState("Film & Animation");

  const onTitleChange = (e) => {setVideoTitle(e.currentTarget.value)};
  const onDescriptionChange = (e) => {setDescription(e.currentTarget.value)};
  const onPrivateChange = (e) => {setPrivate(e.target.value)};
  const onCategoryChange = (e) => {setCatetory(e.target.value)};

  const onDrop = async(files) => {
    let formData = new FormData;
    // 서버로 보낼 때 같이 보내기 위한 header
    const config = {
      header : {'content-type' : 'multipart/form-data'}
    };
    formData.append("file", files[0]);

    try {
      // 서버로 파일 전송
      const response = await axios.post('/api/video/uploadfiles', formData, config);
    
      // 성공적으로 업로드된 후 처리할 코드
      console.log('File uploaded successfully:', response.data);

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  return (
    <VideoDiv className='content'>
      <TitleDiv>
        <Title level={2}>Upload Video</Title>
      </TitleDiv>
      <Form>
        <MediaDiv>
          {/* Dropzone */}
          <Dropzone onDrop={onDrop} multiple={false} maxSize={1000000000}>
            {({ getRootProps, getInputProps }) => (
              <DropMediaDiv {...getRootProps()}>
                <input {...getInputProps()} />
                <PlusOutlined style={{ fontSize: '3rem' }} />
              </DropMediaDiv>
            )}
          </Dropzone>
          {/* Thumbnail */}
          <div>
            <img src='' alt="" />
          </div>
        </MediaDiv>

        {/* Title */}
        <FormItem>
          <label>Title</label>
          <Input value={VideoTitle} onChange={onTitleChange} />
        </FormItem>

        {/* Description */}
        <FormItem>
          <label>Description</label>
          <TextArea value={Description} onChange={onDescriptionChange} />
        </FormItem>

        {/* Privacy Setting */}
        <SelectDiv>
          <select onChange={onPrivateChange}>
            {PrivateOptions.map((item, index) => (
              <option key={index} value={item.value}>{item.label}</option>
            ))}
          </select>
        </SelectDiv>

        {/* Category Setting */}
        <SelectDiv>
          <select onChange={onCategoryChange}>
            {CategoryOptions.map((item, index) => (
              <option key={index} value={item.value}>{item.label}</option>
            ))}
          </select>
        </SelectDiv>

        {/* Submit Button */}
        <Button type='primary' size='large'>Submit</Button>
      </Form>
    </VideoDiv>
  );
}

export default VideoUploadPage;
