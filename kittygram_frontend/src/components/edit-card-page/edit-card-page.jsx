import React from "react";
import { useHistory, useParams } from "react-router-dom";

import { getCard, updateCard } from "../../utils/api";
import { colorsList, getBase64 } from "../../utils/constants";

import returnIcon from "../../images/left.svg";
import addImgIcon from "../../images/image.svg";

import { ButtonForm } from "../ui/button-form/button-form";
import { ButtonSecondary } from "../ui/button-secondary/button-secondary";
import { Input } from "../ui/input/input";
import { ColorsBox } from "../ui/colors-box/colors-box";

import styles from "./edit-card-page.module.css";

const getColorHex = (colorName) => {
  const color = colorsList.find(c => c.name === colorName);
  return color ? color.hex : "#FFFFFF";
};

export const EditCardPage = ({ extraClass = "" }) => {
  const [currentColor, setCurrentColor] = React.useState("#FFFFFF");
  const [currentFileName, setCurrentFileName] = React.useState("");
  const [card, setCard] = React.useState({
    name: "",
    birth_year: "",
    color: currentColor,
    status: "lost",
    last_seen_place: "",
    contact: "",
    description: "",
  });
  const [errorName, setErrorName] = React.useState("");
  const [errorAge, setErrorAge] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const history = useHistory();
  const params = useParams();

  React.useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await getCard(params.id);
        if (res && res.id) {
          setCard({
            name: res.name,
            birth_year: res.birth_year,
            color: res.color,
            status: res.status || "lost",
            last_seen_place: res.last_seen_place || "",
            contact: res.contact || "",
            description: res.description || "",
          });
          setCurrentColor(res.color);
        }
      } catch (err) {
        console.error("Ошибка загрузки котика:", err);
      }
    };
    fetchCard();
  }, [params.id]);

  const handleReturn = () => {
    history.goBack();
  };

  const onChangeInput = (e) => {
    setCard({
      ...card,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "image" && e.target.files && e.target.files[0]) {
      setCurrentFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setErrorAge("");
    setErrorName("");
    setIsLoading(true);

    try {
      const cardData = {
        name: card.name,
        birth_year: parseInt(card.birth_year),
        color: getColorHex(currentColor),
        status: card.status,
        last_seen_place: card.last_seen_place,
        contact: card.contact,
        description: card.description,
      };

      const photoInput = document.getElementById('image');
      if (photoInput && photoInput.files && photoInput.files[0]) {
        const base64Image = await getBase64(photoInput.files[0]);
        cardData.image = base64Image;
      }

      console.log("Отправляем данные:", cardData);

      const res = await updateCard(cardData, params.id);
      console.log("Ответ сервера:", res);

      if (res && res.id) {
        history.push(`/cats/${res.id}`);
      }
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
      alert(`Ошибка: ${JSON.stringify(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.content} ${extraClass}`}>
      <h2 className="text text_type_h2 text_color_primary mt-25 mb-9">
        Редактировать объявление
      </h2>
      <ButtonSecondary
        extraClass={styles.return_btn_mobile}
        icon={returnIcon}
        onClick={handleReturn}
      />
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="image" className={styles.img_box}>
            <img
              className={styles.img}
              src={addImgIcon}
              alt="Добавить фото котика."
            />
            <p className="text text_type_medium-16 text_color_primary">
              {currentFileName
                ? currentFileName
                : "Загрузите новое фото в формате JPG"}
            </p>
          </label>
          <input
            type="file"
            className={styles.file_input}
            name="image"
            id="image"
            accept="image/jpeg,image/jpg,image/png"
            onChange={onChangeInput}
          />
          <Input
            onChange={onChangeInput}
            name="name"
            type="text"
            placeholder="Имя или кличка кота"
            value={card.name}
            error={errorName}
          />
          <Input
            onChange={onChangeInput}
            name="birth_year"
            type="number"
            placeholder="Год рождения"
            value={card.birth_year}
            error={errorAge}
          />
          <select
            className={styles.select}
            name="status"
            value={card.status}
            onChange={onChangeInput}
          >
            <option value="lost">Потерян</option>
            <option value="found">Найден</option>
            <option value="returned">Вернулся домой</option>
          </select>
          <Input
            onChange={onChangeInput}
            name="last_seen_place"
            type="text"
            placeholder="Где видели: район, улица, ориентир"
            value={card.last_seen_place}
          />
          <Input
            onChange={onChangeInput}
            name="contact"
            type="text"
            placeholder="Контакт для связи"
            value={card.contact}
          />
          <textarea
            className={styles.textarea}
            name="description"
            placeholder="Описание: приметы, ошейник, поведение"
            value={card.description}
            onChange={onChangeInput}
          />
          <ColorsBox
            colorsList={colorsList}
            currentColor={currentColor}
            setCurrentColor={setCurrentColor}
            card={card}
            setCard={setCard}
          />
          <ButtonForm
            extraClass={styles.submit_btn}
            text={isLoading ? "Сохранение..." : "Сохранить"}
            onClick={handleSubmit}
            disabled={isLoading}
            type="submit"
          />
        </form>
        <ButtonSecondary
          extraClass={styles.return_btn}
          icon={returnIcon}
          onClick={handleReturn}
        />
      </div>
    </div>
  );
};
