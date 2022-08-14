import { showAlert } from './alert.js';

//*update user profile
export const updateProfile = async (data) => {
    try {
        const url = 'http://localhost:3000/api/v1/users/updateMe';
        const res = await fetch(url, {
            method: 'PATCH',
            body: data,
        });
        if (res.status === 200) {
            showAlert('success', ` updated successfully!`);
        }
    } catch (err) {
        showAlert('error', err);
    }
};


//*update password 
export const updatePassword = async (data) => {
    try {
        const url = 'http://localhost:3000/api/v1/users/updateMyPassword';
        const res = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data), //*before */
        });
        if (res.status === 200) {
            showAlert('success', ` updated successfully!`);
        }
    } catch (err) {
        showAlert('error', err);
    }
};
