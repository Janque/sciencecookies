import { createContext, useContext, useEffect, useState } from 'react';

export default function useLogicAlert() {
    const [alertText, setAlertText] = useState('');
    const [alertType, setAlertType] = useState('danger');
    const [alertId, setAlertId] = useState('defaultAlert');
    const [alertShow, setAlertShow] = useState(false);

    const showAlert = (txt, type, id = 'defaultAlert') => {
        setAlertText(txt);
        setAlertType(type);
        setAlertId(id);
        setAlertShow(true);
    }

    useEffect(() => {
        if (alertShow) {
            setTimeout(() => {
                setAlertShow(false);
            }, 3000);
        }
    }, [alertShow]);

    return {
        alertText,
        alertType,
        alertId,
        showAlert,
        alertShow
    }
}

const AlertContext = createContext({
    alertText: '',
    alertType: 'danger',
    alertId: null,
    showAlert: async () => { },
    alertShow: false
});

export function AlertProvider({ children }) {
    return <AlertContext.Provider value={useLogicAlert()}>{children}</AlertContext.Provider>;
}

export const useAlert = () => useContext(AlertContext);



export function AlertComponent(props) {
    const { alertText, alertType, alertId, alertShow } = useAlert();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (alertShow) {
            if (alertId == props.id) {
                setVisible(true);
            }
        } else {
            setVisible(false);
        }
    }, [alertShow]);

    return (
        <div className={`alert alert-${alertType} alert-dismissible fade ${visible ? 'show' : ''} fixed-bottom`} role="alert">
            <span dangerouslySetInnerHTML={{ __html: alertText }}></span>
            <button type="button" className="close" onClick={() => { setVisible(false) }}>
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    );
}