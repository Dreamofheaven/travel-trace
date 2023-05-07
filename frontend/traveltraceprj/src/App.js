import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import AppNavbar from './components/AppNavbar';
import Footer from './components/Footer';
import MainPage from './pages/MainPage';
import Profile from './pages/Profile';
import Post from './pages/Post';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Detail from './pages/Detail';
import All from './pages/All';
import Nearby from './pages/Nearby';
import EditAccount from './pages/EditAccount';
import Bookmark from './pages/Bookmark';
import PersonalAll from './pages/PersonalAll';
// import Map from "./components/Map";
import Map2 from "./components/Map2";
import Test from "./pages/Test";
import Opper from './pages/Opper';
import { useParams } from 'react-router-dom';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const { id } = useParams();
  const { user_pk } = useParams();
  console.log("id:" + id)
  console.log("user_pk:" + user_pk)

  useEffect(() => {
    const access_token = localStorage.getItem('access');
    // console.log(access_token)
    if (access_token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  return (
    <div>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/profile/:user_pk/" element={<Profile />} />
        <Route path="/post" element={<Post/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/detail/:id" element={<Detail/>}/>
        <Route path="/all" element={<All/>}/>
        <Route path="/nearby" element={<Nearby/>}/>
        <Route path="/edit_account" element={<EditAccount/>}/>
        <Route path="/bookmark" element={<Bookmark/>}/>
        <Route path="/personal_all" element={<PersonalAll/>}/>
        <Route path="/map_second" element={<Map2/>}/>
        <Route path="/test" element={<Test/>}/>
        <Route path="/opper" element={<Opper/>}/>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
