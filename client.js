const socket = io();

// Handle incoming messages
socket.on('message', (message) => {
  const messagesDiv = document.getElementById('messages');
  const messageElement = document.createElement('p');
  messageElement.innerText = message;
  messagesDiv.appendChild(messageElement);
});

// Send message when the button is clicked
const sendButton = document.getElementById('sendButton');
sendButton.addEventListener('click', () => {
  const inputMessage = document.getElementById('inputMessage');
  const message = inputMessage.value;
  socket.emit('message', message);
  inputMessage.value = '';
});

// Fetch messages from the server
fetch('/messages')
  .then((response) => response.json())
  .then((data) => {
    const messagesDiv = document.getElementById('messages');
    data.forEach((message) => {
      const messageElement = document.createElement('p');
      messageElement.innerText = message;
      messagesDiv.appendChild(messageElement);
    });
  })