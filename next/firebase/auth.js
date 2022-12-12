/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as authSignOut } from 'firebase/auth';
import { auth } from './firebase';
import { useAlert } from '../components/alert';
import { useRouter } from 'next/router';
import { userIsMod } from './firestore';

export default function useFirebaseAuth() {
    const [authUser, setAuthUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const clear = () => {
        setAuthUser(null);
        setIsLoading(false);
    };

    const authStateChanged = async (user) => {
        setIsLoading(true);
        if (!user) {
            clear();
            return;
        }
        setAuthUser({
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid,
            mod: userIsMod(user.uid)
        });
        setIsLoading(false);
    };

    const { showAlert } = useAlert();
    const signOut = () => authSignOut(auth).then(() => {
        clear();
        if (router.locale == 'es') {
            showAlert('Haz cerrado tu sesión correctamente. <strong>!Vuelve pronto!</strong>', 'warning');
        } else {
            showAlert('You have successfully closed your session. <strong>! Come back soon! </strong>', 'warning');
        }
    });

    // Listen for Firebase Auth state change
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, authStateChanged);
        return () => unsubscribe();
    }, []);

    return {
        authUser,
        isLoading,
        signOut
    };
}

const AuthUserContext = createContext({
    authUser: null,
    isLoading: true,
    signOut: async () => { }
});

export function AuthUserProvider({ children }) {
    const auth = useFirebaseAuth();
    return <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>;
}

export const useAuth = () => useContext(AuthUserContext);