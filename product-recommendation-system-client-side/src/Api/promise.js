export const queryCreatedByPromise = email => {
    return fetch(`https://productrecommendationsystem.vercel.app/addquery?email=${email}`, {
        credentials: 'include'
    })
        .then(res => res.json());
}