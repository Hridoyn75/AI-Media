import React from 'react';
import Avatar from '@mui/material/Avatar';







export default function ProfileCard({user}) {
    return (
        <div className='profilecard___wrapper'>
            <div className="profilecard___box global___card hide___in___phone">
                <div className="profilecard___flexbox">
                    <Avatar
                        alt="Remy Sharp"
                        src={user.photoURL}
                        sx={{ width: 100, height: 100 }}
                    />
                    <div>
                        <h2>{user.displayName}</h2>
                        <br/>
                        <p><small>{user.email}</small> ,</p>
                        <p>Nawabganj Govt. College</p>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}