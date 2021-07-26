firebase.auth().onAuthStateChanged((e=>{let t=firebase.app().functions("us-east1").httpsCallable("publish-modAuth");e?t(e.uid).then((e=>{e.data.mod||(window.location.href="https://sciencecookies.net")})).catch((e=>console.log(e))):window.location.href="https://sciencecookies.net"}));
//# sourceMappingURL=prevMail.js.map
