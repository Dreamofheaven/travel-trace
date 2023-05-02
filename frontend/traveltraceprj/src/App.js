import './App.css';
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

function App() {
  return (
    <div>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post" element={<Post/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/detail" element={<Detail/>}/>
        <Route path="/all" element={<All/>}/>
        <Route path="/edit_account" element={<EditAccount/>}/>
        <Route path="/bookmark" element={<Bookmark/>}/>
        <Route path="/personal_all" element={<PersonalAll/>}/>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
