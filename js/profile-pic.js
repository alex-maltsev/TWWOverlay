window.fbAsyncInit = function() {
    FB.init({
      appId      : '1199157660137686',
      xfbml      : true,
      version    : 'v2.5'
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

function loginCallback(response) {
    document.getElementById("login-button").disabled = 'disabled';
    
    if (response.authResponse) {
        var profilePic = new Image();
        profilePic.setAttribute('crossOrigin', 'anonymous');
        profilePic.src = "http://graph.facebook.com/" + response.authResponse.userID + "/picture?type=square&width=" + IMAGE_SIZE + "&height=" + IMAGE_SIZE;
        
        profilePic.onload = function() {
            console.log("Profile pic loaded from URL " + profilePic.src);

            canvas = document.createElement("canvas");
            canvas.width = IMAGE_SIZE;
            canvas.height = IMAGE_SIZE;
            var context = canvas.getContext("2d");
            context.drawImage(profilePic, 0, 0, profilePic.width, profilePic.height, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
            var overlay = new Image();
            overlay.src = "images/overlay.png";
            overlay.onload = function() {
                context.drawImage(overlay, 0, 0);
                var newProfPic = canvas.toDataURL();
                var image = new Image();
                image.src = canvas.toDataURL();
                document.getElementById('profile_image_div').appendChild(image);
            }
        }
    } else {
        console.log("Not authorized!");
    }
}

function login(){
    FB.login(loginCallback, {scope: "user_photos,publish_actions"});
}