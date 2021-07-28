import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";

export const AuthPage = () => {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const { loading, error, request, clearError } = useHttp();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.type]: event.target.value });
  };

  const registerHandler = async () => {
    try {
      // console.log(`Data: ${data}`)
      const data = await request("/api/auth/register", "POST", { ...form }, );
      message(data.message);
    } catch (e) {}
  };

  const loginHandler = async () => {
    try {
      const data = await request("/api/auth/login", "POST", { ...form },);
      auth.login(data.token, data.userId);
      message(data.token);
    } catch (e) {}
  };
  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>Авторизация</h1>

        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Авторизация</span>
            <div className="input-field ">
              <input
                id="email"
                type="email"
                className="yellow-input"
                // value={form.email}
                onChange={changeHandler}
              />
              <label for="email">Email</label>
              <span
                className="helper-text"
                data-error="wrong"
                data-success="right"
              />
            </div>
            <div className="input-field ">
              <input
                id="password"
                type="password"
                className="yellow-input"
                // value={form.password}
                onChange={changeHandler}
              />
              <label for="password">Password</label>
            </div>
          </div>
          <div className="card-action">
            <button
              className="btn yellow darken-4"
              style={{ marginRight: 10 }}
              onClick={loginHandler}
            >
              Войти
            </button>
            <button
              className="btn grey lighteen-1"
              onClick={registerHandler}
              disabled={loading}
            >
              Регистрация
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
