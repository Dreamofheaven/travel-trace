import React, {useState, useEffect} from 'react';
import axios from 'axios';
import "../styles/All.css";


function All() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    console.log(token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchData = async () => {
<<<<<<< HEAD
      try {
        const token = localStorage.getItem('access_token'); // 로컬 스토리지에서 인증 토큰 가져오기
        const response = await axios.get('http://127.0.0.1:8000/articles/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArticles(response.data);
      } catch (error) {
        console.error(error);
      }
=======
      const result = await axios.get('http://127.0.0.1:8000/articles/');
      setArticles(result.data);
>>>>>>> 62891ba296491d1fd857ac5167ce506bc4947ff3
    };

    fetchData();
  }, []);

  return (
    <div>
      {articles.map(article => (
        <div key={article.id}>
          <h2>{article.title}</h2>
          <h2>{article.user}</h2>
          <h2>{article.image}</h2>
          <img src={article.image} alt="Article" />
        </div>
      ))}
    </div>
  );
}

export default All;
<<<<<<< HEAD
=======




/////////////////////////////////
>>>>>>> 62891ba296491d1fd857ac5167ce506bc4947ff3
// function All() {
//   const [articles, setArticles] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
<<<<<<< HEAD
//       const token = localStorage.getItem('access_token'); // 로컬 스토리지에서 인증 토큰 가져오기
//       const result = await axios.get('http://127.0.0.1:8000/articles/', {
//         headers: {
//           Authorization: `Bearer ${token}` 
=======
//       const token = localStorage.getItem('access'); // 로컬 스토리지에서 인증 토큰 가져오기
//       console.log(token)
//       const result = await axios.get('http://127.0.0.1:8000/articles/', {
//         headers: {
//           Authorization: `Bearer ${token}`
>>>>>>> 62891ba296491d1fd857ac5167ce506bc4947ff3
//         }
//       });
//       setArticles(result.data);
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       {articles.map(article => (
//         <div key={article.id}>
//           <h2>{article.title}</h2>
//           <h2>{article.user}</h2>
//           <h2>{article.image}</h2>
//           <img src={article.image} />
//         </div>
//       ))}
//     </div>
//   );
// }

// export default All;