import React, {useState} from 'react';
import { PlusCircleFill, Trash3, Images} from 'react-bootstrap-icons'
import "../styles/Images.css";

function ImageFuntion({images, setShowImages}) {
  // const [showImages, setShowImages] = useState([]);

  // 이미지 상대경로 저장
  const handleAddImages = (event) => {
    console.log(event);
    const imageLists = event.target.files;
    let imageUrlLists = [...images];
    const formData = new FormData();

    for (let i = 0; i < imageLists.length; i++) {
      const file = imageLists[i]
      const currentImageUrl = URL.createObjectURL(file);
      imageUrlLists.push(currentImageUrl);
      formData.append('images', file);
    }

    if (imageUrlLists.length > 10) {
      imageUrlLists = imageUrlLists.slice(0, 10);
    }

    setShowImages(imageUrlLists);
  };

  // x버튼 클릭 시 이미지 삭제
  const handleDeleteImage = (id) => {
    setShowImages(images.filter((_, index) => index !== id));
  };

  return (
    <div className='add_picture'>
      <label htmlFor="input-file" className='add_btn' type="button">
        <input type="file" className='add_btn2' id="input-file" multiple onChange={handleAddImages} />
        <span className='ms-2'><Images className='images_icon' /></span>
        {/* <PlusCircleFill className='text-self-center ms-2 pb-1' fill="black" /> */}
      </label>
      {/* 저장해둔 이미지들을 순회하면서 화면에 이미지 출력 */}
      <div className='order_picture'>
        {images.map((image, id) => (
          <div className='img_container' key={id}>
            <img src={image} className='trip_img' alt={`${image}-${id}`} />
            <Trash3 className='trash_icon' onClick={() => handleDeleteImage(id)} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default ImageFuntion;