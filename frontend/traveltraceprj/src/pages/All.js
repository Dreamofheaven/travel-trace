import React, {useState, useEffect} from 'react';
import axios from 'axios';

function All() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
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
        </div>
      ))}
    </div>
  );
}

export default All;