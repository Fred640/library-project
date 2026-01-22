import React from "react";
import User from "./User";

const UsersList = ({users}) => {
    return(
        <>
            {users.map((user, index) => (
                <User key={index} user={user} />
            ))}
        </>
    )
}

export default UsersList;