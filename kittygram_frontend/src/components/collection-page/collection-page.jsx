import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getCollection, addCatToCollection, removeCatFromCollection, getAllCats, likeCollection, unlikeCollection, getCollectionCats } from "../../utils/api";
import { UserContext } from "../../utils/context";
import styles from "./collection-page.module.css";

export const CollectionPage = () => {
  const { id } = useParams();
  const [user] = useContext(UserContext);
  const [collection, setCollection] = useState(null);
  const [allCats, setAllCats] = useState([]);
  const [collectionCats, setCollectionCats] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCat, setSelectedCat] = useState("");
  const [loading, setLoading] = useState(true);
  const [catsPage, setCatsPage] = useState(1);
  const [catsTotalPages, setCatsTotalPages] = useState(1);
  const [catsTotalCount, setCatsTotalCount] = useState(0);

  useEffect(() => {
    loadCollection();
    loadAllCats();
  }, [id]);

  useEffect(() => {
    if (collection) {
      loadCollectionCats(catsPage);
    }
  }, [catsPage, collection]);

  const loadCollection = () => {
    setLoading(true);
    getCollection(id)
      .then((data) => {
        setCollection(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки группы поиска:", err);
        setLoading(false);
      });
  };

  const loadCollectionCats = (page) => {
    getCollectionCats(id, page)
      .then((data) => {
        setCollectionCats(data.results || []);
        setCatsTotalPages(Math.ceil(data.count / 9));
        setCatsTotalCount(data.count);
      })
      .catch(console.error);
  };

  const loadAllCats = () => {
    getAllCats()
      .then((data) => {
        setAllCats(data || []);
      })
      .catch((err) => {
        console.error("Ошибка загрузки котиков:", err);
      });
  };

  const handleAddCat = () => {
    if (!selectedCat) return;
    addCatToCollection(id, selectedCat)
      .then(() => {
        loadCollection();
        loadCollectionCats(catsPage);
        setShowAddForm(false);
        setSelectedCat("");
      })
      .catch(console.error);
  };

  const handleRemoveCat = (catId) => {
    removeCatFromCollection(id, catId)
      .then(() => {
        loadCollection();
        loadCollectionCats(catsPage);
      })
      .catch(console.error);
  };

  const handleLike = () => {
    if (!user?.id) return;
    const action = collection?.is_liked ? unlikeCollection : likeCollection;
    action(id)
      .then(() => {
        loadCollection();
      })
      .catch(console.error);
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (!collection) {
    return <div className={styles.error}>Группа поиска не найдена</div>;
  }

  const catsInCollectionIds = collectionCats.map((c) => c.id) || [];
  const availableCats = allCats.filter((cat) => !catsInCollectionIds.includes(cat.id));
  const isOwner = user?.id === collection.owner;

  return (
    <div className={styles.content}>
      <Link to="/collections" className={styles.backBtn}>
        ← Назад к группам
      </Link>

      <div className={styles.collectionInfo}>
        <h1>{collection.name}</h1>
        <p>{collection.description}</p>
        <div className={styles.stats}>
          <span>🐱 {catsTotalCount || 0} котиков</span>
          <span>👁 {collection.views_count || 0} просмотров</span>
          <button
            className={`${styles.likeBtn} ${collection.is_liked ? styles.liked : ""}`}
            onClick={handleLike}
          >
            ❤️ {collection.likes_count || 0}
          </button>
        </div>
      </div>

      <div className={styles.catsSection}>
        <div className={styles.sectionHeader}>
          <h2>Котики в группе поиска</h2>
          {isOwner && (
            <button className={styles.addBtn} onClick={() => setShowAddForm(!showAddForm)}>
              + Добавить котика
            </button>
          )}
        </div>

        {showAddForm && isOwner && (
          <div className={styles.addForm}>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className={styles.select}
            >
              <option value="">Выберите котика</option>
              {availableCats.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button onClick={handleAddCat} className={styles.submitBtn}>
              Добавить
            </button>
            <button onClick={() => setShowAddForm(false)} className={styles.cancelBtn}>
              Отмена
            </button>
          </div>
        )}

        <div className={styles.catsGrid}>
          {collectionCats.length === 0 ? (
            <p>В этой группе пока нет котиков</p>
          ) : (
            collectionCats.map((cat) => (
              <div key={cat.id} className={styles.catCard}>
                <Link to={`/cats/${cat.id}`}>
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className={styles.catImage} />
                  ) : (
                    <div className={styles.noImage}>Нет фото</div>
                  )}
                  <h3>{cat.name}</h3>
                  <p>
                    {cat.color}, {cat.birth_year} г.
                  </p>
                </Link>
                {isOwner && (
                  <button className={styles.removeBtn} onClick={() => handleRemoveCat(cat.id)}>
                    Удалить из группы
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {catsTotalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setCatsPage(catsPage - 1)}
              disabled={catsPage === 1}
              className={styles.pageBtn}
            >
              ← Назад
            </button>
            <span className={styles.pageInfo}>
              Страница {catsPage} из {catsTotalPages}
            </span>
            <button
              onClick={() => setCatsPage(catsPage + 1)}
              disabled={catsPage === catsTotalPages}
              className={styles.pageBtn}
            >
              Вперед →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
