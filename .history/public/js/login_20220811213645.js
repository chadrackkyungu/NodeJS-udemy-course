/* eslint-disable */
// import axios from 'axios';
// import { showAlert } from './alerts';

// export const login = async(email, password) => {
const login = async(email, password) => {
    console.log('user details: ', email, password);
    try {
        const res = await axios({
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/login',
            data: {
                email,
                password,
            },
        });
        console.log('Res:', res);

        // if (res.data.status === 'success') {
        // showAlert('success', 'Logged in successfully!');
        //     window.setTimeout(() => {
        //         location.assign('/');
        //     }, 1500);
        // }
    } catch (err) {
        // showAlert('error', err.response.data.message);
        console.log(err.response);
    }
};

document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});

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