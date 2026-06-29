const signupForm = document.getElementById("signupForm");

const nameInput = document.getElementById("name");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const confirmPasswordInput = document.getElementById("confirmPassword");

const message = document.getElementById("message");

if(localStorage.getItem("loggedInUser")){

    window.location.href="dashboard.html";

}

signupForm.addEventListener("submit",function(e){

    e.preventDefault();

    const name = nameInput.value.trim();

    const email = emailInput.value.trim().toLowerCase();

    const password = passwordInput.value;

    const confirmPassword = confirmPasswordInput.value;

    if(name===""){

        message.style.color="#ff8080";

        message.textContent="Please enter your name.";

        return;

    }

    if(password!==confirmPassword){

        message.style.color="#ff8080";

        message.textContent="Passwords do not match.";

        return;

    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(user => user.email === email);

    if(existingUser){

        message.style.color="#ff8080";

        message.textContent="Email already registered.";

        return;

    }

    const newUser = {

        name:name,

        email:email,

        password:password

    };

    users.push(newUser);

    localStorage.setItem(

        "users",

        JSON.stringify(users)

    );

    message.style.color="#4ade80";

    message.textContent="Registration Successful! Redirecting...";

    signupForm.reset();

    setTimeout(function(){

        window.location.href="index.html";

    },1500);

});