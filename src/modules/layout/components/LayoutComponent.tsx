import { NotificationService } from '@/services/NotificationService';
import React, { PropsWithChildren } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './LayoutComponent.scss';

const LayoutComponent: React.FC<PropsWithChildren> = (props) => {
    // Render

    return (
        <>
            <NotificationService.ToastContainer />

            <div className="layout">
                <header className="header">
                    <h1 className="title">
                        <Link to="/">Chess.js</Link>
                    </h1>

                    <nav className="desktop-navbar">
                        <ul>
                            <li>
                                <NavLink end to="/" className={({ isActive }) => isActive ? 'active' : 'inactive'}>Play</NavLink>
                            </li>
                        </ul>
                    </nav>
                </header>

                {/* <nav className="mobile-navbar">
                    <ul>
                        <li className="ripple">
                            <NavLink end to="/" className={({ isActive }) => isActive ? 'active' : 'inactive'}>
                                <i className="fa-solid fa-chess" />
                            </NavLink>
                        </li>
                        <li className="ripple">
                            <NavLink end to="/" className={({ isActive }) => isActive ? 'active' : 'inactive'}>
                                <i className="fa-solid fa-chess" />
                            </NavLink>
                        </li>
                    </ul>
                </nav> */}

                <main className="content">
                    <div className="container">{props.children}</div>
                </main>
            </div>
        </>
    );
};

export default LayoutComponent;
