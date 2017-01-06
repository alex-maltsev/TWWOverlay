window.fbAsyncInit = function() {
    FB.init({
      appId      : '1199157660137686',
      xfbml      : true,
      version    : 'v2.5'
    });

    FB.getLoginStatus(function(response) {
        handleLoginStatusResponse(response);
    });
};

(function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "http://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Preferred profile image size
var IMAGE_SIZE = 320;

function handleLoginStatusResponse(response) {
    var profileImageElement = document.getElementById('profile_image');
    var placeholderUrl = "images/placeholder.png";

    if (response.status === 'connected') {
        // Logged into the app and Facebook.
        document.getElementById('status_div').innerHTML = '';
        createFinalImage(response.authResponse.userID);
    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not the app.
        document.getElementById('status_div').innerHTML = 'Please log into this app.';
        profileImageElement.src = placeholderUrl;
    } else {
        // The person is not logged into Facebook
        document.getElementById('status_div').innerHTML = 'Please log into Facebook.';
        profileImageElement.src = placeholderUrl;
    }
}

function createFinalImage(userID) {
    var profilePic = new Image();
    profilePic.setAttribute('crossOrigin', 'anonymous');
    profilePic.src = "http://graph.facebook.com/" + userID + "/picture?type=square&width=" + IMAGE_SIZE + "&height=" + IMAGE_SIZE;
    
    profilePic.onload = function() {
        canvas = document.createElement("canvas");
        canvas.width = IMAGE_SIZE;
        canvas.height = IMAGE_SIZE;
        var context = canvas.getContext("2d");
        context.drawImage(profilePic, 0, 0, profilePic.width, profilePic.height, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
        var overlay = new Image();
        overlay.src = "images/overlay.png";
        overlay.onload = function() {
            context.drawImage(overlay, 0, 0);
            var profileImageElement = document.getElementById('profile_image');
            profileImageElement.src = canvas.toDataURL();
        }
    }
}

function logIn() {
    FB.login(handleLoginStatusResponse, {scope: "user_photos,publish_actions"});
}

function logOut() {
    FB.api("/me/permissions", "delete", function(response){ 
        handleLoginStatusResponse({status: "not_authorized"});
    });
}