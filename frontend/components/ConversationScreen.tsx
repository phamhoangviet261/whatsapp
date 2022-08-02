import IconButton from '@mui/material/IconButton'
import styled from 'styled-components'
import { useRecipient } from '../hooks/useRecipient'
import { Conversation, IMessage } from '../types'
import {
	convertFirestoreTimestampToString,
	generateQueryGetMessages,
	transformMessage
} from '../utils/getMessagesInConversation'
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Box from '@mui/material/Box';
import RecipientAvatar from './RecipientAvatar'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../config/firebase'
import { useCollection } from 'react-firebase-hooks/firestore'
import Message from './Message'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import SendIcon from '@mui/icons-material/Send'
import MicIcon from '@mui/icons-material/Mic'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import {
	KeyboardEventHandler,
	MouseEventHandler,
	useRef,
	useState,
	useContext,
	createContext,
	useEffect
} from 'react'
import {
	addDoc,
	collection,
	doc,
	serverTimestamp,
	setDoc
} from 'firebase/firestore'
import Reply from '@mui/icons-material/Reply'
import SettingBar from '../components/SettingBar'
import {generateEmojiByGroup} from '../utils/getEmoji'
import EmojiPack from './EmojiPack'
interface Reply{
	conversation_id: string
	message_reply_id: string
	message_reply_text: string
	user_reply: string
}

interface IReplyContext {
	reply: object
	setReply: (c: Reply) => void
}

export const ReplyContext = createContext<IReplyContext>({reply: {}, setReply: () => {}});

const StyledContainer = styled.div`
	display: flex;
`;

const StyledConversationContainer = styled.div`
	/* display: flex; */
	width: 70%;
	max-height: 100vh;
	overflow-y: scroll;
	/* max-height: 91vh; */
	::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */
`;

const StyledRecipientHeader = styled.div`
	position: sticky;
	background-color: white;
	top: 0;
	display: flex;
	align-items: center;
	padding: 11px;
	height: 80px;
	border-bottom: 1px solid whitesmoke;
	z-index: 9999;
`;

const StyledHeaderInfo = styled.div`
	flex-grow: 1;
	> h3 {
		margin-top: 0;
		margin-bottom: 3px;
	}
	> span {
		font-size: 14px;
		color: gray;
	}
`;

const StyledH3 = styled.h3`
	word-break: break-all;
`;

const StyledHeaderIcons = styled.div`
	display: flex;
`;

const StyledMessageContainer = styled.div`
	padding: 10px;
	background-color: #fff;
	min-height: 90vh;
	display: flex;
    flex-direction: column;
    justify-content: flex-end;
	/* background-image: url('https://i.pinimg.com/564x/a7/9d/4a/a79d4a17f3308c7b1978ec70b87d5ed2.jpg'); */
	background-repeat: no-repeat;
  	background-attachment: fixed;
	background-repeat: repeat;	
	

`;

const StyledInputContainer = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
	/* padding: 10px; */
	position: sticky;
	bottom: 0;
	background-color: white;
	z-index: 9999;
	/* padding: 5px 0px; */
	width: 100%;
`;

const StyledBottomScreenContainer1 = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	/* margin: 10px 15px; */
	border-top: 1px solid #e7e7e7;
`;

const StyledBottomScreenContainer2 = styled.div`
	display: flex;
	width: 100%;
`;

const StyledInput = styled.input`
	flex-grow: 1;
	outline: none;
	border: none;
	border-radius: 30px;
	background-color: whitesmoke;
	padding: 15px;
	margin-left: 15px;
	margin-right: 15px;
	padding-right: 40px;
`;

const EndOfMessagesForAutoScroll = styled.div`
	margin-bottom: 30px;
`;

const ButtonClearReplyMessage= styled.span`
	position: absolute;
	top: 10px;
	right: 10px;
	cursor: pointer;
`;

