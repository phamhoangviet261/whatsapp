import { Conversation } from "../types"
import styled from 'styled-components'
import { useRecipient } from "../hooks/useRecipient";
import RecipientAvatar from "./RecipientAvatar";
import { useRouter } from "next/router";
import { addDoc, collection, query, where } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
const StyledContainer= styled.div<{isShowing: boolean}>`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 5px;
    word-break: break-all;
    background-color: ${(props) => props.isShowing ? "#dee3e7" : ""};
    /* margin: 5px; */
    border-radius: 8px;
    &:hover{
        background-color: #dee3e7;
    }
`;

const StyledInformation = styled.div`
  width: 100%;
  height: 100%;
`;

const StyledName = styled.p`
  padding: 0;
  margin: 0;
  top: 0;
  font-weight: 500;
  font-size: 14px;
`;

const StyledNearestChat = styled.span`
  padding: 0;
  margin: 0;
  font-size: 12px;
`;

const ConversationSelect = ({id, conversationUsers, isShowing}: {id: string, conversationUsers: Conversation['users'], isShowing: boolean}) => {
    const {recipientEmail, recipient} = useRecipient(conversationUsers);
    const router = useRouter()
    const selectConversation = () => {
      router.push(`/conversations/${id}`)
    }
    const getUserInfo = () => {

    }
  return (
    <StyledContainer onClick={selectConversation} isShowing={isShowing}>
        <RecipientAvatar recipient={recipient} recipientEmail={recipientEmail}></RecipientAvatar>
        <StyledInformation>
          <StyledName>{recipient?.displayName ? recipient?.displayName : recipientEmail}</StyledName>
          <StyledNearestChat>Nearest chat...</StyledNearestChat>
        </StyledInformation>
    </StyledContainer>
  )
}

export default ConversationSelect
