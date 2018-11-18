const handleLogin = e => {
    e.preventDefault();

    console.log($("#pass").val());

    if ($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Fields cannot be left blank");
        return false;
    }

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

//handle clicks to the signup button
const handleSignup = e => {
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

const handleChangePassword = e => {
    e.preventDefault();

    if ($("user").val() == '' || $("#oldPass").val() == '' || $("#newPass").val() == '' || $("newPass2").val() == '') {
        handleError("All fields are required");
        return false;
    }

    console.dir($("#newPass").val());
    console.dir($("#newPass2").val());

    if ($("#newPass").val() !== $("#newPass2").val()) {
        handleError("New passwords do not match");
        return false;
    }

    sendAjax('PUT', $("#changePasswordForm").attr("action"), $("#changePasswordForm").serialize(), redirect);

    return false;
};

const LoginWindow = props => {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "form",
            { id: "loginForm", name: "loginForm",
                onSubmit: handleLogin,
                action: "/login",
                method: "POST",
                className: "mainForm"
            },
            React.createElement(
                "label",
                { htmlFor: "username" },
                "Username: "
            ),
            React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
            React.createElement(
                "label",
                { htmlFor: "pass" },
                "Password: "
            ),
            React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign in" })
        )
    );
};

const SignupWindow = props => {
    return React.createElement(
        "form",
        { id: "signupForm",
            name: "signupForm",
            onSubmit: handleSignup,
            action: "/signup",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "label",
            { htmlFor: "username" },
            "Username: "
        ),
        React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
        React.createElement(
            "label",
            { htmlFor: "pass" },
            "Password: "
        ),
        React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
        React.createElement(
            "label",
            { htmlFor: "pass2" },
            "Password: "
        ),
        React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign Up" })
    );
};

const ChangePasswordWindow = props => {
    return React.createElement(
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
            "Username: "
        ),
        React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
        React.createElement(
            "label",
            { htmlFor: "oldPass" },
            " Old Password: "
        ),
        React.createElement("input", { id: "oldPass", type: "password", name: "oldPass", placeholder: "old password" }),
        React.createElement(
            "label",
            { htmlFor: "newPass" },
            "New Password: "
        ),
        React.createElement("input", { id: "newPass", type: "password", name: "newPass", placeholder: "new password" }),
        React.createElement(
            "label",
            { htmlFor: "newPass2" },
            "New Password: "
        ),
        React.createElement("input", { id: "newPass2", type: "password", name: "newPass2", placeholder: "retype new password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", id: "passChangeSub", type: "submit", value: "Update Password" })
    );
};

const createLoginWindow = csrf => {
    ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

const createSignupWindow = csrf => {
    ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

const createPasswordChangeWindow = csrf => {
    ReactDOM.render(React.createElement(ChangePasswordWindow, { csrf: csrf }), document.querySelector("#content"));
};

//setup function attaches events to the page buttons
//login page is defaulted when user loads page, otherwise no UI will be shown
//(can be sign up page too)
const setup = csrf => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");
    const changePasswordButton = document.querySelector("#changePassword");

    signupButton.addEventListener("click", e => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", e => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    changePasswordButton.addEventListener("click", e => {
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
const getToken = () => {
    sendAjax('GET', '/getToken', null, result => {
        setup(result.csrfToken);
    });
};

//when the page loads, make a call to get our token
//rest of page will be set up to allow React components to show the pages
//without leaving the page.
$(document).ready(function () {
    getToken();
});
const handleError = message => {
    $("#errorMessage").text(message);
    console.log(message);
};

const redirect = response => {
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function (xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
