const loginApi = "http://localhost:5678/api/users/login"

document
.getElementById('loginform')
.addEventListener('submit', handleSubmit)


async function handleSubmit(event) {
    event.preventDefault();

    // Supprimer le message d'erreur existant s'il y en a un
    const existingError = document.querySelector('.error-login');
    if (existingError) {
        existingError.remove();
    }

    let user = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
  
    let response = await fetch(loginApi, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });
    console.log(response);
    if (response.status != 200) {
        const errorBox = document.createElement("div");
        errorBox.className = "error-login";
        errorBox.innerHTML = "Adresse mail ou mot de passe invalide";
        document.querySelector('form').prepend(errorBox);
    }
    else {
        let result = await response.json();
        const token = result.token;
        sessionStorage.setItem("authToken", token);
        window.location.href = "index.html";
    }
}