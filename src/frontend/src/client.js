import fetch from 'unfetch';

const checkStatus = response => {
    if (response.ok) {
        return response;
    }

    // convert non-2xx HTTP responses into errors:
    const error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
}

export const getAllUsers = () =>
    fetch("api/v1/users")
        .then(checkStatus);

export const addNewUser = (user) =>
    fetch("api/v1/users", {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(user)
    }).then(checkStatus);

export const deleteUser = userId =>
    fetch(`api/v1/users/${userId}`, {
        method: 'DELETE'
    }).then(checkStatus);