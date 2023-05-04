import React from 'react';
import axios from "axios";
import { useHistory } from 'react-router-dom';

const Logout = () => {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('access');
    history.push('/login');
  };
  return(
    
  );
}
export default logout;