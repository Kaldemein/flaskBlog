import './App.css';
import { useState } from 'react';
import React from 'react';

function App() {
  const [articles, setArticles] = useState([]);

  React.useEffect(() => {
    fetch('http://localhost:5000/get')
      .then((response) => response.json())
      .then((response) => setArticles(response))
      .catch((err) => console.log(err));
  });

  return (
    <div className="App">
      {articles.map((article) => {
        return (
          <div>
            <h1>{article.title}</h1>
            <p>{article.body}</p>
          </div>
        );
      })}
    </div>
  );
}

export default App;
