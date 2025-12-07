import React from "react";
import HeaderTemplate from "../components/header/HeaderTemplate";
import Profile from "../components/UI/Profile/Profile";
import Btn from "../components/UI/button/Btn";

class HeaderContent {
    constructor(content, divClasses) {
        this.content = content
        this.divClasses = divClasses
    }

    _getClasses() {
        return(this.divClasses.join(" "))
    }
}

const Elements = [
    new HeaderContent(content=<div>asd</div>, divClasses=["col-lg-3", "col-md-12"]),
    new HeaderContent(content=<Btn onClick={() => {
                        if(AS)
                            {setAS(false)} 
                        else 
                            {setAS(true); setSearch(false);}}}>
                        Авторы</Btn>, divClasses=["col-lg-2", "col-md-6", "col-12"]),
    new HeaderContent(content=<Link style={{textDecoration:"none"}} to="/GenresFilter"><Btn>Категории</Btn></Link>, divClasses=["col-lg-2", "col-md-6", "col-12"]),
    new HeaderContent(content=<Btn>Группы</Btn>, divClasses=["col-lg-2", "col-md-6", "col-12"]),
    new HeaderContent(content=<Link style={{textDecoration:"none"}} to="/MyShell"><Btn>Моя полка</Btn></Link>, divClasses=["col-lg-2", "col-md-6", "col-12"])
]

const MainPageAuthors = () => {
    return(
    <>
        <HeaderTemplate ContainerElements={Elements} />
    </>)
}

export default MainPageAuthors