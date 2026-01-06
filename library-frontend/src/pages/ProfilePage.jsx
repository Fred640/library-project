import React from "react";
import { useAuth } from "../components/context/AuthContext";
import Btn from "../components/UI/button/Btn";
import { useNavigate } from "react-router-dom";
const ProfilePage = () => {
    const navigate = useNavigate()
    const {logout} = useAuth()

    const logoutClick = (event) => {
        event.preventDefault()
        logout(); navigate(-1)
    }

    return(
        <Btn onClick={logoutClick}>Выйти</Btn>
    )
}

export default ProfilePage