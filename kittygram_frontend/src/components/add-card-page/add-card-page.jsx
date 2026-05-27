import React from "react";
import { useHistory } from "react-router-dom";

import { sendCard } from "../../utils/api";
import { colorsList, getBase64 } from "../../utils/constants";

import returnIcon from "../../images/left.svg";
import addImgIcon from "../../images/image.svg";

import { ButtonForm } from "../ui/button-form/button-form";
import { ButtonSecondary } from "../ui/button-secondary/button-secondary";
import { Input } from "../ui/input/input";
import { ColorsBox } from "../ui/colors-box/colors-box";

import styles from "./add-card-page.module.css";

export const AddCardPage = ({ extraClass = "" }) => {
  const [currentColor, setCurrentColor] = React.useState("#FFFFFF");
  const [currentFileName, setCurrentFileName] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [uploadMethod, setUploadMethod] = React.useState("file");
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
  const [errorImage, setErrorImage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const history = useHistory();

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
      setErrorImage("");
    }
  };

  const urlToBase64 = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      throw new Error("Не удалось загрузить изображение по URL");
    }
  };

  const handleResponse = (err) => {
    if (err.name) {
      setErrorName("Поле с именем является обязательным");
    }
    if (err.birth_year) {
      setErrorAge("Поле с годом рождения является обязательным");
    }
    if (err.image || err.non_field_errors) {
      setErrorImage("Ошибка загрузки изображения");
    }
    console.error("Ошибка:", err);
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    setErrorAge("");
    setErrorName("");
    setErrorImage("");
    setIsLoading(true);

    try {
      const cardData = {
        name: card.name,
        birth_year: parseInt(card.birth_year),
        color: currentColor,
        status: card.status,
        last_seen_place: card.last_seen_place,
        contact: card.contact,
        description: card.description,
      };

      if (uploadMethod === "file") {
        const photo = document.querySelector('input[type="file"]').files[0];
        if (photo) {
          const base64Image = await getBase64(photo);
          cardData.image = base64Image;
        }
      } else if (uploadMethod === "url" && imageUrl) {
        const base64Image = await urlToBase64(imageUrl);
        cardData.image = base64Image;
      }

      console.log("Отправляем:", cardData);

      const res = await sendCard(cardData);
      if (res && res.id) {
        history.push(`/cats/${res.id}`);
      }
    } catch (err) {
      handleResponse(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.content} ${extraClass}`}>
      <h2 className="text text_type_h2 text_color_primary mt-25 mb-9">
        Новое объявление
      </h2>
      <ButtonSecondary
        extraClass={styles.return_btn_mobile}
        icon={returnIcon}
        onClick={handleReturn}
      />
      <div className={styles.container}>
        <div className={styles.upload_method}>
          <label className={styles.radio_label}>
            <input
              type="radio"
              value="file"
              checked={uploadMethod === "file"}
              onChange={() => setUploadMethod("file")}
            />
            Загрузить с компьютера
          </label>
          <label className={styles.radio_label}>
            <input
              type="radio"
              value="url"
              checked={uploadMethod === "url"}
              onChange={() => setUploadMethod("url")}
            />
            Загрузить по URL
          </label>
        </div>

        {uploadMethod === "file" ? (
          <>
            <label htmlFor="image" className={styles.img_box}>
              <img
                className={styles.img}
                src={addImgIcon}
                alt="Добавить фото котика."
              />
              <p className="text text_type_medium-16 text_color_primary">
                {currentFileName
                  ? currentFileName
                  : "Загрузите фото в формате JPG, PNG"}
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
          </>
        ) : (
          <Input
            onChange={(e) => setImageUrl(e.target.value)}
            name="image_url"
            type="text"
            placeholder="Введите URL фото (https://example.com/cat.jpg)"
            value={imageUrl}
            error={errorImage}
          />
        )}

        {errorImage && (
          <p className={styles.error_text}>{errorImage}</p>
        )}

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
          text={isLoading ? "Публикация..." : "Опубликовать"}
          onClick={handleSubmit}
          disabled={isLoading}
        />
        <ButtonSecondary
          extraClass={styles.return_btn}
          icon={returnIcon}
          onClick={handleReturn}
        />
      </div>
    </div>
  );
};
