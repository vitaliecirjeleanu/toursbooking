import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [jwt, setJwt] = useState(null);
  const [jwtExpireDate, setJwtExpireDate] = useState();
  const [userData, setUserData] = useState({});

  const login = useCallback((jwt, uid, role, image, expirationDate) => {
    setJwt(jwt);
    setUserData({ id: uid, role, image });

    const jwtExpDate =
      expirationDate || new Date(Date.now() + 6 * 60 * 60 * 1000);
    setJwtExpireDate(jwtExpDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        role,
        image,
        jwt,
        expiresIn: jwtExpDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setJwt(null);
    setJwtExpireDate(null);
    setUserData({});
    localStorage.removeItem('userData');
  }, []);

  //auto logout
  useEffect(() => {
    if (jwt && jwtExpireDate) {
      const remainingTime = jwtExpireDate.getTime() - Date.now();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [jwt, jwtExpireDate, logout]);

  // auto login
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedUserData &&
      storedUserData.jwt &&
      storedUserData.userId &&
      storedUserData.role &&
      storedUserData.image &&
      new Date(storedUserData.expiresIn) > new Date()
    ) {
      login(
        storedUserData.jwt,
        storedUserData.userId,
        storedUserData.role,
        storedUserData.image,
        new Date(storedUserData.expiresIn)
      );
    }
  }, [login]);

  return { jwt, userData, login, logout };
};
