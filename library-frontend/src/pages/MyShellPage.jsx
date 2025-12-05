import React from "react";
import MyShellHeader from "../components/header/MyShellHeader";


const MyShellPage = () => {
    const asd = () => {
        return "asd"
    }
    return(
        <MyShellHeader searchFunc={asd}/>
    )
}

export default MyShellPage