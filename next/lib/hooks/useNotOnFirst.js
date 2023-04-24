import { useEffect, useRef } from 'react';

export default function useOnlineStatus(func, states = [], condition = true) {
    const isFirst = useRef(true);
    useEffect(() => {
        if (condition) {
            if (!isFirst.current) {
                func();
            } else {
                isFirst.current = false;
            }
        }
    }, states);
    return true;
}