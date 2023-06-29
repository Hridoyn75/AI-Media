import Post from '../component/Post'
import ProfileCard from '../component/ProfileCard'
import { auth, provider } from "../firebase"
import { signInWithPopup } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { db } from "../firebase"
import SkeletonPost from '../component/SkeletonPost'

export default function HomePage ({user, posts}){


    const AddUserOnFirestore = async (userData) => {
        await setDoc(doc(db, "users", userData.uid), {
            name: userData.displayName,
            email: userData.email,
            bio: "A notSocial Person",
            photo: userData.photoURL,
            socialmate: [{
                mateName: userData.displayName,
                mateID: userData.uid,
                matePhoto: userData.photoURL
            }]
          });
    }

    const handleSignUp = () =>{
        signInWithPopup(auth, provider)
        .then((result) => {
            AddUserOnFirestore(result.user);
        }).catch((error) => {
          alert(error.message);
        });
      }
    return (
        <div className='app___flexbox'>
            <div className='app__feed'>

            {posts[0] ? posts.map((post) =>{
            return <Post 
                key = {post.id}
                name = {post.name}
                caption = {post.caption}
                photo = {post.photo}
                userPhoto = {post.userPhoto}
                postID = {post.id}
                creatorID = {post.uid}
                currentUserID = {user.uid}
                currentUserPhoto = {user.photoURL}
                currentUserName = {user.displayName}
                photoname = {post.photoname}
                upvote = {post.upvote}
                downvote = {post.downvote}

            />
            }) : 
            <>
                <SkeletonPost  />
                <SkeletonPost  />
                <SkeletonPost  />
            </>

            }
            </div>
            <div className='app_sidebar'>
            {user ?
            <ProfileCard 
            user= {user}
            />
            : 
            <div className="login___box">
                    <h2>Join notSocial</h2>
                    <button onClick={handleSignUp}>Join with Google</button>
            </div>
            }
            

            {/* Profile card */}

            {/* trending hashtags */}
            {/* important notices */}
            </div>
        </div>
    )
}