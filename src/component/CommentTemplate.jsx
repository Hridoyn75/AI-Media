import Avatar from '@mui/material/Avatar';

export default function CommentTemplate (props){
    return (
      <div className='commentmodal___comment'>
          <div>
              <Avatar 
              alt={props.name}
              src={props.photo} />
              <p>{props.name}</p>
          </div>
          <p className='commentmodal___text'>{props.text}</p>
      </div> 
    )
  }