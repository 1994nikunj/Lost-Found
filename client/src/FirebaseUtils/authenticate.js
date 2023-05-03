import React, { useState, useEffect } from "react";
import firebaseApp from "./firebase";
import { login } from "utils/apis/auth";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (currentUser === null)
      firebaseApp.auth().onAuthStateChanged(async (user) => {
        if (user !== null) {
          // const loginData = await login(await user?.getIdToken(true));
          setCurrentUser({ firebase: user });
          localStorage.setItem(
            "currentUser",
            JSON.stringify({ firebase: user })
          );
          // setCurrentUser({ firebase: user, userData: loginData?.data });
          // localStorage.setItem(
          //   "currentUser",
          //   JSON.stringify({ firebase: user, userData: loginData?.data })
          // );
        }
      });
  }, [currentUser]);

  return (
    <AuthContext.Provider value={[currentUser, setCurrentUser]}>
      {children}
    </AuthContext.Provider>
  );
};
