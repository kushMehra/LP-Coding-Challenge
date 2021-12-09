# LP-Coding-Challenge
Coding challenge

Coding excersise to connect to the LP Conversation Cloud. It's built using the following technologies
- JavaScript
- Websockets
- HTML for the UI

Using this program you will be able to send messages to liveperson's conversation cloud and receive messages that the server responds over the websocket connection.

PRE-REQUISITES
- An active liveperson developer account. You will need the account number to run the program.
- Browser for the UI.

INSTRUCTIONS
- Download the files to a folder.
- Open the index.html file in a browser.
- Enter your account number after registering the account with liveperson.
- Click on the 'Retreive Domains' button to set the domains required to establish the connection.
- Click on the 'Connect' button to open a websocket connection. This should update the view with 'Connection Established'.
- The user can send messages using the input field and then pressing the 'Send' button.
- The messages received from the server will appear in the view below.
- You can verify the messages being sent to the agent on the liveperson conversation cloud Agent Workspace. NOTE: Look under All conversations tab.

![sequence-diagram](https://user-images.githubusercontent.com/20487020/145467013-92f71953-bde7-4da7-9ab9-5285551ecfcb.png)

EXPLANATION
1. The first step is obviously to create an account with Liveperson. This sets up all the services and endpoints in the backend for this program to run.
2. After the account is established, you will need the account number to get the two domain urls. One is for idp and the other is for asyncMessagingEnt.
3. The idp url will return the jwt.
4. The asyncMessagingEnt url provides the wss endpoint for the socket connection.
5. Both steps 4&5 provide the details to establish the socket connection. 
6. After the connection is established the websocket can be used to send and receive messages.


ISSUES
- WebSocket is already in CLOSING or CLOSED state.
-   The above error could happen in various circumstances. One of them could be that the jwt is invalid or not specified while opening the websocket connection.
