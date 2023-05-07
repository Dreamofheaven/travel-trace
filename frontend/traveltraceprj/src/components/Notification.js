// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { BellFill } from 'react-bootstrap-icons'

// const fetchNotificationCount = async () => {
//   const response = await fetch('http://localhost:8000/accounts/notification/');
//   const data = await response.json();
//   return data.length;
// };

// const NotificationBadge = () => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     const getCount = async () => {
//       const count = await fetchNotificationCount();
//       setCount(count);
//     };
//     getCount();
//   }, []);

//   return (
//     <div className="badge">{count}</div>
//   );
// };

// const NotificationList = () => {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     const getNotifications = async () => {
//       const response = await fetch('http://localhost:8000/accounts/notification/');
//       const data = await response.json();
//       setNotifications(data);
//     };
//     getNotifications();
//   }, []);

//   return (
//     <ul>
//       {notifications.map((notification) => (
//         <li key={notification.id}>{notification.message}</li>
//       ))}
//     </ul>
//   );
// };

// const NotificationDropdown = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     const getCount = async () => {
//       const count = await fetchNotificationCount();
//       setCount(count);
//     };
//     getCount();
//   }, []);

//   const handleClick = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <BellFill className='dropdown' fill='green'>
//       <NotificationBadge />
//       <div className="badge" onClick={handleClick}>{count}</div>
//       {isOpen && <NotificationList />}
//     </BellFill>
//   );
// };

// export default NotificationDropdown