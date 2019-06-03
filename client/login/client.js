/* Login Page, Sign Up Page, Change Password Page*/

const handleLogin = (e) => {
    e.preventDefault();

    if ($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Fields cannot be left blank");
        return false;
    }
    console.log($("#loginForm").attr("action"), $("#loginForm").serialize());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

// send request to create new account
const handleSignup = (e) => {
    e.preventDefault();


    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

// send request to change password
const handleChangePassword = (e) => {
    e.preventDefault();

    if ($("user").val() == '' || $("#oldPass").val() == '' || $("#newPass").val() == '' || $("newPass2").val() == '') {
        handleError("All fields are required");
        return false;
    }

    if ($("#newPass").val() !== $("#newPass2").val()) {
        handleError("New passwords do not match");
        return false;
    }

    sendAjax('PUT', $("#changePasswordForm").attr("action"), $("#changePasswordForm").serialize(), redirect);

    return false;
};

// render the log in page
const LoginWindow = (props) => {
    return (
        <div className="mainForm">
            <form id="loginForm" name="loginForm"
                onSubmit={handleLogin}
                action="/login"
                method="POST"
            // className="mainForm"
            >

                <label htmlFor="username">Username</label>
                <input id="user" type="text" name="username" />
                <label htmlFor="pass">Password</label>
                <input id="pass" type="password" name="pass" />
                <a id="changePassword" href="/changePassword">forgot password?</a>
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="formSubmit" type="submit" value="Sign In" />
            </form>

            <div className="switchScreens">
                <p>Don't have an account?</p>
                <a id="signupButton" href="/signup">Sign up</a>
            </div>
        </div>
    );
};


// render the sign up page
const SignupWindow = (props) => {
    return (
        <div className="mainForm">
            <form id="signupForm"
                name="signupForm"
                onSubmit={handleSignup}
                action="/signup"
                method="POST"
            // className="mainForm"
            >

                <label htmlFor="username">Username </label>
                <input id="user" type="text" name="username" />
                <label htmlFor="pass">Password</label>
                <input id="pass" type="password" name="pass" />
                <label htmlFor="pass2">Retype Password </label>
                <input id="pass2" type="password" name="pass2"/>
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="formSubmit" type="submit" value="Sign Up" />
            </form>

            <div className="switchScreens">
                <p>Already have an account?</p>
                <a className="loginButton" href="/login">Login</a>
            </div>
        </div>
    );
};


// render change password page
const ChangePasswordWindow = (props) => {
    return (
        <div className="mainForm" id="changePswdForm">
            <div className="switchScreens">
                <a className="loginButton" id="pswdLoginBtn" href="/login">&#x25C2; Login</a>
            </div>

            <form id="changePasswordForm"
                name="changePasswordForm"
                onSubmit={handleChangePassword}
                action="/changePassword"
                method="PUT"
                className="passwordChangeForm"
            >

                <label htmlFor="username">Username</label>
                <input id="user" type="text" name="username" />

                <label htmlFor="oldPass"> Old Password</label>
                <input id="oldPass" type="password" name="oldPass" />

                <label htmlFor="newPass">New Password</label>
                <input id="newPass" type="password" name="newPass" />

                <label htmlFor="newPass2">Retype New Password</label>
                <input id="newPass2" type="password" name="newPass2" />

                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="formSubmit" id="passChangeSub" type="submit" value="Update Password" />
            </form>
        </div>
    )
}

const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );

    const signupButton = document.querySelector("#signupButton");
    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    const changePasswordButton = document.querySelector("#changePassword");

    changePasswordButton.addEventListener("click", (e) => {
        e.preventDefault();
        createPasswordChangeWindow(csrf);
        return false;
    });
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
    const loginButton = document.querySelector(".loginButton");
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });
};

const createPasswordChangeWindow = (csrf) => {
    ReactDOM.render(
        <ChangePasswordWindow csrf={csrf} />,
        document.querySelector("#content")
    );

    const loginButton = document.querySelector(".loginButton");
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });
}

//setup function attaches events to the page buttons
//login page is defaulted when user loads page, otherwise no UI will be shown
const setup = (csrf) => {
    createLoginWindow(csrf); //default view
};

// since page is never reloaded. requests have to be made to the server
// to get CSRF tokens 
// if successful, the rest of the page will be set up
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

//when the page loads, make a call to get our token
//rest of page will be set up to allow React components to show the pages
//without leaving the page.
$(document).ready(function () {
    getToken();
});


