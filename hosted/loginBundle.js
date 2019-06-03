"use strict";

/* Login Page, Sign Up Page, Change Password Page*/

var handleLogin = function handleLogin(e) {
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
var handleSignup = function handleSignup(e) {
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
var handleChangePassword = function handleChangePassword(e) {
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
var LoginWindow = function LoginWindow(props) {
    return React.createElement(
        "div",
        { className: "mainForm" },
        React.createElement(
            "form",
            { id: "loginForm", name: "loginForm",
                onSubmit: handleLogin,
                action: "/login",
                method: "POST"
                // className="mainForm"
            },
            React.createElement(
                "label",
                { htmlFor: "username" },
                "Username"
            ),
            React.createElement("input", { id: "user", type: "text", name: "username" }),
            React.createElement(
                "label",
                { htmlFor: "pass" },
                "Password"
            ),
            React.createElement("input", { id: "pass", type: "password", name: "pass" }),
            React.createElement(
                "a",
                { id: "changePassword", href: "/changePassword" },
                "forgot password?"
            ),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign In" })
        ),
        React.createElement(
            "div",
            { className: "switchScreens" },
            React.createElement(
                "p",
                null,
                "Don't have an account?"
            ),
            React.createElement(
                "a",
                { id: "signupButton", href: "/signup" },
                "Sign up"
            )
        )
    );
};

// render the sign up page
var SignupWindow = function SignupWindow(props) {
    return React.createElement(
        "div",
        { className: "mainForm" },
        React.createElement(
            "form",
            { id: "signupForm",
                name: "signupForm",
                onSubmit: handleSignup,
                action: "/signup",
                method: "POST"
                // className="mainForm"
            },
            React.createElement(
                "label",
                { htmlFor: "username" },
                "Username "
            ),
            React.createElement("input", { id: "user", type: "text", name: "username" }),
            React.createElement(
                "label",
                { htmlFor: "pass" },
                "Password"
            ),
            React.createElement("input", { id: "pass", type: "password", name: "pass" }),
            React.createElement(
                "label",
                { htmlFor: "pass2" },
                "Retype Password "
            ),
            React.createElement("input", { id: "pass2", type: "password", name: "pass2" }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign Up" })
        ),
        React.createElement(
            "div",
            { className: "switchScreens" },
            React.createElement(
                "p",
                null,
                "Already have an account?"
            ),
            React.createElement(
                "a",
                { className: "loginButton", href: "/login" },
                "Login"
            )
        )
    );
};

// render change password page
var ChangePasswordWindow = function ChangePasswordWindow(props) {
    return React.createElement(
        "div",
        { className: "mainForm", id: "changePswdForm" },
        React.createElement(
            "div",
            { className: "switchScreens" },
            React.createElement(
                "a",
                { className: "loginButton", id: "pswdLoginBtn", href: "/login" },
                "\u25C2 Login"
            )
        ),
        React.createElement(
            "form",
            { id: "changePasswordForm",
                name: "changePasswordForm",
                onSubmit: handleChangePassword,
                action: "/changePassword",
                method: "PUT",
                className: "passwordChangeForm"
            },
            React.createElement(
                "label",
                { htmlFor: "username" },
                "Username"
            ),
            React.createElement("input", { id: "user", type: "text", name: "username" }),
            React.createElement(
                "label",
                { htmlFor: "oldPass" },
                " Old Password"
            ),
            React.createElement("input", { id: "oldPass", type: "password", name: "oldPass" }),
            React.createElement(
                "label",
                { htmlFor: "newPass" },
                "New Password"
            ),
            React.createElement("input", { id: "newPass", type: "password", name: "newPass" }),
            React.createElement(
                "label",
                { htmlFor: "newPass2" },
                "Retype New Password"
            ),
            React.createElement("input", { id: "newPass2", type: "password", name: "newPass2" }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "formSubmit", id: "passChangeSub", type: "submit", value: "Update Password" })
        )
    );
};

var createLoginWindow = function createLoginWindow(csrf) {
    ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));

    var signupButton = document.querySelector("#signupButton");
    signupButton.addEventListener("click", function (e) {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    var changePasswordButton = document.querySelector("#changePassword");

    changePasswordButton.addEventListener("click", function (e) {
        e.preventDefault();
        createPasswordChangeWindow(csrf);
        return false;
    });
};

var createSignupWindow = function createSignupWindow(csrf) {
    ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
    var loginButton = document.querySelector(".loginButton");
    loginButton.addEventListener("click", function (e) {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });
};

var createPasswordChangeWindow = function createPasswordChangeWindow(csrf) {
    ReactDOM.render(React.createElement(ChangePasswordWindow, { csrf: csrf }), document.querySelector("#content"));

    var loginButton = document.querySelector(".loginButton");
    loginButton.addEventListener("click", function (e) {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });
};

//setup function attaches events to the page buttons
//login page is defaulted when user loads page, otherwise no UI will be shown
var setup = function setup(csrf) {
    createLoginWindow(csrf); //default view
};

// since page is never reloaded. requests have to be made to the server
// to get CSRF tokens 
// if successful, the rest of the page will be set up
var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

//when the page loads, make a call to get our token
//rest of page will be set up to allow React components to show the pages
//without leaving the page.
$(document).ready(function () {
    getToken();
});
"use strict";

// handle the error message
var handleError = function handleError(message) {
    // jquery dialog alert box if there is an error message
    $(function () {
        $("#errorCont").dialog({
            height: 250,
            width: 500,
            modal: true,
            resizable: false,
            draggable: false,
            dialogClass: "myClass"

        });
    });
    $("#errorMessage").text("Error: " + message);
    // $("#errorCont").animate({width:'toggle'},350);
    // alert(message);
    console.log(message);
};

// redirect to the specified page
var redirect = function redirect(response) {
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
