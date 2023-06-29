import Avatar from '@mui/material/Avatar';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CommentModal from './CommentModal';
import DynamicCaption from './DynamicCaption';


export default function Post({name, caption, photo,
     userPhoto, postID, currentUserID , currentUserPhoto,currentUserName,
      creatorID, photoname, upvote, downvote}){

    const [ upvoted, setUpvoted ] = useState(false);
    const [ downvoted, setDownvoted ] = useState(false);
    const [ showdelete, setShowdelete ] = useState(false);



    const handleUppost = async () => {
        if(downvoted){handleDownpost()}
        const uppostRef = doc(db, "posts", postID);
        if (!upvote.includes(currentUserID)){
        await updateDoc(uppostRef, {
            upvote : [...upvote, currentUserID ]
        });
        } else {
            let filteredArr = upvote.filter(function(element) {
                return element !== currentUserID;
              });
            await updateDoc(uppostRef, {
                upvote : filteredArr
            });
        }
    }
    const handleDownpost = async () => {
        if(upvoted){handleUppost()}
        const uppostRef = doc(db, "posts", postID);
        if (!downvote.includes(currentUserID)){
        await updateDoc(uppostRef, {
            downvote : [...downvote, currentUserID ]
        });
        } else {
            let filteredArr = downvote.filter(function(element) {
                return element !== currentUserID;
              });
            await updateDoc(uppostRef, {
                downvote : filteredArr
            });
        }
    }


    useEffect(() =>{
        if (upvote.includes(currentUserID)){
            setUpvoted(true);  
        } else {
            setUpvoted(false); 
        }

        if (downvote.includes(currentUserID)){
            setDownvoted(true);  
        } else {
            setDownvoted(false); 
        }
    },[upvote, downvote])


    useEffect(() =>{
        if (creatorID === currentUserID){
            setShowdelete(true);
        }
    },[])


    const handleDelete = async () => {
        
        if (creatorID === currentUserID) {
            const confirmDelete = confirm("Are you sure you want to delete this post?");
            if (confirmDelete && photoname) {
                const desertRef = ref(storage, `images/${photoname}`);
                // Delete the file
                deleteObject(desertRef).then(() => {
                  // File deleted successfully
                }).catch((error) => {
                  // Uh-oh, an error occurred!
                });
                await deleteDoc(doc(db, "posts", postID));
            } if (confirmDelete && !photoname){
                await deleteDoc(doc(db, "posts", postID));
            }
        }else{
            alert("You are not allowed to delete this post")
            location.reload()
        }
         
    }
    const [uppostInK, setUppostInK] = useState('');
    const [downpostInK, setDownpostInK] = useState('');

    useEffect(() => {
        if (upvote.length > 999) {
            let ValueInK = Math.floor(upvote.length / 1000);
            let thirdLastDigit = Math.floor(upvote.length / 100) % 10;
            if (thirdLastDigit === 0) {
                setUppostInK(ValueInK + "K" )
            }else{
                setUppostInK(ValueInK + "." + thirdLastDigit + "K" );
            }
        };
        if (downvote.length > 999) {
            let ValueInK = Math.floor(downvote.length / 1000);
            let thirdLastDigit = Math.floor(downvote.length / 100) % 10;
            if (thirdLastDigit === 0) {
                setDownpostInK(ValueInK + "K" )
            }else{
                setDownpostInK(ValueInK + "." + thirdLastDigit + "K" );
            }
        }
    },[downvote,downvote])












    return(
        <>
            <div className="post___box">
                <div className="post___flexbox">
                    <Avatar 
                    alt={name} 
                    src={userPhoto} />
                    <Link to={name === "Anonymous" ? "/" : `/user/${creatorID}`}><strong>{name}</strong></Link>
                    { showdelete &&
                    <DeleteForeverIcon 
                    className='post___delete' 
                    onClick={handleDelete} 
                    />
                    }
                </div>
                <DynamicCaption caption={caption} phto={photo} />
                <img className='post___img' src={photo} />
                <div className='post___publicbar'>
                    <div className='post___updown'>
                        <button onClick={handleUppost} className={`post___btngroup ${upvoted && "post___btncondition"}`}>
                            <KeyboardDoubleArrowUpIcon />
                            <p>{uppostInK ? uppostInK : upvote.length}</p>
                        </button>
                        <button onClick={handleDownpost} href='#' className={`post___btngroup ${downvoted && "post___btncondition"}`}>
                            <KeyboardDoubleArrowDownIcon />
                            <p>{downpostInK ? downpostInK : downvote.length}</p>
                        </button>
                    </div>
                    <CommentModal 
                    postID = {postID}
                    currentUserID = {currentUserID}
                    currentUserPhoto = {currentUserPhoto}
                    currentUserName = {currentUserName} />
                </div>
            </div>
        </>
    )
}