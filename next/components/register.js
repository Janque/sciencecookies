import { useRouter } from "next/router";
import StyledFirebaseAuth from './StyledFirebaseAuth';
import { EmailAuthProvider, GoogleAuthProvider, FacebookAuthProvider, ProviderId } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export default function Register(props) {
    const router = useRouter();

    const uiConfig = {
        signInFlow: 'popup',
        signInSuccessUrl: router.asPath,
        signInOptions: [
            GoogleAuthProvider.PROVIDER_ID,
            FacebookAuthProvider.PROVIDER_ID,
            {
                provider: ProviderId.PASSWORD,
                signInMethod: EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
                forceSameDevice: false,
                requireDisplayName: true
            }
        ],
        tosUrl: 'https://sciencecookies.net/docs/tos',
        privacyPolicyUrl: 'https://sciencecookies.net/docs/privacidad'
    };

    return (
        <div id="mdlRgstr" className="modal fade" data-backdrop="static" data-keyboard="false" tabIndex="-1" role="dialog" aria-labelledby="mdlRgsL" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 id="mdlRgsL" className="modal-title">{router.locale == 'es' ? 'Inicia sesión o regístrate' : 'Log in or register'}</h5>
                        {(props.site == "drafts" || props.site == "edit" || props.site == "draftsCal" || props.site == "editCal" || props.site == "mailPrev") ? null :
                            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                        }
                    </div>
                    <div className="modal-body">
                        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
                    </div>
                </div>
            </div>
        </div>
    );
};