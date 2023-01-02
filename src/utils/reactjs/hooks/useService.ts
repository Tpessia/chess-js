import { useState } from 'react';
import { container, InjectionToken } from 'tsyringe';

// Hook to inject tsyringe services
export default function useService<T>(token: InjectionToken<T>) {
    const [service, setService] = useState<T>();
    if (!service) setService(container.resolve(token));
    return service;
}
