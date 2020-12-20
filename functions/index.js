const functions=require('firebase-functions');
const admin=require('firebase-admin');
const nodemailer=require('nodemailer');
admin.initializeApp({
  //credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://science-cookies.firebaseio.com"
});
//var serviceAccount = require("ScienceCookies-d5fb83753a2b");
const db=admin.firestore();

exports.createDBDoc=functions.region('us-east1').auth.user().onCreate((user)=>{
  let nname=user.displayName;
  if(nname==null){
    nname=user.email.slice(0,user.email.indexOf('@'));
    admin.auth().updateUser(user.uid,{
      displayName:nname,
    }).then(()=>{console.log(nname)}).catch(err=>{console.log(err)});
  }
  return db.collection('usersPublic').add({
    visible:true,
    name:nname,
    pic:user.photoURL,
    email:user.email,
    vmail:false,
    favn:[],
    favl:[],
    likedn:[],
    likedl:[],
    vfl:true,
    points:0,
    rank:'',
    block:admin.firestore.Timestamp.now(),
  }).then(res=>{
    return db.collection('users').doc(user.uid).set({
      fav:[],
      liked:[],
      favn:[],
      favl:[],
      likedn:[],
      likedl:[],
      points:0,
      rank:'',
      publicID:res.id,
      visible:true,
      vemail:false,
      vfl:true,
      rNews:true,
    })
  }).then(()=>{
    return db.collection('newsletters').doc('base').update({
      emails:admin.firestore.FieldValue.arrayUnion(user.email),
    });
  }).then(()=>{console.log('User with uid ',user.uid,' created')})
  .catch(err=>{console.log('User with uid ',user.uid,' not created: ',err)});
});
exports.delDBDoc=functions.region('us-east1').auth.user().onDelete((user)=>{
  return db.collection('users').doc(user.uid).get().then(doc=>{
    let publicID=doc.data().publicID;
    return db.collection('usersPublic').doc(publicID).delete();
  }).then(()=>{
    return db.collection('users').doc(user.uid).delete();
  }).then(()=>
  {
    return db.collection('newsletters').doc('base').update({
      emails:admin.firestore.FieldValue.arrayRemove(user.email),
    });
  }).then(()=>{console.log('User with uid ',user.uid,' deleted')})
  .catch(err=>{console.log('User with uid ',user.uid,' not deleted: ',err)});
});

exports.modAuth=functions.region('us-east1').https.onCall((uid)=>{
  if(uid=='wjcSAh7VsCQp909D6x6LzyapDkl1'||uid=='zle5Rq7VDtTkAp5Wm9WCWuEDGg33'||uid=='r6jLy9UI6kS9ijF6thrXxDyTN242')return true;
  console.log(uid);
  return false;
});

exports.addComment=functions.region('us-east1').https.onCall((data)=>{
  let comCount,comList,comFrm;
  return db.collection('usersPublic').doc(data.authKey).get().then(doc=>{
    let block=doc.data().block;
    if(block-admin.firestore.Timestamp.now()>0){
      return {
        res:-2,
        blc:block,
      };
    }
    else{
      return db.collection('galletas').doc(data.id).collection('coms').doc('1').get();
    }
  }).then(doc=>{
    if(doc.res==-2)return doc;
    console.log(doc);
    if(doc.exists){
      comList=doc.data().coms;
      comCount=doc.data().comCount;
    }else{
      comCount=0;
      comList=[];
    }
    comFrm={
      from:data.from,
      pic:data.pic,
      authKey:data.authKey,
      id:0,
      likes:0,
      text:data.text,
    };
    if(data.to==-1){
      comFrm.reps=[];
      comFrm.id=comList.length;
      comList.push(comFrm);
    }else{
      comFrm.id=comList[data.to].reps.length;
      comList[data.to].reps.push(comFrm);
    }
    comCount++;
    return db.collection('galletas').doc(data.id).collection('coms').doc('1').set({
      coms:comList,
      comCount:comCount,
    });
  }).then(some=>{
    console.log(some);
    if(some!=null&&some.res==-2)return some;
    if(data.to==-1){
      return {
        res:0,
        pos:comList.length-1,
        com:comFrm,
      };
    }else{
      return {
        res:1,
        pos:data.to,
        com:comFrm,
      };
    }
  }).catch(err=>{
    console.log(err);
    return {res:-1};
  });
});

