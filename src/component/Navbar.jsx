import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from 'react-router-dom';
import MagicBar from './Magicbar';

export default function Navbar({user}) {

    const handleLogout = ()=> {
        signOut(auth).then(() => {
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          });
    }

    return (
        <>
            <MagicBar user= {user} />
            <div className="nav___flexbox">
                <Link to='/'>
                <img className="nav___logo" 
                src="https://firebasestorage.googleapis.com/v0/b/notsocial-62e33.appspot.com/o/assets%2Fnotsocial.png?alt=media&token=483a75a8-b39e-41b2-8f20-be709d5986b0"/>
                </Link>


                <div className="post___flexbox">
                {user ? 
                <> 
                    <Avatar 
                    className='nav___avatar'
                    alt={user.displayName} 
                    src={user.photoURL} />
                    <Button onClick={handleLogout} variant="outlined">LogOut</Button>
                </>   
                : <Button onClick={()=> alert('Nothing Found!')} variant="text">Trending</Button>
                }
                </div>
            </div>
        </>
    )
}