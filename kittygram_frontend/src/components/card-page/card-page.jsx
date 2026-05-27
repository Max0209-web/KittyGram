import React from "react";
import { useHistory, useParams } from "react-router-dom";

import { deleteCard, getCard } from "../../utils/api";
import { UserContext } from "../../utils/context";

import returnIcon from "../../images/left.svg";
import editIcon from "../../images/edit.svg";
import defaultImg from "../../images/default-kitty.jpg";
import removeIcon from "../../images/trash.svg";

import { ButtonSecondary } from "../ui/button-secondary/button-secondary";
import { ButtonHeader } from "../ui/button-header/button-header";

import styles from "./card-page.module.css";

export const CardPage = ({ data, setData, extraClass = "" }) => {
  const [user] = React.useContext(UserContext);
  const history = useHistory();
  const params = useParams();

  React.useEffect(() => {
    getCard(params.id).then((res) => {
      if (res && res.id) {
        setData(res);
      }
    });
  }, [params.id, setData]);

  const handleReturn = () => {
    setData({});
    history.push("/");
  };

  const handleRemoveCard = () => {
    deleteCard(data.id)
      .then((res) => {
        if (res.status) {
          history.replace({ pathname: "/" });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleEditCard = () => {
    history.push(`/cats/${data.id}/edit`);
  };

  const imageUrl = data.image || defaultImg;

  const colorText =
    data.color === "black" ||
    data.color === "saddlebrown" ||
    data.color === "gray" ||
    data.color === "darkgray"
      ? "white"
      : "primary";

  const statusText = {
    lost: "Потерян",
    found: "Найден",
    returned: "Вернулся домой",
  }[data.status] || "Потерян";

  return (
    <article className={`${styles.content} ${extraClass}`}>
      <div className={styles.container}>
        <div className={styles.btns_box_mobile}>
          <ButtonSecondary
            extraClass={styles.mobile_btn}
            icon={returnIcon}
            onClick={handleReturn}
          />
          {data.owner && data.owner === user?.id && (
            <>
              <ButtonHeader
                extraClass={styles.mobile_btn}
                icon={editIcon}
                to={`/cats/${data.id}/edit`}
              />
              <ButtonSecondary
                extraClass={styles.mobile_btn}
                icon={removeIcon}
                onClick={handleRemoveCard}
              />
            </>
          )}
        </div>
        <div className={styles.img_box}>
          <img
            className={styles.img}
            src={imageUrl}
            alt="Фото котика."
            onError={(e) => {
              e.target.src = defaultImg;
            }}
          />
        </div>
        <ButtonSecondary
          extraClass={`${styles.desktop_btn} ${styles.desk_return}`}
          icon={returnIcon}
          onClick={handleReturn}
        />
        {data.owner && data.owner === user?.id && (
          <>
            <ButtonHeader
              extraClass={`${styles.desktop_btn} ${styles.desk_edit}`}
              icon={editIcon}
              to={`/cats/${data.id}/edit`}
            />
            <ButtonSecondary
              extraClass={`${styles.desktop_btn} ${styles.desk_remove}`}
              icon={removeIcon}
              onClick={handleRemoveCard}
            />
          </>
        )}
      </div>
      <p
        className={`text text_type_h2-5 text_color_primary mt-35 mb-10 ${styles.name}`}
      >
        {data.name}
      </p>
      <p className={`text text_type_h3 text_color_secondary ${styles.date}`}>
        {statusText}. {data.last_seen_place || "Место не указано"}
      </p>
      <p className={`text text_type_medium-20 text_color_primary mt-4 mb-4 ${styles.description}`}>
        {data.description || "Описание пока не добавлено."}
      </p>
      <p className={`text text_type_medium-20 text_color_secondary mb-8 ${styles.contact}`}>
        Контакт: {data.contact || "не указан"}
      </p>
      <div
        className={styles.cat_color_box}
        style={{ backgroundColor: data.color }}
      >
        <p
          className={`text text_type_medium-20 text_color_${colorText} ${styles.cat_color}`}
        >
          {data.color}
        </p>
      </div>
    </article>
  );
};
