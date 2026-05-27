import React from "react";
import { useHistory, NavLink } from "react-router-dom";

import { getUser, loginUser } from "../../utils/api";
import { UserContext } from "../../utils/context";

import logoIcon from "../../images/logo.svg";

import { FormContainer } from "../ui/form-container/form-container";
import { Input } from "../ui/input/input";
import { ButtonForm } from "../ui/button-form/button-form";

import styles from "./sign-in.module.css";

export const SignIn = ({ extraClass = "" }) => {
  const [userData, setUserData] = React.useState({ username: "", password: "" });
  // Исправлено: используем деструктуризацию массива, так как контекст хранит [user, setUser]
  const [, setUser] = React.useContext(UserContext);
  const [errorPassword, setErrorPassword] = React.useState("");
  const [errorLogin, setErrorLogin] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const history = useHistory();

  const onChangeInput = (e) => {
    // Очищаем ошибки при изменении соответствующих полей
    if (e.target.name === "username" && errorLogin) {
      setErrorLogin("");
    }
    if (e.target.name === "password" && errorPassword) {
      setErrorPassword("");
    }

    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const checkValid = () => {
    let isValid = true;

    if (!userData.username.trim()) {
      setErrorLogin("Поле с именем является обязательным");
      isValid = false;
    }

    if (!userData.password) {
      setErrorPassword("Поле с паролем является обязательным");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы

    // Предотвращаем повторную отправку
    if (isLoading) return;

    // Очищаем старые ошибки
    if (errorLogin) setErrorLogin("");
    if (errorPassword) setErrorPassword("");

    if (!checkValid()) return;

    setIsLoading(true);

    loginUser(userData.username, userData.password)
      .then((res) => {
        if (res && res.auth_token) {
          // Сохраняем токен в localStorage, если необходимо
          localStorage.setItem("auth_token", res.auth_token);
          return getUser();
        }
        throw new Error("Не удалось получить токен");
      })
      .then((userRes) => {
        if (userRes && userRes.id) {
          setUser({ id: userRes.id, username: userRes.username });
          history.replace({ pathname: "/" });
        } else {
          throw new Error("Не удалось получить данные пользователя");
        }
      })
      .catch((err) => {
        console.error("Ошибка авторизации:", err);

        // Обработка различных типов ошибок
        if (err.non_field_errors) {
          setErrorPassword("Неправильный логин или пароль");
        } else if (err.message) {
          setErrorPassword(err.message);
        } else {
          setErrorPassword("Ошибка сервера. Попробуйте позже");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <section className={`${styles.content} ${extraClass}`}>
      <img className={`${styles.logo} mb-16`} src={logoIcon} alt="Логотип" />
      <h1
        className={`text text_type_h1 text_color_primary mb-10 ${styles.title}`}
      >
        Вход
      </h1>
      <p
        className={`text text_type_medium-20 text_color_input mb-20 ${styles.subtitle}`}
      >
        Войдите для доступа к Kittygram!
      </p>
      <FormContainer>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            name="username"
            type="text"
            id="signin-username"
            placeholder="Имя"
            value={userData.username}
            onChange={onChangeInput}
            error={errorLogin}
            disabled={isLoading}
          />
          <Input
            name="password"
            type="password"
            id="signin-password"
            placeholder="Пароль"
            value={userData.password}
            onChange={onChangeInput}
            error={errorPassword}
            disabled={isLoading}
          />
          <ButtonForm
            extraClass={styles.btn}
            text={isLoading ? "Вход..." : "Войти"}
            onClick={handleSubmit}
            disabled={isLoading}
          />
          <p className="text text_type_small text_color_input mt-5 mb-5">или</p>
        </form>
        <div className={styles.footer}>
          <NavLink
            to="/signup"
            className={`text text_type_medium-16 text_color_link ${styles.nav}`}
          >
            Ещё не зарегистрированы? Зарегистрируйтесь
          </NavLink>
        </div>
      </FormContainer>
    </section>
  );
};