import React, {useState} from 'react';
import { PlusCircleFill, X} from 'react-bootstrap-icons'
import "../styles/Images.css";

function Images() {
  const [showImages, setShowImages] = useState([]);

  // 이미지 상대경로 저장
  const handleAddImages = (event) => {
    console.log(event);
    const imageLists = event.target.files;
    let imageUrlLists = [...showImages];

    for (let i = 0; i < imageLists.length; i++) {
      const currentImageUrl = URL.createObjectURL(imageLists[i]);
      imageUrlLists.push(currentImageUrl);
    }

    if (imageUrlLists.length > 10) {
      imageUrlLists = imageUrlLists.slice(0, 10);
    }

    setShowImages(imageUrlLists);
  };

  // x버튼 클릭 시 이미지 삭제
  const handleDeleteImage = (id) => {
    setShowImages(showImages.filter((_, index) => index !== id));
  };

  return (
    <div className='add_picture'>
      <label htmlFor="input-file" className='add_btn' type="button" onChange={handleAddImages}>
        <input type="file" className='add_btn2' id="input-file" multiple />
        <PlusCircleFill className='text-self-center' fill="black" />
        <span className='ms-2'>사진추가</span>
      </label>
      {/* // 저장해둔 이미지들을 순회하면서 화면에 이미지 출력 */}
      {showImages.map((image, id) => (
        <div className='img_container' key={id}>
          <img src={image} className='trip_img' alt={`${image}-${id}`} />
          <X className='x_icon' onClick={() => handleDeleteImage(id)} />
        </div>
      ))}
    </div>
  );
};
export default Images;