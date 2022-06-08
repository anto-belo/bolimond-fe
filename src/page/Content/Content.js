import React from 'react';
import Sections from "./Sections/Sections";
import Categories from "./Categories/Categories";
import MainPageStructure from "./MainPageStructure/MainPageStructure";

const Content = () => {
    return (
        <>
            <Sections/>
            <Categories/>
            <MainPageStructure/>
        </>
    );
};

export default Content;