import IconButton from '@mui/material/IconButton'
import styled from 'styled-components'
import { useRecipient } from '../hooks/useRecipient'
import { Conversation, IMessage } from '../types'
import {
	convertFirestoreTimestampToString,
	generateQueryGetMessages,
	transformMessage
} from '../utils/getMessagesInConversation'
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

interface Reply{
	conversation_id: string
	message_reply_id: string
	message_reply_text: string
	message_replied: string
	user: string
}

interface IReplyContext {
	reply: object
	setReply: (c: Reply) => void
}

export const ReplyContext = createContext<IReplyContext>({reply: {}, setReply: () => {}});

const StyledRecipientHeader = styled.div`
	position: sticky;
	background-color: white;
	z-index: 100;
	top: 0;
	display: flex;
	align-items: center;
	padding: 11px;
	height: 80px;
	border-bottom: 1px solid whitesmoke;
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
	padding: 30px;
	background-color: #fff;
	min-height: 90vh;
	display: flex;
    flex-direction: column;
    justify-content: flex-end;
`;

const StyledInputContainer = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
	/* padding: 10px; */
	position: sticky;
	bottom: 0;
	background-color: white;
	z-index: 100;
`;

const StyledBottomScreenContainer1 = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	margin: 10px 15px;
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
	border-radius: 10px;
	background-color: whitesmoke;
	padding: 15px;
	margin-left: 15px;
	margin-right: 15px;
`;

const EndOfMessagesForAutoScroll = styled.div`
	margin-bottom: 30px;
`;

const ConversationScreen = ({
	conversation,
	messages
}: {
	conversation: Conversation
	messages: IMessage[]
}) => {
	const [newMessage, setNewMessage] = useState('')
	const [loggedInUser, _loading, _error] = useAuthState(auth)

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
				<Message key={message.id} message={message} photo={recipient?.photoURL as string}/>
			))
		}

		// If front-end has finished loading messages, so now we have messagesSnapshot
		if (messagesSnapshot) {
			return messagesSnapshot.docs.map(message => (
				<Message key={message.id} message={transformMessage(message)} photo={recipient?.photoURL as string}/>
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
			message_reply_id: '',
			message_reply_text: '',
			reactions: []
		})

		// reset input field
		setNewMessage('')

		// scroll to bottom
		scrollToBottom()
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
	
	const [reply, setReply] = useState<Reply | any>();
	useEffect(() => {
		console.log({reply})
	})
	return (
		<>
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
				{reply?.message_replied!.length > 0 ? 
				<StyledBottomScreenContainer1>
					<span style={{fontSize: '14px', color: '#050505', padding: '6px 12px'}}>
						Replying to yourself
					</span>
					<span style={{fontSize: '12px', color: '#65766B', padding: '6px 12px'}}>
						{reply?.message_replied}
					</span>
				</StyledBottomScreenContainer1>
				: <></>}
					
				
				<StyledBottomScreenContainer2>
					<IconButton>
						<MoreHorizIcon />
					</IconButton>
					<IconButton>
						<InsertEmoticonIcon />
					</IconButton>
					<IconButton>
							<AttachFileIcon />
					</IconButton>
					<StyledInput
						value={newMessage}
						onChange={event => setNewMessage(event.target.value)}
						onKeyDown={sendMessageOnEnter}
					/>
					<IconButton onClick={sendMessageOnClick} disabled={!newMessage}>
						<SendIcon />
					</IconButton>
					<IconButton>
						<MicIcon />
					</IconButton>
				</StyledBottomScreenContainer2>
			</StyledInputContainer>
			</ReplyContext.Provider>
		</>
	)
}

export default ConversationScreen