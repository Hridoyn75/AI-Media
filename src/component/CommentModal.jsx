import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import AddCommentIcon from '@mui/icons-material/AddComment';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { db } from "../firebase";
import CommentTemplate from './CommentTemplate';
import { collection, onSnapshot, orderBy,
         query, doc, serverTimestamp,
         setDoc, getCountFromServer } from "firebase/firestore";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  maxWidth: 700,
  maxHeight: 700,
  bgcolor: '#190f2d',
  borderTop: "2px white solid",
  borderLeft: "2px white solid",
  borderRight: "2px black solid",
  borderBottom: "2px black solid",
  boxShadow: "3px 3px 5px rgb(4, 172, 214)",
  p: 4,
};

export default function CommentModal({postID, currentUserID, currentUserName, currentUserPhoto}) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [totalcomments, setTotalComments] = useState(0);


  const handleCommentOpen = () => setOpen(true);
  const handleCommentClose = () => setOpen(false);




  useEffect(() => {
    const MainCollection = doc( db, 'posts', postID );
    const colRef = collection(MainCollection, "comments");

    const q = query(colRef, orderBy('timestamp', "desc"));
    //real time update
    onSnapshot(q, (snapshot) => {
      const commentarray = [];
        snapshot.docs.forEach((doc) => {
            commentarray.push({...doc.data(), id : doc.id});
        })
        setComments(commentarray);
    })
  },[])




    const handleNewComment = async (e) => {
        e.preventDefault();
        const MainCollection = doc( db, 'posts', postID );
        const colRef = collection(MainCollection, "comments");

            const newCommentRef = doc(colRef);
            await setDoc(newCommentRef, {
                name: currentUserName,
                text : text,
                uid: currentUserID,
                photo: currentUserPhoto,
                timestamp: serverTimestamp(),
            });
    }


    useEffect(()=>{
      const fetchCommentCount = async()=>{
        const MainCollection = doc( db, 'posts', postID );
        const colRef = collection(MainCollection, "comments");
        const snapshot = await getCountFromServer(colRef);
        setTotalComments(snapshot.data().count);
      }
      fetchCommentCount()
    },[comments])





  return (
    <div>
      <Button onClick={handleCommentOpen} style={{color: "green"}}><pre>{totalcomments}+ Comments </pre> <AddCommentIcon /></Button>
      <Modal
        open={open}
        onClose={handleCommentClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box style={{"maxWidth": "90%"}} sx={style}>
            <h1>Comment Box</h1>
            <CloseIcon className='commentmodal___close' onClick={handleCommentClose} />
            <div className='commentmodal___list'>
            { comments.map((comment) =>{
            return <CommentTemplate 
                      key={comment.id} 
                      name={comment.name}
                      photo={comment.photo}
                      text={comment.text}
                       />
            })}
            </div>

            <form onSubmit={handleNewComment} className='commentmodal___new'>
                <textarea 
                placeholder='Feel free about your opinions'
                onChange={e => setText(e.target.value) }></textarea>
                <Button
                type="submit"
                variant="contained" 
                color="success" 
                endIcon={<SendIcon/>}>
                    Comment
                </Button>
            </form>
        </Box>
      </Modal>
    </div>
  );
}