exports.getUserPublic=functions.region('us-east1').https.onCall((data)=>{
  return db.collection('usersPublic').doc(data).get().then(doc=>{
    if(!doc.exists)return null;
    let userPublic={
      favn:doc.data().favn,
      favl:doc.data().favl,
      likedn:doc.data().likedn,
      likedl:doc.data().likedl,
      points:doc.data().points,
      rank:doc.data().rank,
      visible:doc.data().visible,
      vemail:doc.data().vemail,
      vfl:doc.data().vfl,
      ppic:doc.data().pic,
      pemail:doc.data().email,
      pname:doc.data().name,
    };
    if(!doc.data().visible)return null;
    if(!doc.data().vemail)userPublic.pemail=null;
    if(!doc.data().vfl){
      userPublic.favn=null;
      userPublic.favl=null;
      userPublic.likedn=null;
      userPublic.likedl=null;
    }
    return userPublic;
  }).catch(err=>{console.log(err)});
});

var transporter=nodemailer.createTransport({
  service:'***REMOVED***',
  auth:{
    user:'***REMOVED***',
    pass:'***REMOVED***',
  }
});
exports.newsletter=functions.region('us-east1').firestore.document('galletas/{galleta}').onCreate((snap,context)=>{
  return db.collection('newsletters').doc('base').get().then(doc=>{
    const emails=doc.data().emails;
    const dat=snap.data();
    const mailOptions={
      from: `Science Cookies <blog.sciencecookies@gmail.com>`,
      bcc: emails,
      subject: 'Nueva galleta',
      html:`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="format-detection" content="telephone=no">
            <meta name="x-apple-disable-message-reformatting">
            <title>Nueva galleta</title>
            <style type="text/css">
              @media screen {
                @font-face {
                  font-family: 'Fira Sans';
                  font-style: normal;
                  font-weight: 400;
                  src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v8/va9E4kDNxMZdWfMOD5Vvl4jLazX3dA.woff2) format('woff2');
                  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
                }
                @font-face {
                  font-family: 'Fira Sans';
                  font-style: normal;
                  font-weight: 400;
                  src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v8/va9E4kDNxMZdWfMOD5Vvk4jLazX3dGTP.woff2) format('woff2');
                  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
                }
                @font-face {
                  font-family: 'Fira Sans';
                  font-style: normal;
                  font-weight: 500;
                  src: local('Fira Sans Medium'), local('FiraSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnZKveRhf6Xl7Glw.woff2) format('woff2');
                  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
                }
                @font-face {
                  font-family: 'Fira Sans';
                  font-style: normal;
                  font-weight: 500;
                  src: local('Fira Sans Medium'), local('FiraSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnZKveQhf6Xl7Gl3LX.woff2) format('woff2');
                  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
                }
                @font-face {
                  font-family: 'Fira Sans';
                  font-style: normal;
                  font-weight: 700;
                  src: local('Fira Sans Bold'), local('FiraSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnLK3eRhf6Xl7Glw.woff2) format('woff2');
                  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
                }
                @font-face {
                  font-family: 'Fira Sans';
                  font-style: normal;
                  font-weight: 700;
                  src: local('Fira Sans Bold'), local('FiraSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnLK3eQhf6Xl7Gl3LX.woff2) format('woff2');
                  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
                }
                @font-face {
                  font-family: 'Fira Sans';
                  font-style: normal;
                  font-weight: 800;
                  src: local('Fira Sans ExtraBold'), local('FiraSans-ExtraBold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnMK7eRhf6Xl7Glw.woff2) format('woff2');
                  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
                }
                @font-face {
                  font-family: 'Fira Sans';
                  font-style: normal;
                  font-weight: 800;
                  src: local('Fira Sans ExtraBold'), local('FiraSans-ExtraBold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnMK7eQhf6Xl7Gl3LX.woff2) format('woff2');
                  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
                }
              }
          
              #outlook a {
                padding: 0;
              }
          
              .ReadMsgBody,
              .ExternalClass {
                width: 100%;
              }
          
              .ExternalClass,
              .ExternalClass p,
              .ExternalClass td,
              .ExternalClass div,
              .ExternalClass span,
              .ExternalClass font {
                line-height: 100%;
              }
          
              div[style*="margin: 14px 0"],
              div[style*="margin: 16px 0"] {
                margin: 0 !important;
              }
          
              table,
              td {
                mso-table-lspace: 0;
                mso-table-rspace: 0;
              }
          
              table,
              tr,
              td {
                border-collapse: collapse;
              }
          
              body,
              td,
              th,
              p,
              div,
              li,
              a,
              span {
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
                mso-line-height-rule: exactly;
              }
          
              img {
                border: 0;
                outline: none;
                line-height: 100%;
                text-decoration: none;
                -ms-interpolation-mode: bicubic;
              }
          
              a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: none !important;
              }
          
              body {
                margin: 0;
                padding: 0;
                width: 100% !important;
                -webkit-font-smoothing: antialiased;
              }
          
              .pc-gmail-fix {
                display: none;
                display: none !important;
              }
          
              @media screen and (min-width: 621px) {
                .pc-email-container {
                  width: 620px !important;
                }
              }
          
              @media screen and (max-width:620px) {
                .pc-sm-p-24-20-30 {
                  padding: 24px 20px 30px !important
                }
                .pc-sm-p-35-30-40 {
                  padding: 35px 30px 40px !important
                }
                .pc-sm-mw-100pc {
                  max-width: 100% !important
                }
                .pc-sm-m-0-auto {
                  float: none !important;
                  margin: auto !important
                }
                .pc-sm-p-21-10-14 {
                  padding: 21px 10px 14px !important
                }
                .pc-sm-h-20 {
                  height: 20px !important
                }
              }
          
              @media screen and (max-width:525px) {
                .pc-xs-p-15-10-20 {
                  padding: 15px 10px 20px !important
                }
                .pc-xs-h-100 {
                  height: 100px !important
                }
                .pc-xs-br-disabled br {
                  display: none !important
                }
                .pc-xs-fs-30 {
                  font-size: 30px !important
                }
                .pc-xs-lh-42 {
                  line-height: 42px !important
                }
                .pc-xs-p-20-20-25 {
                  padding: 20px 20px 25px !important
                }
                .pc-xs-p-5-0 {
                  padding: 5px 0 !important
                }
              }
            </style>
          </head>
          <body style="width: 100% !important; margin: 0; padding: 0; mso-line-height-rule: exactly; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #fff8e7" class="">
            <div style="display: none !important; visibility: hidden; opacity: 0; overflow: hidden; mso-hide: all; height: 0; width: 0; max-height: 0; max-width: 0; font-size: 1px; line-height: 1px; color: #151515;">¡Science Cookies ha cocinado una nueva galleta!</div>
            <div style="display: none !important; visibility: hidden; opacity: 0; overflow: hidden; mso-hide: all; height: 0; width: 0; max-height: 0; max-width: 0;">
              ‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;
            </div>
            <table class="pc-email-body" width="100%" bgcolor="#fff8e7" border="0" cellpadding="0" cellspacing="0" role="presentation" style="table-layout: fixed;">
              <tbody>
                <tr>
                  <td class="pc-email-body-inner" align="center" valign="top">
                    <table class="pc-email-container" width="100%" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto; max-width: 620px;">
                      <tbody>
                        <tr>
                          <td align="left" valign="top" style="padding: 0 10px;">
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tbody>
                                <tr>
                                  <td height="20" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tbody>
                                <tr>
                                  <td bgcolor="#000000" valign="top" style="background-color: #343a40; border-radius: 8px; background-repeat: no-repeat; background-position: center top">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td class="" valign="top" style="padding: 20px 30px 20px" pc-default-class="pc-sm-p-24-20-30 pc-xs-p-15-10-20" pc-default-padding="24px 30px 40px">
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                              <tbody>
                                                  <tr>
                                                      <td valign="top" align="center">
                                                          <a href="https://sciencecookies.net" style="text-decoration: none;"><img src="https://sciencecookies.net/img/scmed/NLogoHalign.png" width="520" height="520" alt="" style="border: 0; line-height: 100%; outline: 0; -ms-interpolation-mode: bicubic; display: block; color: #343a40; max-width: 100%; height: auto; Margin: 0 auto; border-radius: 90px;"></a>
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td height="10" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                                                  </tr>
                                              </tbody>
                                              <tbody>
                                                <tr>
                                                  <td class="pc-xs-fs-30 pc-xs-lh-42 pc-fb-font" valign="top" style="padding: 13px 10px 0; letter-spacing: -0.7px; line-height: 46px; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 36px; font-weight: 800; color: #f8f9fa; text-align:center">¡Se ha cocinado una nueva galleta!</td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                              <tbody>
                                <tr>
                                  <td height="8" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                              <tbody>
                                <tr>
                                  <td class="pc-sm-p-35-30-40 pc-xs-p-20-20-25" valign="top" bgcolor="#343a40" style="padding: 35px 40px 40px; background-color: #343a40; border-radius: 8px">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td height="0" style="font-size: 1px; line-height: 1px">&nbsp;</td>
                                        </tr>
                                      </tbody>
                                      <tbody>
                                        <tr>
                                          <td valign="top" align="center">
                                            <a href="https://sciencecookies.net/galletas/`+dat.url+`" style="text-decoration: none;"><img src="https://sciencecookies.net/galletas/`+dat.picUrl+`" width="520" height="520" alt="" style="border: 0; line-height: 100%; outline: 0; -ms-interpolation-mode: bicubic; display: block; color: #151515; max-width: 100%; height: auto; Margin: 0 auto;"></a>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td height="15" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                                        </tr>
                                      </tbody>
                                      <tbody>
                                        <tr>
                                        </tr>
                                        <tr>
                                          <td height="8" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                                        </tr>
                                      </tbody>
                                      <tbody>
                                      <tr>
                                          <td class="pc-fb-font" style="font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 300; line-height: 28px; letter-spacing: -0.2px; color: #f8f9fa" valign="top" align="center">Autor(es):`+dat.authrs+`</td>
                                      </tr>
                                      <tr>
                                          <td height="10" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                                      </tr>
                                      </tbody>
                                      <tbody>
                                        <tr>
                                          <td class="pc-fb-font" style="font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; line-height: 34px; letter-spacing: -0.4px; color: #f8f9fa" valign="top" align="center">`+dat.title+`</td>
                                        </tr>
                                        <tr>
                                          <td height="10" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                                        </tr>
                                      </tbody>
                                      <tbody>
                                        <tr>
                                          <td class="pc-fb-font" style="font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 300; line-height: 28px; letter-spacing: -0.2px; color: #f8f9fa" valign="top" align="center">`+dat.descrip+`</td>
                                        </tr>
                                        <tr>
                                          <td height="20" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                                        </tr>
                                      </tbody>
                                      <tbody>
                                        <tr>
                                          <td style="padding-top: 5px" valign="top" align="center">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                                              <tbody>
                                                <tr>
                                                  <td style="border-radius: 8px; padding: 13px 17px; background-color: #663399" bgcolor="#663399" valign="top" align="center">
                                                    <a href="https://sciencecookies.net/galletas/`+dat.url+`" style="line-height: 24px; text-decoration: none; word-break: break-word; font-weight: 500; display: block; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 16px; color: #f8f9fa">Leer galleta</a>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                              <tbody>
                                <tr>
                                  <td height="8" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                              <tbody>
                                <tr>
                                  <td class="pc-sm-p-21-10-14 pc-xs-p-5-0" style="padding: 21px 20px 14px 20px; background-color: #343a40; border-radius: 8px" valign="top" bgcolor="#343a40" role="presentation">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td style="font-size: 0;" valign="top">
                                            <div class="pc-sm-mw-100pc" style="display: inline-block; width: 100%; max-width: 560px; vertical-align: top;">
                                              <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                                <tbody>
                                                  <tr>
                                                    <td style="padding: 20px;" valign="top">
                                                      <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                                        <tbody>
                                                          <tr>
                                                            <td class="pc-fb-font" style="font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 33px; font-weight: 500; line-height: 24px; letter-spacing: -0.2px; text-align: center;color: #f8f9fa" valign="top">Science Cookies</td>
                                                          </tr>
                                                          <tr>
                                                            <td height="13" style="line-height: 1px; font-size: 1px">&nbsp;</td>
                                                          </tr>
                                                        </tbody>
                                                        <tbody>
                                                          <tr>
                                                            <td class="pc-fb-font" style="font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 18px; line-height: 20px; letter-spacing: -0.2px; color: #f8f9fa" valign="top">
                                                              <div style="text-align: center;">Artículos de ciencia con chispas de chocolate</div>
                                                            </td>
                                                          </tr>
                                                          <tr>
                                                            <td class="pc-sm-h-20" height="30" style="line-height: 1px; font-size: 1px">&nbsp;</td>
                                                          </tr>
                                                        </tbody>
                                                        <tbody>
                                                          <tr>
                                                            <td style="font-family: Arial, sans-serif; font-size: 19px; text-align:center" valign="top">
                                                              <a href="https://twitter.com/_sciencecookies" style="text-decoration: none;"><img src="https://sciencecookies.net/img/scmed/tt.png" width="30" height="26" alt="" style="border: 0; line-height: 100%; outline: 0; -ms-interpolation-mode: bicubic; color: #ffffff;"></a>
                                                              <span>&nbsp;&nbsp;</span>
                                                              <a href="http://instagram.com/sciencecookies" style="text-decoration: none;"><img src="https://sciencecookies.net/img/scmed/ig.png" width="30" height="30" alt="" style="border: 0; line-height: 100%; outline: 0; -ms-interpolation-mode: bicubic; color: #ffffff;"></a>
                                                              <span>&nbsp;&nbsp;</span>
                                                              <a href="http://www.facebook.com/Science-Cookies-106549557818780/" style="text-decoration: none;"><img src="https://sciencecookies.net/img/scmed/fb.png" width="30" height="30" alt="" style="border: 0; line-height: 100%; outline: 0; -ms-interpolation-mode: bicubic; color: #ffffff;"></a>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                              <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                                <tbody>
                                                  <tr>
                                                    <td style="padding: 20px;" valign="top">
                                                      <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                                        <tbody>
                                                          <tr>
                                                            <td class="pc-fb-font" style="font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 500; line-height: 24px; text-align: center;" valign="top">
                                                              <a href="https://sciencecookies.net/perfil.html?p=0" style="text-decoration: none; color: #6c757d;">Cancelar suscripción</a>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tbody>
                                <tr>
                                  <td height="20" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="pc-gmail-fix" style="white-space: nowrap; font: 15px courier; line-height: 0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </div>
          </body>
          </html>`,
      };
    return transporter.sendMail(mailOptions, (error, data) => {
      if(error){
        console.log(error);
      }
      console.log("Sent!");
    });
  }).catch(err=>{
    console.log(err);
    return;
  })
});

exports.uptPop=functions.region('us-east1').pubsub.schedule('every 24 hours').onRun((context)=>{
  return admin.database().ref('uptCook').once('value',data=>{
    Object.keys(data.val()).forEach(itm=>{
      admin.database().ref('galletas/'+itm).once('value',cook=>{
        db.collection('galletas').doc(itm).update({
          pop:cook.val().pop,
          likes:cook.val().likes,
          favs:cook.val().favs
        });
      });
    });
    admin.database().ref('uptCook').remove();
    return null;
  });
});