import { Navigate } from 'react-router-dom';

interface Props {
    children: JSX.Element;
    auth?: boolean | null;
}

const LoggedRoute: React.FC<Props> = ({ children, auth }) => {
    if (auth === undefined) return <></>;
    if (auth === true) return children || <></>;
    return <Navigate to='/login' />; // auth === null
};

export default LoggedRoute;
