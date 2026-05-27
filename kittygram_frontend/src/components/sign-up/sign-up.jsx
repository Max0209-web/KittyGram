import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { registerUser } from "../../utils/api";
import { ButtonForm } from "../ui/button-form/button-form";
import { Input } from "../ui/input/input";
import styles from "./sign-up.module.css";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
  const newErrors = {};

  if (!formData.username.trim()) {
    newErrors.username = "Имя пользователя обязательно";
  }

  if (!formData.password) {
    newErrors.password = "Пароль обязателен";
  } else if (formData.password.length < 8) {
    newErrors.password = "Пароль должен содержать минимум 8 символов";
  }

  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Пароли не совпадают";
  }

  return newErrors;
};

  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    registerUser(formData.username, formData.password)
      .then(() => {
        history.push("/signin");
      })
      .catch((err) => {
        if (err.username) {
          setErrors({ username: "Пользователь с таким именем уже существует" });
        } else {
          setErrors({ general: "Ошибка регистрации. Попробуйте ещё раз." });
        }
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2 className={styles.title}>Зарегистрируйтесь для доступа к Kittygram!</h2>

        <div className={styles.field}>
          <label className={styles.label}>Имя пользователя</label>
          <Input
            name="username"
            type="text"
            placeholder="Введите имя пользователя"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Пароль</label>
          <Input
            name="password"
            type="password"
            placeholder="Введите пароль"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          <p className={styles.hint}>Пароль должен содержать минимум 8 символов</p>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Подтверждение пароля</label>
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Повторите пароль"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
        </div>

        {errors.general && (
          <div className={styles.errorGeneral}>{errors.general}</div>
        )}

        <div className={styles.checkboxField}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" defaultChecked />
            <span>
              Регистрируясь на нашем сайте, вы обещаете постить в сервис только котов, никаких собак.
            </span>
          </label>
        </div>

        <ButtonForm text="Зарегистрироваться" onClick={handleSubmit} />

        <div className={styles.footer}>
          <span className={styles.footerText}>Уже зарегистрированы?</span>
          <Link to="/signin" className={styles.link}>Войти</Link>
        </div>
      </div>
    </div>
  );
};