import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { UserContext } from "../../utils/context";
import { getUser } from "../../utils/api";

import { ProtectedRoute } from "../ui/protected-roure/protected-route";

import { Header } from "../header/header";
import { Footer } from "../footer/footer";
import { SignUp } from "../sign-up/sign-up";
import { SignIn } from "../sign-in/sign-in";
import { MainPage } from "../main-page/main-page";
import { CardPage } from "../card-page/card-page";
import { AddCardPage } from "../add-card-page/add-card-page";
import { EditCardPage } from "../edit-card-page/edit-card-page";
import { CollectionsPage } from "../collections-page/collections-page";
import { AddCollectionPage } from "../add-collection-page/add-collection-page";
import { CollectionPage } from "../collection-page/collection-page";

import styles from "./app.module.css";

function App() {
  const [userState, setUserState] = useState({});
  const [currentCard, setCurrentCard] = useState({});
  const [queryPage, setQueryPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      getUser().then((res) => {
        if (res && res.id) {
          setUserState({ id: res.id });
        }
      });
    }
  }, []);

  return (
    <div className={styles.app}>
      <UserContext.Provider value={[userState, setUserState]}>
        <BrowserRouter>
          <Header setQueryPage={setQueryPage} />
          <main className={styles.content}>
            <Switch>
              <ProtectedRoute exact path="/">
                <MainPage queryPage={queryPage} setQueryPage={setQueryPage} />
              </ProtectedRoute>
              <Route path="/signin">
                <SignIn />
              </Route>
              <Route path="/signup">
                <SignUp />
              </Route>
              <ProtectedRoute exact path="/cats/add">
                <AddCardPage />
              </ProtectedRoute>
              <ProtectedRoute exact path="/cats/:id/edit">
                <EditCardPage data={currentCard} setData={setCurrentCard} />
              </ProtectedRoute>
              <ProtectedRoute exact path="/cats/:id">
                <CardPage data={currentCard} setData={setCurrentCard} />
              </ProtectedRoute>
              <ProtectedRoute exact path="/collections">
                <CollectionsPage />
              </ProtectedRoute>
              <ProtectedRoute exact path="/collections/new">
                <AddCollectionPage />
              </ProtectedRoute>
              <ProtectedRoute exact path="/collections/:id">
                <CollectionPage />
              </ProtectedRoute>
            </Switch>
          </main>
          <Footer />
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
