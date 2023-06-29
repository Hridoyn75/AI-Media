import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './component/Navbar'
import { auth, provider, db } from "./firebase";
import { signInWithPopup, onAuthStateChanged  } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import UserProfilePage from './pages/UserProfilePage';
import HomePage from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import Chat from './pages/Chat';
import Mate from './pages/Mate';


function App() {
   const [user, setUser] = useState('');
   const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    const colRef = collection(db, "posts")

    const q = query(colRef, orderBy('timestamp', "desc"));
    //real time update
    onSnapshot(q, (snapshot) => {
      const postarray = [];
        snapshot.docs.forEach((doc) => {
            postarray.push({...doc.data(), id : doc.id});
        })
        setPosts(postarray);
    })
}, [])





  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser("");
    }
  });



 
  return (
    <div className="App">
      {/* Nav bar */}
      <Navbar 
        user= {user}
       />


      {/* <UserProfilePage user= {user} /> */}

      <Routes>
        <Route exact path="/" element={<HomePage user= {user} posts= {posts} />} />
        <Route exact path="/chat" element={<Chat />} />
        <Route exact path="/mate" element={<Mate />} />
        <Route exact path="/user/:id" element={<UserProfilePage currentUser= {user} />} />
      </Routes>

      


    </div>
  )
}

export default App
