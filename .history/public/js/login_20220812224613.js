/* eslint-disable */
// import axios from 'axios';
// import { showAlert } from './alert.js';

// export const login = async(email, password) => {
//     try {
//         const res = await axios({
//             method: 'POST',
//             url: 'http://127.0.0.1:3000/api/v1/users/login',
//             data: {
//                 email,
//                 password,
//             },
//         });

//         if (res.data.status === 'success') {
//             alert('success', 'Logged in successfully!');
//             window.setTimeout(() => {
//                 location.assign('/');
//             }, 1500);
//         }
//     } catch (err) {
//         alert('error', err.response.data.message);
//     }
// };

export const login = async(email, password) => {
    try {
        const res = await fetch('http://localhost:3000/api/v1/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (res.status === 200) {
            alert('Successfully logged in');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (error) {
        alert('Incorrect email or password', error.message);
    }
};

// document.querySelector('.form').addEventListener('submit', (e) => {
//     e.preventDefault();
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     login(email, password);
// });

// export const logout = async() => {
//     try {
//         const res = await axios({
//             method: 'GET',
//             url: 'http://127.0.0.1:3000/api/v1/users/logout',
//         });
//         if ((res.data.status = 'success')) location.reload(true);
//     } catch (err) {
//         console.log(err.response);
//         showAlert('error', 'Error logging out! Try again.');
//     }
// };