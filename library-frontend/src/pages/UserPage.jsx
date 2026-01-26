import React from "react";
import '../styles/pages/AuthorPage.css'
import { useParams } from 'react-router-dom';
import { useUser } from "../hooks/useUser";
const UserPage = () => {
    const params = useParams()
    const {user, diaries, loading, error} = useUser(params.username)
    return(
        <>
        
        </>
    )
}

export default UserPage