import React, {useContext, useState} from 'react'
import { useHttp } from "../hooks/http.hook";
import {useHistory} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'

export const CreatePage = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
  const { loading, error, request, clearError } = useHttp();
  const [link, setLink] = useState("");

  const pressHandler = async (event) => {
    if (event.key === "Enter") {
      try {
        const data = await request("/api/link/generate", "POST", {
          from: link,
        },{
            Authorization: `Bearer ${auth.token}`} );
        history.push(`/detail/${data.link._id}`, {
            Authorization: `Bearer ${auth.token}`})
      } catch (error) {}
    }
  };
  return (
    <div className="row">
      <div className="col s8 offset-s2" style={{ paddingTop: "2 rem" }}>
        <div className="input-field  ">
          <input
            id="link"
            className="validate"
            type="text"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            onKeyPress={pressHandler}
          />
          <label for="link">Link</label>
          <span
            className="helper-text"
            data-error="wrong"
            data-success="right"
          />
        </div>
      </div>
    </div>
  );
};
