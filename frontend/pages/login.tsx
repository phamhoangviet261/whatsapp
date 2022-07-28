import Button from '@mui/material/Button'
import Head from 'next/head'
import styled from 'styled-components'
import Image from 'next/image'
import WhatsAppLogo from '../assets/whatsapplogo.png'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth } from '../config/firebase'


const StyledContainer = styled.div`
	height: 100vh;
	display: grid;
	place-items: center;
	background-color: whitesmoke;
`

const StyledLoginContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	/* padding: 100px; */
	background-color: white;
	border-radius: 5px;
	box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
`

const StyledImageWrapper = styled.div`
	margin-bottom: 50px;
`

const Login = () => {
	const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth)

	const signIn = () => {
		signInWithGoogle()
	}

	return (
		<StyledContainer>
			<Head>
				<title>Login</title>
			</Head>

			<StyledLoginContainer>
			<div id="wrapper">
				<div id="intro">
					<img src="https://i.imgur.com/B6JQ0qN.png" alt="alt img"/>
					<h1>Connect with your favourite people</h1>
					<p>No matter where you are, or what you’re doing, or who you’re with, it doesn’t matter it doesn’t change it, I have and I always will, honestly, truly, completely love you</p>
					</div>
					<div id="inputs">
					<input placeholder="Email address or phone number"/>
					<input placeholder="Password"/>
					</div>
					<div id="controls">
					<button onClick={() => signInWithGoogle()}>Continue</button>
					<div>
						<input type="checkbox" id="keep-signed"/>
						<label htmlFor="keep-signed">Keep me signed in</label>
					</div>
				</div>
			</div>
			</StyledLoginContainer>
		</StyledContainer>
	)
}

export default Login
