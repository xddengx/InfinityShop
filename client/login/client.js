const handleLogin = (e) => {
    e.preventDefault();

    console.log($("#pass").val());

    if($("#user").val() == '' || $("#pass").val() == ''){
        handleError("Fields cannot be left blank");
        return false;
    }

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

//handle clicks to the signup button
const handleSignup = (e) => {
    e.preventDefault();

    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == ''){
        handleError("All fields are required");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()){
        handleError("Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

const handleChangePassword = (e) =>{
    e.preventDefault();

    if($("user").val() == '' || $("#oldPass").val() == '' || $("#newPass").val() == '' || $("newPass2").val() == ''){
        handleError("All fields are required");
        return false;
    }

    console.dir($("#newPass").val());
    console.dir($("#newPass2").val());

    if($("#newPass").val() !== $("#newPass2").val()){
        handleError("New passwords do not match");
        return false;
    }

    sendAjax('PUT', $("#changePasswordForm").attr("action"), $("#changePasswordForm").serialize(), function(){
        console.log("successful?");
    });

    return false;
};

const LoginWindow = (props) =>{
    return(
        <div>
            <form id="loginForm" name="loginForm"
                onSubmit={handleLogin}
                action="/login"
                method="POST"
                className="mainForm"
            >
            
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username"/>
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Sign in"/>
            </form>
        </div>
    );
};

const SignupWindow = (props) =>{
    return(
        <form id="signupForm"
              name="signupForm"
              onSubmit={handleSignup}
              action="/signup"
              method="POST"
              className="mainForm"
        >
        
        <label htmlFor="username">Username: </label>
        <input id="user" type="text" name="username" placeholder="username"/>
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="password" name="pass" placeholder="password"/>
        <label htmlFor="pass2">Password: </label>
        <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="formSubmit" type="submit" value="Sign Up"/>
        </form>
    );
};

const ChangePasswordWindow = (props) =>{
    return(
        <form id="changePasswordForm"
            name="changePasswordForm"
            onSubmit={handleChangePassword}
            action="/changePassword"
            method="PUT"
            className="passwordChangeForm"
        >
        
        <label htmlFor="username">Username: </label>
        <input id="user" type="text" name="username" placeholder="username"/>

        <label htmlFor="oldPass"> Old Password: </label>
        <input id="oldPass" type="password" name="oldPass" placeholder="old password"/>
        

        <label htmlFor="newPass">New Password: </label>
        <input id="newPass" type="password" name="newPass" placeholder="new password"/>

        <label htmlFor="newPass2">New Password: </label>
        <input id="newPass2" type="password" name="newPass2" placeholder="retype new password"/>

        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="formSubmit" id="passChangeSub" type="submit" value="Update Password"/>
        </form>
    )
}

const createLoginWindow = (csrf) =>{
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createSignupWindow = (csrf) =>{
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createPasswordChangeWindow = (csrf) =>{
    ReactDOM.render(
        <ChangePasswordWindow csrf={csrf} />,
        document.querySelector("#content")
    );
}

//setup function attaches events to the page buttons
//login page is defaulted when user loads page, otherwise no UI will be shown
//(can be sign up page too)
const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");
    const changePasswordButton = document.querySelector("#changePassword");

    signupButton.addEventListener("click", (e) =>{
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", (e) =>{
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    changePasswordButton.addEventListener("click", (e) =>{
        console.dir(csrf);
        e.preventDefault();
        createPasswordChangeWindow(csrf);
        return false;
    });

    createLoginWindow(csrf); //default view
};

// since page is never reloaded. requests have to be made to the server
// to get CSRF tokens 
// if successful, the rest of the page will be set up
const getToken = () =>{
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

//when the page loads, make a call to get our token
//rest of page will be set up to allow React components to show the pages
//without leaving the page.
$(document).ready(function() {
    getToken();
});


