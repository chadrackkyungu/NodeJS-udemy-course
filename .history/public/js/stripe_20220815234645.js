/* eslint-disable */
import { showAlert } from './alert.js';
const stripe = Stripe('pk_test_BUkd0ZXAj6m0q0jMyRgBxNns00PPtgvjjr');

// export const bookTour = async tourId => {
//     try {
//         // 1) Get checkout session from API
//         const session = await axios(
//             `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
//         );
//         console.log(session);

//         // 2) Create checkout form + chanre credit card
//         await stripe.redirectToCheckout({
//             sessionId: session.data.session.id
//         });
//     } catch (err) {
//         console.log(err);
//         showAlert('error', err);
//     }
// };


export const bookTour = async (tourId) => {
    try {
        // 1) Get checkout session from API
        const session = await fetch(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tourId }),
        });
        // 2) Create checkout form + chanre credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });

    } catch (error) {
        console.log(err);
        showAlert('error', err);
    }
};