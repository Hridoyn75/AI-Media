import { Link, useNavigate } from "react-router-dom";
import { AiTwotoneHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FaUserFriends } from "react-icons/fa";
import { TbMessage2Code } from "react-icons/tb";
import NewPostModal from "./NewPostModal";

export default function MagicBar({user}) {
    const navigate = useNavigate();

    const gohome = ()=>{
        navigate('/');
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
    }
    return (
        <>
            <div className="magicbar___flexbox">
                <div onClick={gohome} className="magicbar___item"><AiTwotoneHome /></div>
                <div className="magicbar___item"><Link to="/mate"><FaUserFriends /></Link></div>
                <NewPostModal user= {user} />
                <div className="magicbar___item"><Link to="/chat"><TbMessage2Code /></Link></div>
                <div className="magicbar___item"><Link to={"/user/" + user.uid }><CgProfile /></Link></div>
            </div>
        </>
    )
}