import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileBtn = ({ user }) => {
    // Ensure user is defined before accessing properties
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Avatar>
                {user.avatar ? (
                    <AvatarImage src={user.avatar} />
                ) : (
                    <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                )}
            </Avatar>
            <h2>{user.username}</h2>
        </div>
    );
};

export default ProfileBtn;
