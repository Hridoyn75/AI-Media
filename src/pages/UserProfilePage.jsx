import Avatar from '@mui/material/Avatar'
import { useParams } from 'react-router-dom'
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from 'react'
import { db } from "../firebase"



export default function UserProfilePage(CurrentUser){

    let { id } = useParams();

    const [ user , setUser ] = useState('');
    const [ AlreadyMate, setAlreadyMate ] = useState(false);


    useEffect(() => {
        const GetUserProfile = async () => {
            const docRef = doc(db, "users", id);
            const docSnap = await getDoc(docRef);
        
            if (docSnap.exists()) {
            setUser(docSnap.data());
            } else {
            console.log("No such user!");
            }
        }
        GetUserProfile();

    },[])
    
    
    useEffect(()=>{
        if(user){
            user.socialmate.forEach((mate)=>{
                if(mate.mateID === CurrentUser.currentUser.uid){
                    setAlreadyMate(true);
                }
            })
        }
    },[user])
    const handleSocialmate = async () => {

        await updateDoc(doc(db, "users", id), {
        socialmate: [...user.socialmate, {
            mateName: CurrentUser.currentUser.displayName,
            mateID: CurrentUser.currentUser.uid,
            matePhoto: CurrentUser.currentUser.photoURL
        }]
        });  
    }
    return (
        <>
            <div className="userprofile___card global___card">
                <div className='userprofile___columnflex userprofile___box1'>
                    <Avatar
                        alt={user.name}
                        src= {user.photo}
                        sx={{ width: 75, height: 75 }}
                    />
                    <h3>{Array.isArray(user.socialmate) && user.socialmate.length }</h3> 
                    <p>SocialMates</p>
                </div>
    
                <div className='userprofile___columnflex userprofile___box2'>
                   <h3>{user.name}</h3>
                   <p>{user.email}</p> 
                   <h4 className='userprofile___bio'>{user.bio}</h4>
                   { !AlreadyMate ?
                   <button onClick={handleSocialmate} className='userprofile___socialmatebtn'>Be SocialMate</button>
                   :
                   <button onClick={handleSocialmate} className='userprofile___socialmatebtn userprofile___unsocialmatebtn'>UnSocialMate</button>
                   }
                </div>    
            </div>

            <div className='userprofile___bottom'>
                <div className='global___card userprofile___box1'></div>
                <div className='global___card userprofile___box2'></div>
            </div>

            {/* flex box */}
                {/* photo, name and user public details */}
            {/* flex box */}
                {/* Info bar and user posts */}
        </>
    )
}