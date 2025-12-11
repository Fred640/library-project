import React from "react";
import Author from "./Author";
import { useState } from "react";
import { apiService } from '../../services/api.js';
import { useEffect } from "react";

const AuthorsList = () => {

  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAuthors();
      setAuthors(response.data);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке авторов');
      console.error('Ошибка API:', err);
    } finally {
      setLoading(false);
    }
  };

    const sliceFunc = (array, size) => {
    const rows = []
    for (let i = 0; i < array.length; i += size) {
      rows.push(array.slice(i, i + size))
    }
    return(rows)
  }


  let A = sliceFunc(authors, 6)
    return(
        <div className="container">
        {A.map((row, index) => 
          <div className="row justify-content-center"  style={{marginBottom:"7px", marginTop:"7px"}} key={index}> {row.map((author)=> 
            <div className="col-lg-2 col-sm-4 col-md-2 col-4" style={{padding:5}}>
              <Author author={author} key={author.id} />
            </div>)}
          </div>)}
      </div>
    )
}

export default AuthorsList