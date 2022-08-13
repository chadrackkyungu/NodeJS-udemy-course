/* eslint-disable */
// import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
// export const updateSettings = async (data, type) => {
export const updateSettings = async (name, email) => {
    try {
        // const url = type === 'password' ? 'http://localhost:3000/api/v1/users/updateMyPassword' : 'http://localhost:3000/api/v1/users/updateMe';

        const res = await fetch('http://localhost:3000/api/v1/users/updateMe', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, email }),
        });

        console.log(res)

        if (res.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully!`);
        }

    } catch (err) {
        showAlert('error', err);
    }
};

// export const login = async(email, password) => {
//     try {
//         const res = await fetch('http://localhost:3000/api/v1/users/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email, password }),
//         });
//         if (res.status === 200) {
//             showAlert('Successfully logged in');
//             window.setTimeout(() => {
//                 location.assign('/');
//             }, 1500);
//         }
//     } catch (error) {
//         showAlert('Incorrect email or password', error.message);
//     }
// };