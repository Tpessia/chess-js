import { rndNumber } from '@/utils';
import { useState } from 'react';

export default function useForceUpdate() {
    // eslint-disable-next-line
    const [value, setValue] = useState<number>(0); // integer state
    return () => setValue(rndNumber()); // update the state to force render
}
