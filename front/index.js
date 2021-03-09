

function create_user() {
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    console.log(username);
    console.log(password);

    fetch('http://localhost:3000/user/create', {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            password: password
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => {
            res.json()
                .then(json => {
                    if (json.status === 'ok')
                        alert(`Created user: ${json.username}`);
                    else
                        console.log(`Error creating user: ${json.msg}`)
                })
                .catch(err => {
                    console.log(`JSON parse error: ${err}`);
                })
        })
        .catch(err => {
            console.log(`Network error: ${err}`);
        })
}

function login() {
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    fetch(`http://localhost:3000/user/login?username=${username}&password=${password}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            res.json()
                .then(json => {
                    if (json.status === 'ok') {
                        const user_div = document.getElementById('user-div')
                        const user_h3 = document.getElementById('user-h3')
                        const form_div = document.getElementById('form-div')

                        user_div.hidden = false
                        user_h3.innerHTML = `User: ${json.username}`

                        form_div.hidden = true
                    } else
                        console.log(`Error logging in: ${json.msg}`)
                })
                .catch(err => {
                    console.log(`JSON parse error: ${err}`)
                })
        })
        .catch(err => {
            console.log(`Network error: ${err}`);
        })
}

function logout() {

    fetch('http://localhost:3000/user/logout', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            res.json()
                .then(json => {
                    if (json.status === 'ok'){
                        const user_div = document.getElementById('user-div')
                        const form_div = document.getElementById('form-div')

                        user_div.hidden = true

                        form_div.hidden = false
                    } else
                        console.log(`Error logging out: ${json.msg}`)
                })
                .catch(err => {
                    console.log(`JSON parse error: ${err}`);
                })
        })
        .catch(err => {
            console.log(`Network error: ${err}`);
        })
}