# TWWOverlay
Applying an overlay image to a Facebook user's profile image.

This project uses fragments of code from the following:
- https://github.com/cmowenby/Profile-Picture-Overlay
- https://gist.github.com/chrisxwan/db1ffa00c739690c71a7
- https://github.com/ashwin47/Fb-badge

What is distinct here is how the work is shared between client-side (user's browser) and server side. The profile picture with added overlay is generated in the browser, thus saving a lot of CPU cycles for the server. The user can immediately see the resulting picture. If the user chooses to do so, they can upload the image to Facebook. This uploads the image to our server, makes it temporarily exposed "to the world", and ask Facebook to grab it. Indepently of the outcome, the image file gets immediately wiped off our server. (This is unlike in https://github.com/cmowenby/Profile-Picture-Overlay, where the server expects a special call from the client to delete the image file, which makes server more susceptible to malicious client behavior).

## Setup
- Register your app on Facebook. This will give you app ID and app secret.
- Insert your app ID at the top of `js/profile-pic.js` file (see the line `var APP_ID = ...`)
- Create file `cred.php` with the following content:
```
<?php
    $_APP_ID = 'your app ID';
    $_APP_SECRET = 'your app secret';
    $_BASE_URL = 'http://yourserver.com/';
?>
```
- **NOTE:** Server side uses Facebook PHP SDK, which requires PHP 5.4 or higher. So make sure that your server is running a suitable version of PHP.

## How it works
1. When index.html loads, it triggers a check to see if the user has previously given permissions to the app. If not, then user is presented with a placeholder image, 'Log in' button, and a hint to log in.
2. Once the user has logged in / given the app permissions, the script can get user's ID and an access token necessary for accessing Facebook API. 
3. JavaScript code fetches user's profile image, creates the final image by adding the overlay image over user's profile image. The calculated image is shown to the user, along with a text area for a Facebook post message, a checkbox allowing to select whether to post to user's timeline, and 'Upload' button.
4. When user presses 'Upload' button, it triggers a POST request to `upload.php`, carrying the following: actual image data (as binary blob), Facebook access token, post message, and a flag saying whether to post to timeline.
5. `upload.php` performs the following actions:
  - Move received image file from system temp folder to `uploads` folder, renaming it to a unique number-based name.
  - Make a call via Facebook SDK to upload the image to user's account. The only way to pass the image to Facebook is by giving it a URL from where the image can be downloaded, so we pass it the URL pointing to the image in `uploads` folder.
  - When the call to Facebook SDK completes the image file gets deleted from `uploads`. In case of success, `upload.php` responds with JSON containing the ID assigned to the uploaded image by Facebook. (In case of error, the script responds with JSON containing error message).
6. If client size script receives successful response, it redirects the user to Facebook page showing the just-uploaded image. Unfortunately, **it is impossible to programmatically assign an image as profile image**, so the user will need to do that by hand on the page they see.
