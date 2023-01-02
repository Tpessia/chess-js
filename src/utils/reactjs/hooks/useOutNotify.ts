import { MutableRefObject, useEffect } from 'react';

// Hook that alerts clicks outside of the passed ref
export default function useOutNotify(ref: MutableRefObject<any>, callback: (ev: MouseEvent) => void) {
    useEffect(() => {
        const handleClickOutside = (ev: MouseEvent) => {
            if (ref.current && !ref.current.contains(ev.target)) callback(ev);
        };

        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Unbind the event listener on clean up
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ref, callback]);
}
