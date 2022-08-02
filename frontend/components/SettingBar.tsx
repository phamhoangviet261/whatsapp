import React, { useState } from 'react'
import styled from 'styled-components'
import Avatar from '@mui/material/Avatar'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import RecommendIcon from '@mui/icons-material/Recommend';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LinkIcon from '@mui/icons-material/Link';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import BlockIcon from '@mui/icons-material/Block';
import ReportIcon from '@mui/icons-material/Report';

const StyledSettingBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* min-width: 20%; */
  width: 30%;
  border-left: 1px solid whitesmoke;
  min-width: 100px;
`;

const StyledInformation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px 0px 30px 0px;
`;

const StyledAvatar = styled(Avatar)``;

const StyledName = styled.div`
  margin-top: 15px;
  font-size: 20px;
  font-weight: bold;
`;

const StyledAccordionIcon = styled.div``;

const StyledCustomizeContent = styled.div``;

const StyledAccordionContainer = styled.div<{isShow: boolean}>`
  & ${StyledCustomizeContent}{
    display: ${(props) => props.isShow == true ? 'block' : 'none'};
  }
  & ${StyledAccordionIcon}{
    transform: ${(props) => props.isShow == true ? 'rotate(90deg)' : 'rotate(-90deg)'};
    transition-duration: 0.6s;
  }
`;

const StyledAccordionTitle = styled.h4`
  display: flex;
  justify-content: space-between;
  padding: 12px 10px 6px 10px;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 600;
  &:hover{
    background-color: #a7a7a732;
  }
`;

const StyledAccordionChildTitle = styled.h4`
  display: flex;
  /* justify-content: space-between; */
  padding: 12px 10px 10px 10px;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 600;
  user-select: none;
  &:hover{
    background-color: #a7a7a732;
  }
  & > svg{
    margin-right: 10px;
  }
`;







const SettingBar = ({user}: {user: any}) => {
  const [accordionShow, setAccordionShow] = useState(1);
  const handleClick = (value: number) => {
    if(value != accordionShow){
      setAccordionShow(value);
    } else {
      setAccordionShow(0);
    }
  }
  return (
    <StyledSettingBarContainer>
      <StyledInformation>
      <StyledAvatar src={user?.photoURL} sx={{ width: 80, height: 80 }}/>
        <StyledName>{user?.displayName}</StyledName>
      </StyledInformation>

      <StyledAccordionContainer isShow={accordionShow == 1 ? true : false}>
        <StyledAccordionTitle onClick={() => handleClick(1)}>Customize chat <StyledAccordionIcon><KeyboardArrowRightIcon></KeyboardArrowRightIcon></StyledAccordionIcon></StyledAccordionTitle>
        <StyledCustomizeContent>
          <StyledAccordionChildTitle><DarkModeIcon></DarkModeIcon>Change theme</StyledAccordionChildTitle>
          <StyledAccordionChildTitle><RecommendIcon></RecommendIcon>Change emoji</StyledAccordionChildTitle>
          <StyledAccordionChildTitle><FormatSizeIcon></FormatSizeIcon>Edit nicknames</StyledAccordionChildTitle>
          <StyledAccordionChildTitle><ManageSearchIcon></ManageSearchIcon>Search in conversation</StyledAccordionChildTitle>
        </StyledCustomizeContent>
      </StyledAccordionContainer>

      <StyledAccordionContainer isShow={accordionShow == 2 ? true : false}>
        <StyledAccordionTitle onClick={() => handleClick(2)}>Media, files and links <StyledAccordionIcon><KeyboardArrowRightIcon></KeyboardArrowRightIcon></StyledAccordionIcon></StyledAccordionTitle>
        <StyledCustomizeContent>
          <StyledAccordionChildTitle><ImageIcon></ImageIcon>Media</StyledAccordionChildTitle>
          <StyledAccordionChildTitle><InsertDriveFileIcon></InsertDriveFileIcon>Files</StyledAccordionChildTitle>
          <StyledAccordionChildTitle><LinkIcon></LinkIcon>Links</StyledAccordionChildTitle>
        </StyledCustomizeContent>
      </StyledAccordionContainer>

      <StyledAccordionContainer isShow={accordionShow == 3 ? true : false}>
        <StyledAccordionTitle onClick={() => handleClick(3)}>Privacy & support <StyledAccordionIcon><KeyboardArrowRightIcon></KeyboardArrowRightIcon></StyledAccordionIcon></StyledAccordionTitle>
        <StyledCustomizeContent>
          <StyledAccordionChildTitle><NotificationsOffIcon></NotificationsOffIcon>Mute notfications</StyledAccordionChildTitle>
          <StyledAccordionChildTitle><BlockIcon></BlockIcon>Block</StyledAccordionChildTitle>
          <StyledAccordionChildTitle><ReportIcon></ReportIcon>Report</StyledAccordionChildTitle>
        </StyledCustomizeContent>
      </StyledAccordionContainer>



    </StyledSettingBarContainer>
  )
}

export default SettingBar
