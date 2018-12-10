// handle the error message
const handleError = (message) => {

    $( function() {
        $( "#errorCont" ).dialog({
            height: 250,
            width: 500,
            modal: true,
            resizable: false,
            draggable: false,
            dialogClass:"myClass"
            
        });
      } );
    $("#errorMessage").text("Error: " + message);
    // $("#errorCont").animate({width:'toggle'},350);
    // alert(message);
    console.log(message);
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