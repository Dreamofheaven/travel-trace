import React, {useState, useEffect} from 'react';
import axios from 'axios';
import "../styles/All.css";


function All() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access');
    console.log(token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchData = async () => {
      const result = await axios.get('http://127.0.0.1:8000/articles/');
      setArticles(result.data);
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
          <img src={article.image} />
        </div>
      ))}
    </div>
  );
}

export default All;




/////////////////////////////////
// function All() {
//   const [articles, setArticles] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem('access'); // 로컬 스토리지에서 인증 토큰 가져오기
//       console.log(token)
//       const result = await axios.get('http://127.0.0.1:8000/articles/', {
//         headers: {
//           Authorization: `Bearer ${token}`
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