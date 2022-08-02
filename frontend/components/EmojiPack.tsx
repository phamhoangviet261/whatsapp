import React, { useEffect } from 'react'
import styled from 'styled-components'
import Emoji from './Emoji';
import {generateEmojiByGroup} from '../utils/getEmoji'

const StyledContainer = styled.div<{open: boolean}>`
    display: ${(props) => props.open == true ? 'block' : 'none'};
    position: absolute;
    bottom: 50px;
    right: 56px;
    width: 400px;
    height: 300px;
    /* border: 2px solid red; */
    border-radius: 20px;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    overflow-y: scroll;
    ::-webkit-scrollbar {
		/* display: none; */
        max-width: 10px;
	}
`;

const StyledPack = styled.div`
    margin: 6px;
`;

const StyledTitle = styled.p`
    margin-left: 12px;
    margin-top: 20px;
    color: #1f1f1f80;
    font-weight: 600;
`;

const StyledListEmoji= styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const StyledEmoji = styled(Emoji)`
    width: 30px;
    height: 30px;
    margin: 10px;
    transform: scale(1.5);
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    border-radius: 6px;
    &:hover{
        background-color: rgba(134, 131, 131, 0.5);
    }
`;

const EmojiPack = ({open}: {open: boolean}) => {
    let emoji =generateEmojiByGroup()
    // useEffect(() => {
    //     emoji = generateEmojiByGroup();
    // }, []);
    const unicodeTohex = (unicode: string): number => parseInt(unicode, 16)
    const handleClickEmoji = (data: { codes: string; char: string; name: string; category: string; group: string; subgroup: string; }) => {
        console.log("click")
        console.log({data: data});
    }
  return (
    <StyledContainer open={open}>
        {emoji.map((item, index) => <StyledPack key={index}>
            <StyledTitle>{item.groupname}</StyledTitle>
            <StyledListEmoji>
                {item.data.map((data, index1) => <StyledEmoji key={index1} className="" label={data.name} symbol={unicodeTohex(data.codes)} data={data}></StyledEmoji>)}
            </StyledListEmoji>
            </StyledPack>)}
    </StyledContainer>
  )
}

export default EmojiPack
