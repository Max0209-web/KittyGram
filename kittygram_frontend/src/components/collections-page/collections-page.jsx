import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCollections, likeCollection, unlikeCollection } from "../../utils/api";
import { ButtonHeader } from "../ui/button-header/button-header";
import plusIcon from "../../images/plus.svg";
import styles from "./collections-page.module.css";

export const CollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Состояния для фильтрации и поиска
  const [filterCategory, setFilterCategory] = useState("");
  const [searchName, setSearchName] = useState("");
  const [sortBy, setSortBy] = useState("new");

  // Категории для фильтра
  const categories = [
    { value: "", label: "Все категории" },
    { value: "lost", label: "Потерянные" },
    { value: "found", label: "Найденные" },
    { value: "urgent", label: "Срочные" },
    { value: "district", label: "По району" },
    { value: "returned", label: "Вернулись домой" },
    { value: "other", label: "Другие" },
  ];

  // Загрузка групп с учётом фильтров
  useEffect(() => {
    loadCollections();
  }, [filterCategory, sortBy]);

  const loadCollections = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (filterCategory) filters.category = filterCategory;
      if (sortBy === "popular") filters.sort = "popular";

      const data = await getCollections(1, filters);
      let filteredData = data.results || [];

      // Поиск по названию (на клиентской стороне)
      if (searchName) {
        filteredData = filteredData.filter(collection =>
          collection.name.toLowerCase().includes(searchName.toLowerCase())
        );
      }

      setCollections(filteredData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Обработчик поиска (с debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchName !== undefined) {
        loadCollections();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchName]);

  // Функция для обработки лайка
  const handleLike = (collectionId, isLiked) => {
    const action = isLiked ? unlikeCollection : likeCollection;
    action(collectionId)
      .then(() => {
        loadCollections(); // Обновляем список после лайка
      })
      .catch(console.error);
  };

  const getCategoryLabel = (category) => {
    const labels = {
      lost: "Потерянные",
      found: "Найденные",
      urgent: "Срочные",
      district: "По району",
      returned: "Вернулись домой",
      other: "Другие"
    };
    return labels[category] || "Другие";
  };

  const getCategoryColor = (category) => {
    const colors = {
      lost: "#ff8a7a",
      found: "#76c893",
      urgent: "#ffb703",
      district: "#8ecae6",
      returned: "#bde0fe",
      other: "#A9A9A9"
    };
    return colors[category] || "#A9A9A9";
  };

  return (
    <section className={styles.content}>
      <div className={styles.header}>
        <h2 className="text text_type_h2 text_color_primary">
          Районы и статусы поиска
        </h2>
        <ButtonHeader to="/collections/new" text="Создать группу" icon={plusIcon} isLogin={true} />
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Категория:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={styles.filterSelect}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Сортировка:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="new">Новые</option>
            <option value="popular">По популярности (лайкам)</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Поиск:</label>
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Загрузка...</div>
      ) : collections.length === 0 ? (
        <div className={styles.empty}>
          <p className="text text_type_medium-16 text_color_secondary">
            {searchName || filterCategory
              ? "Ничего не найдено. Попробуйте изменить фильтры."
              : "Пока нет ни одной группы поиска. Создайте первую!"}
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {collections.map((collection) => (
            <Link to={`/collections/${collection.id}`} key={collection.id} className={styles.cardLink}>
              <div className={styles.card}>
                <div
                  className={styles.categoryBadge}
                  style={{ backgroundColor: getCategoryColor(collection.category) }}
                >
                  {getCategoryLabel(collection.category)}
                </div>
                <h3 className={styles.cardTitle}>{collection.name}</h3>
                <p className={styles.cardDescription}>
                  {collection.description || "Без описания"}
                </p>
                <div className={styles.stats}>
                  <span className={styles.stat}>{collection.cats_count || 0} объявлений</span>
                  <span className={styles.stat}>👁 {collection.views_count || 0}</span>
                  <button
                    className={`${styles.likeBtn} ${collection.is_liked ? styles.liked : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLike(collection.id, collection.is_liked);
                    }}
                  >
                    ❤️ {collection.likes_count || 0}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
