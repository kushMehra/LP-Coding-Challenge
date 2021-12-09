let idpDomain = "";
let messageDomain = "";
let jwt = "";
let conversationId = null;
let messageId = 0;
let connectionStatus = false;
var socket;

document.getElementById("start").disabled = false;
document.getElementById("end").disabled = true;
 
getdata = () => {

    //get the idp domain info
    fetch('https://api.liveperson.net/api/account/78099952/service/idp/baseURI.json?version=1.0')
     .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Something went wrong');
        }
      }).then(data => {
            idpDomain = data.baseURI;
            document.getElementById('idpDomain').innerHTML = idpDomain;
            console.log(idpDomain);

            // if successful, retrieve the jwt that will be utilised to connect to the websocket
            fetch('https://'+idpDomain+'/api/account/78099952/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(""),
                }).then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Something went wrong');
                    }
                }).then(data => {
                    //save jwt to be used later for websocket connection
                    jwt = data.jwt;
                    console.log('Success:', jwt);
                    }).catch((error) => {
                        console.error('Error:', error);
                    });
        }).catch((error) => {
            console.log('Error:', error)
        });

    // get the asyncMessagingEnt domain to send messages    
    fetch('https://api.liveperson.net/api/account/78099952/service/asyncMessagingEnt/baseURI.json?version=1.0')
     .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Something went wrong');
        }
      }).then(data => {
            msgDomain = data.baseURI;
            document.getElementById('msgDomain').innerHTML = msgDomain;
            console.log(msgDomain);
        }).catch((error) => {
            console.log('Error:', error)
    });
}

// establish the connection
connectSocket = () => {
    wssURL = "wss://" + msgDomain + "/ws_api/account/78099952/messaging/consumer?v=3";

    if (!connectionStatus) {
        socket = new WebSocket(wssURL);
    }
    let payload = {
        "kind": "req",
        "id": messageId,
        "type": "InitConnection",
        "headers": [{
        "type": ".ams.headers.ClientProperties",
        "deviceFamily": "DESKTOP",
        "os": "WINDOWS"
        }, {
        "type": ".ams.headers.ConsumerAuthentication",
        "jwt": jwt
        }]
    };
    incrementId();
    
    socket.onopen = function(event) {
        //alert("[open] Connection established");
        //alert("Sending to server");
        //alert("socket state = " + socket.readyState);
        document.getElementById("start").disabled = true;
        document.getElementById("end").disabled = false;
        connectionStatus = true;
        document.getElementById('status').innerHTML = "Connection Established";
        socket.send(JSON.stringify(payload));
        let msg1 = {"kind":"req","id":messageId,"type":"cm.ConsumerRequestConversation"};
        incrementId();
        socket.send(JSON.stringify(msg1));
    };

    //all responses received will be handled in this block
    socket.onmessage = function(event) {
        //alert(`[message] Data received from server: ${event.data}`);
        console.log(event.data);
        if (!conversationId) {
            conversationId = JSON.parse(event.data).body.conversationId;
            console.log ("conversation id set to " + conversationId);
        }
        let message = event.data;

        // show the message receieved
        let messageElem = document.createElement('div');
        messageElem.textContent = message;
        document.getElementById('messages').prepend(messageElem);
    };

    // all errors on the socket will be handled in this block
    socket.onerror = function(e) {
        document.getElementById("start").disabled = false;
        document.getElementById("end").disabled = true;
        console.log(e.data);
    }
}

disconnectSocket = () => {
    console.log("c id is " + conversationId);
    let payload = {"kind":"req","id":messageId,"type":"cm.UpdateConversationField","body": {
        "conversationId": conversationId,
        "conversationField": [{
        "field": "ConversationStateField",
        "conversationState": "CLOSE"
        }]}}
    console.log(payload);
    socket.send(JSON.stringify(payload));
    socket.close();
    document.getElementById('status').innerHTML = "Connection Disconnected";
    document.getElementById("start").disabled = false;
    document.getElementById("end").disabled = true;
}

// send message using the send button on the form
document.forms.publish.onsubmit = function() {

    let outgoingMessage = this.message.value;
    let payload = {"kind":"req","id":messageId,"type":"ms.PublishEvent","body": {
        "dialogId": conversationId,
        "event": {
        "type": "ContentEvent",
        "contentType": "text/plain",
        "message": outgoingMessage}}}
    incrementId();
    socket.send(JSON.stringify(payload));
    return false;
};

// to keep the unique id for each message sent
incrementId = () => {
    messageId++;
}