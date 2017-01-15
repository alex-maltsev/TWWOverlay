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
     js.src = 'http://connect.facebook.net/en_US/sdk.js';
     fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Preferred profile image size
var IMAGE_SIZE = 480;
// Final image, i.e. profile image with overlay
var finalImage;
// Object received from successful authorization (includes userID and access token)
var authData;

function handleLoginStatusResponse(response) {
    var profileImageElement = document.getElementById('profile_image');
    var placeholderUrl = 'images/placeholder.png';
    var loginButton = document.getElementById('login_button');
    var logoutButton = document.getElementById('logout_button');
    var uploadDiv = document.getElementById('upload_div');
    
    console.log('Facebook login status: ' + JSON.stringify(response));

    if (response.status === 'connected') {
        // Logged into the app and Facebook.
        setAlertMessage('');
        authData = response.authResponse;
        createFinalImage(authData.userID);
        loginButton.style.display = 'none';
        logoutButton.style.display = 'inline-block';
        uploadDiv.style.display = 'block';
    } else { 
        if (response.status === 'not_authorized') {
            setAlertMessage('Please log into this app');
        } else {
            setAlertMessage('Please log into Facebook');
        }
       
        profileImageElement.src = placeholderUrl;
        loginButton.style.display = 'inline-block';
        logoutButton.style.display = 'none';
        uploadDiv.style.display = 'none';
    }
}

function createFinalImage(userID) {
    var profilePic = new Image();
    profilePic.setAttribute('crossOrigin', 'anonymous');
    profilePic.src = 'http://graph.facebook.com/' + userID 
        + '/picture?type=square&width=' + IMAGE_SIZE + '&height=' + IMAGE_SIZE;
    
    profilePic.onload = function() {
        canvas = document.createElement('canvas');
        canvas.width = IMAGE_SIZE;
        canvas.height = IMAGE_SIZE;
        var context = canvas.getContext('2d');
        context.drawImage(profilePic, 0, 0, profilePic.width, profilePic.height, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
        var overlay = new Image();
        overlay.src = 'images/overlay.png';
        overlay.onload = function() {
            context.drawImage(overlay, 0, 0);
            finalImage = canvas.toDataURL('image/jpeg', 0.8);
            document.getElementById('profile_image').src = finalImage;
        }
    }
}

function uploadImage() {
    var message = document.getElementById('message_area').value;
    var shouldPost = document.getElementById('should_post_checkbox').checked;
    var formData = new FormData();
    formData.append('img', dataURLtoBlob(finalImage));
    formData.append('token', authData.accessToken);
    formData.append('message', message);
    formData.append('should_post', shouldPost);
    
    makeSpinnerVisible(true);
    setAlertMessage('');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'upload.php');
    xhr.onload = function() {
        makeSpinnerVisible(false);
        if (xhr.status != 200) {
            reportUploadError('Network error ' + xhr.status);
            return;
        }
        var response = JSON.parse(xhr.responseText);
        console.log(response);
        if (response.success) {
            handleUploadSuccess(response.photo_id);
        } else {
            reportUploadError(response.error);
        }
    };    
    xhr.send(formData);
}

function handleUploadSuccess(photo_id) {
    // Redirecting this window to Facebook page showing our just-uploaded image with overlay.
    // There the user will be able to set it as their profile image.
    document.location.assign('https://www.facebook.com/photo.php?fbid=' + photo_id + '&makeprofile=1');
}

function reportUploadError(errorMessage) {
    setAlertMessage('Upload failed: ' + errorMessage)
}

function setAlertMessage(message) {
    document.getElementById('status_div').innerHTML = message;
}

function makeSpinnerVisible(visible) {
    var spinner = document.getElementById('spinner');
    spinner.style.display = (visible) ? 'block' : 'none';
}

// From http://stackoverflow.com/a/30470303/2857040
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

function logIn() {
    FB.login(handleLoginStatusResponse, {scope: 'user_photos,publish_actions'});
}

function logOut() {
    FB.api('/me/permissions', 'delete', function(response){ 
        handleLoginStatusResponse({status: 'not_authorized'});
    });
}