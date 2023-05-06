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
import EditAccount from './pages/EditAccount';
import Bookmark from './pages/Bookmark';
import PersonalAll from './pages/PersonalAll';
import Map from "./components/Map";
import Map2 from "./components/Map2";
import Test from "./pages/Test";
import { useParams } from 'react-router-dom';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const { id } = useParams();

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
        <Route path="/profile" element={<Profile />} />
        <Route path="/post" element={<Post/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/detail/:id" element={<Detail/>}/>
        <Route path="/all" element={<All/>}/>
        <Route path="/edit_account" element={<EditAccount/>}/>
        <Route path="/bookmark" element={<Bookmark/>}/>
        <Route path="/personal_all" element={<PersonalAll/>}/>
        <Route path="/map" element={<Map/>}/>
        <Route path="/map_second" element={<Map2/>}/>
        <Route path="/test" element={<Test/>}/>
        
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
