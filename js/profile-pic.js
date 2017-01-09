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
// Final image, i.e. profile image with overlay
var finalImage;

function handleLoginStatusResponse(response) {
    var profileImageElement = document.getElementById('profile_image');
    var placeholderUrl = "images/placeholder.png";
    console.log("Facebook login status: " + JSON.stringify(response));

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
            finalImage = canvas.toDataURL('image/jpeg', 0.8);
            document.getElementById('profile_image').src = finalImage;
        }
    }
}

function uploadImage() {
    var formData = new FormData();
    formData.append('img', dataURLtoBlob(finalImage));

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'upload.php');
    xhr.onload = function() {
        console.log("Response received, with status " + xhr.status);
        console.log(xhr.responseText);
    };    
    xhr.send(formData);
}

// From http://stackoverflow.com/a/30470303/2857040
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    console.log("MIME: " + mime + " , data length: " + n);
    while(n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

function logIn() {
    FB.login(handleLoginStatusResponse, {scope: "user_photos,publish_actions"});
}

function logOut() {
    FB.api("/me/permissions", "delete", function(response){ 
        handleLoginStatusResponse({status: "not_authorized"});
    });
}