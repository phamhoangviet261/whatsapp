import { Conversation } from "../types"
import styled from 'styled-components'
import { useRecipient } from "../hooks/useRecipient";
import RecipientAvatar from "./RecipientAvatar";
import { useRouter } from "next/router";

const StyledContainer= styled.div<{isShowing: boolean}>`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-all;
    background-color: ${(props) => props.isShowing ? "#e5e5e5" : ""};
    margin: 5px;
    border-radius: 8px;
    &:hover{
        background-color: #e9eaeb;
    }
`;


const ConversationSelect = ({id, conversationUsers, isShowing}: {id: string, conversationUsers: Conversation['users'], isShowing: boolean}) => {
    const {recipientEmail, recipient} = useRecipient(conversationUsers);
    const router = useRouter()
    const selectConversation = () => {
      router.push(`/conversations/${id}`)
    }
  return (
    <StyledContainer onClick={selectConversation} isShowing={isShowing}>
        <RecipientAvatar recipient={recipient} recipientEmail={recipientEmail}></RecipientAvatar>
     <span>{recipientEmail}</span>
    </StyledContainer>
  )
}

export default ConversationSelect
