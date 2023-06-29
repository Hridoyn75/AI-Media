import { useState, useRef  } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import {  AiOutlinePlusCircle } from "react-icons/ai";


import SendIcon from '@mui/icons-material/Send';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { doc, setDoc, collection, serverTimestamp  } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Switch from '@mui/material/Switch';
import Compressor from 'compressorjs';


const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  maxWidth: 700,
  maxHeight: 700,
};

function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }
  
  LinearProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
  };

export default function NewPostModal({user}) {
  const [open, setOpen] = useState(false);


  const handleCommentOpen = () => setOpen(true);
  const handleCommentClose = () => setOpen(false);



  const [caption, setCaption] = useState('');
  const [image , setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showprogress, setShowprogress] = useState(false);
  const [nocaption, setNocaption] = useState(false);
  const [uploaddone, setUploaddone] = useState(false);
  const [uploadfailed, seUploadfailed] = useState(false);
  const inputRef = useRef(null);
  const [checked, setChecked] = useState(false);


  const switchHandler = (event) => {
    setChecked(event.target.checked);
  };

  const handlePhotoupload = (e) => {
    const file = e.target.files[0];

    new Compressor(file, {      
      quality: 0.3,
      success: (compressedResult) => {
        setImage(compressedResult)
      },
    });
}

const handleNewpost = async () =>{

    const NotAllowedWords = [ "fake", "kill"];
    let kdp = false;
    NotAllowedWords.forEach((word) => {
      if (caption.toLowerCase().includes(word.toLowerCase())) {
        alert("This Caption is not allowed");
        kdp = true;
        setCaption('');
        return;
      };
    });
    if(kdp) return;

      if ((caption !== '') && (image !== null)) {
          function generateRandomCode() {
            let RandomCode = "";
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < 10; i++) {
              RandomCode += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return RandomCode;
          }

          const storageRef = ref(storage, `images/${image.name + generateRandomCode()}`);

          const uploadTask = uploadBytesResumable(storageRef, image);
          setShowprogress(true);
  
          uploadTask.on('state_changed', 
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress_value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
           setProgress(progress_value);
          }, 
          (error) => {
            seUploadfailed("upload Failed because of " + error.message);
          }, 
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              const FinalCallForNewPost = async () => {
                  const newPostRef = doc(collection(db, "posts"));
                  await setDoc(newPostRef, {
                      name: !checked ? user.displayName : "Anonymous",
                      caption : caption,
                      uid: user.uid,
                      timestamp: serverTimestamp(),
                      userPhoto: !checked ? user.photoURL : "https://m.media-amazon.com/images/I/71zTE0u2iXL._UL1500_.jpg",
                      photo: downloadURL,
                      photoname: image.name + generateRandomCode(),
                      upvote: [],
                      downvote: []
                  });
                  setCaption('');
                  inputRef.current.value = '';
                  setImage(null);
                }
                setShowprogress(false);
                setUploaddone(true);
                  setTimeout(() => {
                      setUploaddone(false)
                      handleCommentClose()
                  },500)
                FinalCallForNewPost();
            });
          }
        );

      } if ((caption !== '') && (image == null)) {
        const FinalCallForNewPost = async () => {
          const newPostRef = doc(collection(db, "posts"));
          await setDoc(newPostRef, {
              name: !checked ? user.displayName : "Anonymous",
              caption : caption,
              uid: user.uid,
              uppost: 0,
              downpost: 0,
              timestamp: serverTimestamp(),
              userPhoto: !checked ? user.photoURL : "https://m.media-amazon.com/images/I/71zTE0u2iXL._UL1500_.jpg",
              upvote: [],
              downvote: []
          });
          setCaption('');
          inputRef.current.value = '';
        }
        setUploaddone(true);
        setTimeout(() => {
            setUploaddone(false)
            handleCommentClose()
        },500)
       FinalCallForNewPost();
      } if (caption == '') {
          setNocaption(true);
          setTimeout(() =>{
              setNocaption(false);
          },3000)
      }
  }






  return (
    <div>
      <div style={{"flex": "1"}} onClick={handleCommentOpen} className="magicbar___item magicbar___center"><Link to="/"><AiOutlinePlusCircle /></Link></div>
      <Modal
        open={open}
        onClose={handleCommentClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box style={{"maxWidth": "90%"}} sx={style}>
            <div style={{"minWidth": "95%"}} className='profilecard___box global___card'>
                <div className='profilecard___newpost'>
                <h3>Create New Post</h3>

                <div className='profilecard___anonymous'>
                  <h4>Anonymous Mode</h4>
                  <Switch color="primary" checked={checked} onChange={switchHandler} />
                </div>

                
                <textarea 
                type="text" 
                value= {caption} 
                onChange={(e) => setCaption(e.target.value) } 
                className="profilecard___input" 
                placeholder="Give a Caption!"
                />

                <input 
                type="file"
                ref={inputRef}
                accept="image/*"
                className="profilecard___input" 
                placeholder="Give a Caption!" 
                onChange={handlePhotoupload}
                />

                {nocaption && 
                <h4 className='profilecard___error'>Please Give a Caption</h4>
                }

                {uploaddone && 
                <h4 className='profilecard___success'>Post uploaded Successfully</h4>
                }

                {uploadfailed && 
                <h4 className='profilecard___error'>{uploadfailed}</h4>
                }

                {showprogress &&
                <Box sx={{ width: '100%', background: "white", padding: "5px", borderRadius:"5px", color: "black" }}>
                    <p>Please Wait...</p>
                    <LinearProgressWithLabel value={progress} />
                </Box>
                }

                <Button 
                onClick={handleNewpost} 
                variant="contained" 
                color="success" 
                endIcon={<SendIcon
                />}>
                    Post
                </Button>
                </div>
            </div>
        </Box>
      </Modal>
    </div>
  );
}
