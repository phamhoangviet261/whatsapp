import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { IMessage } from '../types'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import ReplyIcon from '@mui/icons-material/Reply';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import {useState} from 'react'
import Tooltip from '@mui/material/Tooltip';
import Image from 'next/image'
import Zoom from '@mui/material/Zoom';
import { Avatar } from "@mui/material"
import { ReplyContext } from './ConversationScreen'
import { useContext } from 'react'
import {
	addDoc,
	collection,
	doc,
	serverTimestamp,
	setDoc
} from 'firebase/firestore'
import { auth, db } from '../config/firebase'

const StyledTimestamp = styled.span`
	color: gray;
	padding: 10px;
	font-size: x-small;
	position: absolute;
	bottom: 0;
	right: 0;
	text-align: right;
    display: none;
`

const StyledMessage = styled.p`
	width: fit-content;
	word-break: break-all;
	/* max-width: 60%; */
	min-width: 20%;
	padding: 8px 15px 10px 15px;
	border-radius: 30px;
	margin: 20px 10px;
	position: relative;
`

const StyledMessageContainer = styled.div<{type: boolean}>`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: ${(props) => props.type == false ? 'flex-start' : 'flex-end'};
`;
const StyledMessageRepliedContainer = styled.div`
    /* position: absolute; */
    display: flex;
    flex-direction: column;
    bottom: 20px;
    font-size: 12px;
    margin-bottom: -28px;
    margin-left: 22px;
    margin-right: 25px;
`;

const StyledMessageRepliedTo = styled.span`
    color: #65766B;
    padding: 10px 6px;
`;

const StyledMessageReplied = styled.span<{type: boolean}>`
    width: fit-content;
    margin-left: ${(props) => props.type == false ? 'unset' : 'auto'};
    color: #65766B;
    padding: 10px 20px;
    background-color: #F6F9FA;
    border-radius: 20px;
`;

const StyledSenderMessage = styled(StyledMessage)<{type: boolean}>`
	/* margin-left: auto; */
    /* margin-right: 30px; */
    color: #ffffff;
    display: flex;
    flex-direction: ${(props) => props.type == false ? 'row' : 'row-reverse'};
    align-items: center;
    & > p{
	    background-color: rgb(0, 132, 255);
        padding: 10px 15px;
	    border-radius: 30px;
    }
`

const StyledReceiverMessage = styled(StyledMessage)<{type: boolean}>`
    display: flex;
    align-items: center;
    & > p{
	    background-color: #E4E6EB;
	    border-radius: 30px;
        padding: 10px 15px;
    }    
`

const StyledMessageActions = styled.div<{type: boolean, isOpen: boolean}>`
    display: ${(props) => props.isOpen == true ? 'flex' : 'flex'};
    flex-direction: ${(props) => props.type == false ? 'row' : 'row'};
    align-items: flex-start;
    margin-top: 5px;
    margin-right: ${(props) => props.type == true ? '10px' : 'unset'};
    margin-left: ${(props) => props.type == true ? 'unset' : '10px'};
    visibility: hidden;
`;

const StyledContainer = styled.div<{type: boolean}>`
    display: flex;
    flex-direction: ${(props) => props.type == false ? 'row' : 'row-reverse'};
    align-items: flex-end;
    &:hover{
        ${StyledMessageActions}{
            display: flex;
            visibility: unset;
        }
    }
`;

const StyledBox = styled(Box)<{type: boolean}>`
    position: absolute;
    top: -40px;
    right: -237%;
    left:  ${(props) => props.type == true ? 'unset' : '-120px'};
    display: flex;
    z-index: 999;
    width: max-content;
    gap: 10px;
    // height: '40px',
    padding: 6px 16px;
    border-radius: 20px;
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    & > span:hover{
        cursor: pointer;
        transform: scale(1.2);
    }
`;

const SyledAvatar = styled(Avatar)`
    margin: 10px 15px 35px 5px;
`;

const StyledReaction = styled(Box)`
    position: absolute;
    bottom: -10px;
    /* right: -237%; */
    /* left: 20px; */
    display: flex;
    z-index: 999;
    width: max-content;
    gap: 4px;
    padding: 4px 4px;
    border-radius: 20px;
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    cursor: pointer;
    & img{
        width: 16px !important;
        height: 16px !important;
    }
`;

