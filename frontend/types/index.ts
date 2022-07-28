import { Timestamp } from 'firebase/firestore'

export interface Conversation {
	users: string[]
}

export interface AppUser {
	email: string
	lastSeen: Timestamp
	photoURL: string
	displayName: string
}

export interface IMessage {
	id: string
	conversation_id: string
	text: string
	sent_at: string
	user: string
	message_reply_id: string
	message_reply_text: string
	user_reply: string
	reactions: Array<string>
}

             

/*                                                                                                 





 



 
          
   
												  


$env:PSModulePath = $env:PSModulePath + "$([System.IO.Path]::PathSeparator)C:\Users\Anup\Documents\WindowsPowerShell\Modules"
                             
Write-Color -Text " .--.--.     ,---,   "         -Color Cyan
Write-Color -Text "/  /    '. ,--.' |      ,--,                      "         -Color Cyan
Write-Color -Text "|  :  /`. / |  |  :    ,--.'|    __  ,-.   ,---.   "               -Color Blue,Cyan
Write-Color -Text ";  |  |--`  :  :  :    |  |,   ,' ,'/ /|  '   ,'\  "         -Color Blue, Cyan
Write-Color -Text "|  :  ;_    :  |  |,--.`--'_   '  | |' | /   /   | "        -Color Blue, Cyan
Write-Color -Text " \  \    `. |  :  '   |,' ,'|  |  |   ,'.   ; ,. : "       -Color Blue, Cyan
Write-Color -Text "	 `----.   \|  |   /' :'  | |  '  :  /  '   | |: : "      -Color Blue, DarkCyan, Cyan 
Write-Color -Text "  __ \  \  |'  :  | | ||  | :  |  | '   '   | .; : "         -Color Cyan
Write-Color -Text " /  /`--'  /|  |  ' | :'  : |__;  : |   |   :    | "         -Color Cyan
Write-Color -Text "'--'.     / |  :  :_:,'|  | '.'|  , ;    \   \  /  "         -Color Cyan
Write-Color -Text "  `--'---'  |  | ,'    ;  :    ;---'      `----'   "         -Color Cyan
Write-Color -Text "		       `--''      |  ,   /          "         -Color Cyan
Write-Color -Text "				     	   ---`-'                  "         -Color Cyan
Write-Color -Text ""         -Color Cyan
Import-Module posh-git
Import-Module oh-my-posh
Set-PoshPrompt 1_shell
oh-my-posh init pwsh --config ~/.1_shell.omp.json | Invoke-Expression

*/