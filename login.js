const loginForm = document.getElementById("loginForm");

const email = document.getElementById("email");

const password = document.getElementById("password");

const message = document.getElementById("message");

if(localStorage.getItem("loggedInUser")){

    window.location.href="dashboard.html";

}

loginForm.addEventListener("submit",function(e){

    e.preventDefault();

    const users=

        JSON.parse(localStorage.getItem("users"))||[];

    const user=

        users.find(

            u=>u.email===email.value.trim()

            &&

            u.password===password.value

        );

    if(!user){

        message.style.color="#ff8080";

        message.textContent="Invalid Email or Password";

        return;

    }

    localStorage.setItem(

        "loggedInUser",

        JSON.stringify(user)

    );

    message.style.color="#4ade80";

    message.textContent="Login Successful...";

    setTimeout(function(){

        window.location.href="dashboard.html";

    },800);

});