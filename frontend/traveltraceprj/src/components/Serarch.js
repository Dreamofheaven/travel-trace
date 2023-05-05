import React, {useState, useEffect} from 'react';
import axios from 'axios';
import "../styles/Search.css";
import { Card, Col, Row, Button, Stack, Container, Badge } from "react-bootstrap";
import { Bookmark, Heart, CardImage } from 'react-bootstrap-icons'
import defaultImg from '../assets/default_img.png';
import { Link } from 'react-router-dom';

const [userInput, setUserInput] = useState('');

// 입력값을 가져와서 소문자로변경
const getValue = (e) => {
  setUserInput(e.target.value.toLowerCase())};

<input onChange={getValue}/>

// 데이터들을 배열로 monsters 에 배열 state로 담아준 상태
const [monsters, setMonsters] = useState([]); 

// 데이터 목록중, name에 사용자 입력값이 있는 데이터만 불러오기
// 사용자 입력값을 소문자로 변경해주었기 때문에 데이터도 소문자로
const searched = monsters.filter((item) =>
    item.name.toLowerCase().includes(userInput)
  );