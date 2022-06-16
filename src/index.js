import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import RequireAuth from "./component/RequireAuth";
import App from './App';
import Categories from "./page/Categories/Categories";
import Icons from "./page/Icons/Icons";
import MainPageStructure from "./page/MainPageStructure/MainPageStructure";
import Projects from "./page/Projects/Projects";
import Properties from "./page/Properties/Properties";
import Sections from "./page/Sections/Sections";
import Users from "./page/Users/Users";
import NotFoundRedirect from "./component/NotFoundRedirect";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/admin' element={<RequireAuth><App/></RequireAuth>}>
                    <Route path='properties' element={<Properties/>}/>
                    <Route path='users' element={<Users/>}/>
                    <Route path='sections' element={<Sections/>}/>
                    <Route path='categories' element={<Categories/>}/>
                    <Route path='main-page' element={<MainPageStructure/>}/>
                    <Route path='icons' element={<Icons/>}/>
                    <Route path='projects' element={<Projects/>}/>
                </Route>
                <Route path="*" element={<NotFoundRedirect/>}/>
                {/*<Route path="*" element={<Navigate to="/properties" replace={true}/>}/>*/}
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
