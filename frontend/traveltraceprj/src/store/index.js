import { createStore } from 'redux';

// reducer 함수 생성
const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

// Redux store 생성
const store = createStore(reducer);

export default store;