const Message = ({ message, photo, targetname }: { message: IMessage, photo: string, targetname: string | undefined }) => {
	const [loggedInUser, _loading, _error] = useAuthState(auth)

	const MessageType =
		loggedInUser?.email === message.user
			? StyledSenderMessage
			: StyledReceiverMessage
    
    // handle reaction 
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen((prev) => !prev);
    };

    const handleClickAway = () => {
        setOpen(false);
    };

    const {setReply} = useContext(ReplyContext);
    const handleReply = () => {
        let obj = {
            conversation_id: '',
            message_reply_id: '',
            message_reply_text: '',
            user_reply: ''
        };
        console.log({message})
        obj.conversation_id = message.conversation_id;
        obj.message_reply_id = message.id;
        obj.message_reply_text = message.text;
        obj.user_reply = message.user;
        setReply(obj);
        document.getElementById('input-chat')!.focus();
    }

    const renderReaction = (type: string) => {
        switch (type) {
            case 'like':                
                return <Image src={`/like.png`} alt="IMAGE_COOL" width={32} height={32}/>;
            case 'love':                
                return <Image src={`/love.png`} alt="IMAGE_COOL" width={32} height={32}/>;
            case 'care':                
                return <Image src={`/care.png`} alt="IMAGE_COOL" width={32} height={32}/>;
            case 'haha':                
                return <Image src={`/haha.png`} alt="IMAGE_COOL" width={32} height={32}/>;
            case 'sad':                
                return <Image src={`/sad.png`} alt="IMAGE_COOL" width={32} height={32}/>;
            case 'angry':                
                return <Image src={`/angry.png`} alt="IMAGE_COOL" width={32} height={32}/>;
            case 'ilu_sign':
                return <Image src={`/ilu_sign.jpg`} alt="IMAGE_COOL" width={32} height={32}/>                                            
            default:
                return <></>;
        }
    }

    const addReaction = async (id: string, oldReactions: any, newReaction: string) => {
        oldReactions.push(newReaction);
        const fakeReactions = JSON.parse(JSON.stringify(oldReactions));
        // let r = [...new Set(fakeReactions)];
        await setDoc(
			doc(db, 'messages', id),
			{
				reactions: fakeReactions
			},
			{ merge: true }
		)
    }

	return (
       
        <StyledContainer type={loggedInUser?.email == message.user}>
            {photo && !(loggedInUser?.email === message.user) ? <SyledAvatar src={photo}/> : <></>}
            <StyledMessageContainer type={loggedInUser?.email == message.user}>
                <StyledMessageRepliedContainer>
                    {message.user == loggedInUser?.email && message.user == message.user_reply && message.user_reply != '' ? <StyledMessageRepliedTo>{`You replied to yourself`}</StyledMessageRepliedTo> : ''}
                    {message.user == loggedInUser?.email && message.user != message.user_reply && message.user_reply != '' ? <StyledMessageRepliedTo>{`You replied to ${targetname}`}</StyledMessageRepliedTo> : ''}
                    {message.user != loggedInUser?.email && message.user == message.user_reply && message.user_reply != '' ? <StyledMessageRepliedTo>{`${targetname} replied to ${targetname}`}</StyledMessageRepliedTo> : ''}
                    {message.user != loggedInUser?.email && message.user != message.user_reply && message.user_reply != '' ? <StyledMessageRepliedTo>{`${targetname} replied to you`}</StyledMessageRepliedTo> : ''}

                    {message.message_reply_text.length > 0 ? <StyledMessageReplied type={loggedInUser?.email == message.user}>{message.message_reply_text}</StyledMessageReplied> : <></>}
                </StyledMessageRepliedContainer>
                <Tooltip title={message.sent_at} placement={loggedInUser?.email == message.user ? 'right' : 'left'} arrow TransitionComponent={Zoom}>
                    <MessageType type={loggedInUser?.email == message.user}>
                        <p>{message.text}</p>
                        <StyledReaction>
                            {message?.reactions.length > 0 && message?.reactions.filter((value, index, self) => self.indexOf(value) === index).map(r => renderReaction(r))}
                        </StyledReaction>
                        {/* <StyledTimestamp>{message.sent_at}</StyledTimestamp> */}
                        <StyledMessageActions type={loggedInUser?.email == message.user} isOpen={open}>   
                            <ClickAwayListener onClickAway={handleClickAway}>
                                <Box sx={{ position: 'relative' }}>       
                                    <Tooltip title="React" placement="top" arrow TransitionComponent={Zoom}>
                                        <IconButton onClick={handleClick}>
                                            <InsertEmoticonIcon />
                                        </IconButton>
                                    </Tooltip>
                                    {open ? (
                                        <StyledBox type={loggedInUser?.email == message.user}>
                                            <Image src={`/like.png`} alt="IMAGE_COOL" width={32} height={32} onClick={()=> addReaction(message?.id, message?.reactions, 'like')}/>
                                            <Image src={`/love.png`} alt="IMAGE_COOL" width={32} height={32} onClick={()=> addReaction(message?.id, message?.reactions, 'love')}/>
                                            <Image src={`/care.png`} alt="IMAGE_COOL" width={32} height={32} onClick={()=> addReaction(message?.id, message?.reactions, 'care')}/>
                                            <Image src={`/haha.png`} alt="IMAGE_COOL" width={32} height={32} onClick={()=> addReaction(message?.id, message?.reactions, 'haha')}/>
                                            <Image src={`/sad.png`} alt="IMAGE_COOL" width={32} height={32} onClick={()=> addReaction(message?.id, message?.reactions, 'sad')}/>
                                            <Image src={`/angry.png`} alt="IMAGE_COOL" width={32} height={32} onClick={()=> addReaction(message?.id, message?.reactions, 'angry')}/>
                                            <Image src={`/ilu_sign.jpg`} alt="IMAGE_COOL" width={32} height={32} onClick={()=> addReaction(message?.id, message?.reactions, 'ilu_sign')}/>                                            
                                        </StyledBox>
                                    ) : null}
                                </Box>
                            </ClickAwayListener>
                            <Tooltip title="Reply" placement="top" arrow TransitionComponent={Zoom}>
                                <IconButton onClick={() => handleReply()}>
                                    <ReplyIcon></ReplyIcon>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="More" placement="top" arrow TransitionComponent={Zoom}>
                                <IconButton>
                                    <MoreVertIcon />
                                </IconButton>
                            </Tooltip>
                        </StyledMessageActions>
                    </MessageType>
                </Tooltip>
            </StyledMessageContainer>
            
        </StyledContainer>
        
	)
}

export default Message