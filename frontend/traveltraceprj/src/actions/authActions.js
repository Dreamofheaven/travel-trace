// src/actions/authActions.js

export const loginSuccess = (user) => {
  return { type: 'LOGIN_SUCCESS', payload: user };
};

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/accounts/', {email, password});

      if (response && response.data) {
        const { user } = response.data;
        dispatch(loginSuccess(user)); // Redux store에 user 정보 저장
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };
};
