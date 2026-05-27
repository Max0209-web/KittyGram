import React from "react";
import { Link } from "react-router-dom";

import defaultImg from "../../images/default-kitty.jpg";

import styles from "./main-card.module.css";

export const MainCard = ({
  cardId,
  name = "",
  date = "",
  color = "Бежевый",
  status = "lost",
  place = "",
  img,
  extraClass = "",
}) => {
  const colorText =
    color === "black" ||
    color === "saddlebrown" ||
    color === "gray" ||
    color === "darkgray"
      ? "white"
      : "primary";

  const statusText = {
    lost: "Потерян",
    found: "Найден",
    returned: "Дома",
  }[status] || "Потерян";

  // Функция для получения URL изображения
  const getImageUrl = (image) => {
    if (!image) return defaultImg;
    // image уже приходит с полным URL с бэкенда
    return image;
  };

  return (
    <article className={`${styles.content} ${extraClass}`}>
      <Link className={styles.link} to={`/cats/${cardId}`}>
        <img
          className={styles.img}
          src={getImageUrl(img)}
          alt="Фото котика."
          onError={(e) => {
            e.target.src = defaultImg;
          }}
        />
      </Link>
      <div className={styles.data_box}>
        <span className={`${styles.status} ${styles[status] || ""}`}>
          {statusText}
        </span>
        <div className={styles.name_n_date_box}>
          <p
            className={`text text_type_h3 text_color_primary mt-8 mb-3 ${styles.name}`}
          >
            {name}
          </p>
          <p
            className={`text text_type_medium-20 text_color_secondary mb-8 ${styles.date}`}
          >
            {place || `Год рождения: ${date}`}
          </p>
        </div>
        <div
          className={styles.cat_color_box}
          style={{ backgroundColor: color }}
        >
          <p
            className={`text text_type_medium-20 text_color_${colorText} ${styles.cat_color}`}
          >
            {color}
          </p>
        </div>
      </div>
    </article>
  );
};