const ConversationScreen = ({
	conversation,
	messages
}: {
	conversation: Conversation
	messages: IMessage[]
}) => {
	const [showSetting, setShowSetting] = useState(true);
	const [newMessage, setNewMessage] = useState('')
	const [loggedInUser, _loading, _error] = useAuthState(auth)
	const [reply, setReply] = useState<Reply | any>();

	const conversationUsers = conversation.users

	const { recipientEmail, recipient } = useRecipient(conversationUsers)

	const router = useRouter()
	const conversationId = router.query.id // localhost:3000/conversations/:id

	const queryGetMessages = generateQueryGetMessages(conversationId as string)

	const [messagesSnapshot, messagesLoading, __error] =
		useCollection(queryGetMessages)

	const showMessages = () => {
		// If front-end is loading messages behind the scenes, display messages retrieved from Next SSR (passed down from [id].tsx)
		if (messagesLoading) {
			return messages.map(message => (
				<Message key={message.id} message={message} photo={recipient?.photoURL as string} targetname={recipient?.displayName ? recipient?.displayName : 'User'}/>
			))
		}

		// If front-end has finished loading messages, so now we have messagesSnapshot
		if (messagesSnapshot) {
			return messagesSnapshot.docs.map(message => (
				<Message key={message.id} message={transformMessage(message)} photo={recipient?.photoURL as string} targetname={recipient?.displayName ? recipient?.displayName : 'User'}/>
			))
		}

		return null
	}

	const addMessageToDbAndUpdateLastSeen = async () => {
		// update last seen in 'users' collection
		await setDoc(
			doc(db, 'users', loggedInUser?.email as string),
			{
				lastSeen: serverTimestamp()
			},
			{ merge: true }
		) // just update what is changed

		// add new message to 'messages' collection
		await addDoc(collection(db, 'messages'), {
			conversation_id: conversationId,
			sent_at: serverTimestamp(),
			text: newMessage,
			user: loggedInUser?.email,
			message_reply_id: reply?.message_reply_id ? reply.message_reply_id : '',
			message_reply_text: reply?.message_reply_text ? reply.message_reply_text : '',
			reactions: [],
			user_reply: reply?.user_reply ? reply.user_reply : '',
		})

		// reset input field
		setNewMessage('')

		// scroll to bottom
		scrollToBottom()

		let newReply = {
			conversation_id: '',
			message_reply_id: '',
			message_reply_text: '',
			user: ''
		}
		setReply(newReply);
	}

	const sendMessageOnEnter: KeyboardEventHandler<HTMLInputElement> = event => {
		if (event.key === 'Enter') {
			event.preventDefault()
			if (!newMessage) return
			addMessageToDbAndUpdateLastSeen()
		}
	}

	const sendMessageOnClick: MouseEventHandler<HTMLButtonElement> = event => {
		event.preventDefault()
		if (!newMessage) return
		addMessageToDbAndUpdateLastSeen()
	}

	const endOfMessagesRef = useRef<HTMLDivElement>(null)

	const scrollToBottom = () => {
		endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
	}
	
	// useEffect(() => {
	// 	console.log({reply})
	// })
	const handleClearReply = () => {
		// console.log({reply});
		let newReply = {
			conversation_id: '',
			message_reply_id: '',
			message_reply_text: '',
			user: ''
		}
		setReply(newReply);
	}

	// handle open popover emoji-pack
	const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen((prev) => !prev);
    };

    const handleClickAway = () => {
        setOpen(false);
    };

	return (
		<StyledContainer>
			<StyledConversationContainer>
				<ReplyContext.Provider value={{reply, setReply}}>
					<StyledRecipientHeader>
						<RecipientAvatar
							recipient={recipient}
							recipientEmail={recipientEmail}
						/>

						<StyledHeaderInfo>
							<StyledH3>{recipient?.displayName ? recipient?.displayName : recipientEmail}</StyledH3>
							{recipient && (
								<span>
									Last active:{' '}
									{convertFirestoreTimestampToString(recipient.lastSeen)}
								</span>
							)}
						</StyledHeaderInfo>

						<StyledHeaderIcons>
							<IconButton>
								<AttachFileIcon />
							</IconButton>
							<IconButton>
								<MoreVertIcon />
							</IconButton>
						</StyledHeaderIcons>
					</StyledRecipientHeader>

					<StyledMessageContainer>
						{showMessages()}
						{/* for auto scroll to the end when a new message is sent */}
						<EndOfMessagesForAutoScroll ref={endOfMessagesRef} />
					</StyledMessageContainer>

					{/* Enter new message */}
					<StyledInputContainer>
						{reply?.message_reply_text!.length > 0 ? 
						<StyledBottomScreenContainer1>
							<span style={{fontSize: '14px', color: '#050505', padding: '6px 12px'}}>
								Replying to yourself
							</span>
							<span style={{fontSize: '12px', color: '#65766B', padding: '6px 12px'}}>
								{reply?.message_reply_text}
							</span>
							<ButtonClearReplyMessage onClick={handleClearReply}>x</ButtonClearReplyMessage>
						</StyledBottomScreenContainer1>
						: <></>}
							
						
						<StyledBottomScreenContainer2>
							<IconButton>
								<MoreHorizIcon />
							</IconButton>
							{/* <IconButton>
								<InsertEmoticonIcon />
							</IconButton> */}
							<IconButton>
									<AttachFileIcon />
							</IconButton>
							<IconButton>
								<MicIcon />
							</IconButton>
							<StyledInput
								id="input-chat"
								value={newMessage}
								placeholder='Aa'
								onChange={event => setNewMessage(event.target.value)}
								onKeyDown={sendMessageOnEnter}
							/>
							<ClickAwayListener onClickAway={handleClickAway}>
								<Box style={{position: 'relative'}}>
									<IconButton style={{ transform: 'translateX(-59px)'}} onClick={handleClick}>
										<SentimentSatisfiedAltIcon></SentimentSatisfiedAltIcon>
									</IconButton>
									<EmojiPack open={open}></EmojiPack>
								</Box>
							</ClickAwayListener>
							<IconButton onClick={sendMessageOnClick} disabled={!newMessage}>
								<SendIcon />
							</IconButton>
							
						</StyledBottomScreenContainer2>
					</StyledInputContainer>
				</ReplyContext.Provider>
			</StyledConversationContainer>
			{showSetting && <SettingBar user={recipient}></SettingBar>}
		</StyledContainer>
	)
}

export default ConversationScreen