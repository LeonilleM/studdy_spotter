import React from 'react'
import { useContext } from 'react';
import { AuthContext } from '../../services/Auth/AuthContext.jsx';

function Account() {
    const { user, isAuthenticated } = useContext(AuthContext);

    return (
        <div className="h-screen bg-primary pt-20 text-secondary">
            <h1>
                {isAuthenticated ? (
                    <div>
                        <img src={user.image_url} alt="avatar" className="w-12 h-12 rounded-full" />
                        <span className=" font-bold">{user.first_name} {user.last_name}</span>
                    </div>
                ) : (
                    <h1>Not authenticated</h1>
                )}
            </h1>
        </div>
    )
}

export default Account