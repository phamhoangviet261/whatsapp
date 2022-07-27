import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { auth } from '../config/firebase'
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
	margin: 10px;
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
    margin-bottom: -16px;
    margin-left: 6px;
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

const StyledSenderMessage = styled(StyledMessage)`
	/* margin-left: auto; */
    /* margin-right: 30px; */
	background-color: rgb(0, 132, 255);
    color: #ffffff;
    &:hover ${StyledTimestamp}{
        display: block;
    }
`

const StyledReceiverMessage = styled(StyledMessage)`
	background-color: #E4E6EB;
    &:hover ${StyledTimestamp}{
        display: block;
    }
`

const StyledMessageActions = styled.div<{type: boolean, isOpen: boolean}>`
    display: ${(props) => props.isOpen == true ? 'flex' : 'none'};
    flex-direction: ${(props) => props.type == false ? 'row' : 'row-reverse'};
    align-items: flex-start;
    margin-top: 5px;
`;

const StyledContainer = styled.div<{type: boolean}>`
    display: flex;
    flex-direction: ${(props) => props.type == false ? 'row' : 'row-reverse'};
    align-items: flex-end;
    &:hover{
        ${StyledMessageActions}{
            display: flex;
        }
    }
`;

const StyledBox = styled(Box)`
    position: absolute;
    top: -40px;
    right: -300%;
    // left: 0,
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
    margin: 10px 15px 5px 5px;
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
    }
    
	return (
       
        <StyledContainer type={loggedInUser?.email == message.user}>
            {photo && !(loggedInUser?.email === message.user) ? <SyledAvatar src={photo}/> : <></>}
            <StyledMessageContainer type={loggedInUser?.email == message.user}>
                <StyledMessageRepliedContainer>
                    {message.user == loggedInUser?.email && message.user == message.user_reply ? <StyledMessageRepliedTo>{`You replied to yourself`}</StyledMessageRepliedTo> : ''}
                    {message.user == loggedInUser?.email && message.user != message.user_reply ? <StyledMessageRepliedTo>{`You replied to ${targetname}`}</StyledMessageRepliedTo> : ''}
                    {message.user != loggedInUser?.email && message.user == message.user_reply ? <StyledMessageRepliedTo>{`${targetname} replied to ${targetname}`}</StyledMessageRepliedTo> : ''}
                    {message.user != loggedInUser?.email && message.user != message.user_reply ? <StyledMessageRepliedTo>{`${targetname} replied to you`}</StyledMessageRepliedTo> : ''}

                    {message.message_reply_text.length > 0 ? <StyledMessageReplied type={loggedInUser?.email == message.user}>{message.message_reply_text}</StyledMessageReplied> : ''}
                </StyledMessageRepliedContainer>
                <Tooltip title={message.sent_at} placement={loggedInUser?.email == message.user ? 'right' : 'left'} arrow TransitionComponent={Zoom}>
                    <MessageType>
                        {message.text}
                        {/* <StyledTimestamp>{message.sent_at}</StyledTimestamp> */}
                    </MessageType>
                </Tooltip>
            </StyledMessageContainer>
            <StyledMessageActions type={loggedInUser?.email == message.user} isOpen={open}>   
                <ClickAwayListener onClickAway={handleClickAway}>
                    <Box sx={{ position: 'relative' }}>       
                        <Tooltip title="React" placement="top" arrow TransitionComponent={Zoom}>
                            <IconButton onClick={handleClick}>
                                <InsertEmoticonIcon />
                            </IconButton>
                        </Tooltip>
                        {open ? (
                            <StyledBox>
                                <Image src={`/like.png`} alt="IMAGE_COOL" width={32} height={32}/>
                                <Image src={`/love.png`} alt="IMAGE_COOL" width={32} height={32}/>
                                <Image src={`/care.png`} alt="IMAGE_COOL" width={32} height={32}/>
                                <Image src={`/haha.png`} alt="IMAGE_COOL" width={32} height={32}/>
                                <Image src={`/sad.png`} alt="IMAGE_COOL" width={32} height={32}/>
                                <Image src={`/angry.png`} alt="IMAGE_COOL" width={32} height={32}/>
                            </StyledBox>
                        ) : null}
                    </Box>
                </ClickAwayListener>
                <Tooltip title="Reply" placement="top" arrow TransitionComponent={Zoom}>
                    <IconButton>
                        <ReplyIcon onClick={() => handleReply()}></ReplyIcon>
                    </IconButton>
                </Tooltip>
                <Tooltip title="More" placement="top" arrow TransitionComponent={Zoom}>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </Tooltip>
            </StyledMessageActions>
        </StyledContainer>
        
	)
}

export default Message