import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createCollection } from "../../utils/api";

export const AddCollectionPage = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "other"
  });
  const history = useHistory();

  const categories = [
    { value: "lost", label: "Потерянные" },
    { value: "found", label: "Найденные" },
    { value: "urgent", label: "Срочные" },
    { value: "district", label: "По району" },
    { value: "returned", label: "Вернулись домой" },
    { value: "other", label: "Другие" }
  ];

  const handleSubmit = () => {
    createCollection(form)
      .then((res) => {
        if (res.id) {
          history.push(`/collections/${res.id}`);
        }
      })
      .catch(console.error);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Новая группа поиска</h2>
      <div>
        <input
          type="text"
          placeholder="Название группы"
          style={{ display: "block", marginBottom: "10px", width: "300px" }}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          placeholder="Описание"
          style={{ display: "block", marginBottom: "10px", width: "300px" }}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <select
          style={{ display: "block", marginBottom: "10px", width: "300px" }}
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <button onClick={handleSubmit}>Создать группу</button>
      </div>
    </div>
  );
};
