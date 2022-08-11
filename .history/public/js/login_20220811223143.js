/* eslint-disable */

const login = async(email, password) => {
    try {
        const res = await fetch('http://localhost:3000/api/v1/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        console.log(res);
    } catch (error) {
        console.log(error.Response.data);
    }

    // try {
    //     const res = await axios({
    //         method: 'POST',
    //         url: 'http://localhost:3000/api/v1/users/login',
    //         data: {
    //             email,
    //             password,
    //         },
    //     });
    //     console.log('Res:', res);
    // } catch (err) {
    //     console.log(err);
    // }
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