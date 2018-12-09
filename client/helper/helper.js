
// handle the error message
const handleError = (message) => {
    $("#errorMessage").text(message);
    alert(message);
    console.log("TODO: include a better eroor handling message");
};

// redirect to the specified page
const redirect = (response) => {
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
        error: function(xhr, status, error){
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};