import React from 'react';
import {NavLink} from "react-router-dom";
import {TokenService} from "../api/TokenService";
import Cookies from "js-cookie";
import {API_URL, AUTH_USERNAME_COOKIE} from "../api/config";

const NavBar = () => {
    function logout() {
        TokenService.logout();
        Cookies.remove(AUTH_USERNAME_COOKIE);
        window.location.replace(`${API_URL}/login?logout`);
    }

    return (
        <div className="row">
            <div className="col">
                <nav className="navbar navbar-light navbar-expand-md py-3">
                    <div className="container">
                        <a className="navbar-brand d-flex align-items-center" href="#">
                            <i className='fas fa-pen-ruler'/>
                            <span>Bolimond Admin</span>
                        </a>
                        <button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#app-nav">
                            <span className="visually-hidden">Toggle navigation</span>
                            <span className="navbar-toggler-icon"/>
                        </button>
                        <div className="collapse navbar-collapse" id="app-nav">
                            <ul className="navbar-nav me-auto">
                                <li className="nav-item">
                                    <NavLink to='/properties' className='nav-link text-md-center'>
                                        <i className="fas fa-list"/>&nbsp;Properties
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to='/users' className='nav-link text-md-center'>
                                        <i className="fas fa-user"/>&nbsp;Users
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to='/sections' className='nav-link text-md-center'>
                                        <i className="fas fa-th-large"/>&nbsp;Sections
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to='/categories' className='nav-link text-md-center'>
                                        <i className="fas fa-th"/>&nbsp;Categories
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to='/main-page' className='nav-link text-md-center'>
                                        <i className="fas fa-home"/>&nbsp;Main page
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to='/icons' className='nav-link text-md-center'>
                                        <i className="fas fa-link"/>&nbsp;Links
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to='/projects' className='nav-link text-md-center'>
                                        <i className="fas fa-gem"/>&nbsp;Projects
                                    </NavLink>
                                </li>
                            </ul>
                            <button className="btn btn-primary" type="button" onClick={logout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default NavBar;