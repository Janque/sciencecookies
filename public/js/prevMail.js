var uid;
firebase.auth().onAuthStateChanged(user => {
    let modAuth = firebase.app().functions('us-east1').httpsCallable('publish-modAuth');
    if (user) {
        uid=user.uid;
        modAuth(uid).then(res => {
            if (!res.data.mod)window.location.href='https://sciencecookies.net';
        }).catch(err => console.log(err));
    } else {
        console.log('a');
        window.location.href='https://sciencecookies.net';
    }
});