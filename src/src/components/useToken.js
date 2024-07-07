import { useState } from 'react';

export default function useToken() {
  function getToken() {
    return localStorage.getItem('authToken');
  }

  const [token, setToken] = useState(getToken());

  function saveToken(userToken) {
    localStorage.setItem('authToken', userToken);
    setToken(userToken);
  }

  function removeToken() {
    localStorage.removeItem('authToken');
    setToken(null);
  }

  return {
    setToken: saveToken,
    token,
    removeToken
  };
}
