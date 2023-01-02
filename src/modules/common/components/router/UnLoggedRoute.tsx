import { Navigate } from 'react-router-dom';

interface Props {
    children: JSX.Element;
    auth?: boolean | null;
}

const UnLoggedRoute: React.FC<Props> = ({ children, auth }) => {
    if (auth === true) return <Navigate to='/' />;
    return children || <></>;
};

export default UnLoggedRoute;
