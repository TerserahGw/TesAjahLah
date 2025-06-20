document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }

    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const messagesContainer = document.getElementById('messagesContainer');

    const loadFriendChat = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const friendUsername = urlParams.get('friend');
        
        if (!friendUsername) {
            window.location.href = 'friend-list.html';
            return;
        }

        document.getElementById('friendName').textContent = friendUsername;
        document.getElementById('modalFriendName').textContent = friendUsername;
        document.getElementById('modalFriendUsername').textContent = `@${friendUsername}`;
        
        const profilePic = document.querySelector('.chat-info .profile-pic');
        profilePic.textContent = friendUsername.charAt(0).toUpperCase();
        
        const modalProfilePic = document.getElementById('modalFriendPic');
        modalProfilePic.textContent = friendUsername.charAt(0).toUpperCase();
        
        const status = Math.random() > 0.5 ? 'Online' : 'Offline';
        document.getElementById('friendStatus').textContent = status;
        document.getElementById('modalFriendStatus').textContent = status;
        
        document.getElementById('modalFriendStatus').className = status.toLowerCase();
        
        loadMessages(friendUsername);
    };

    const loadMessages = (friendUsername) => {
        const chatId = [currentUser, friendUsername].sort().join('_');
        const messages = JSON.parse(localStorage.getItem(`messages_${chatId}`)) || [];
        
        messagesContainer.innerHTML = '';
        
        if (messages.length === 0) {
            const welcomeMsg = document.createElement('div');
            welcomeMsg.className = 'welcome-message';
            welcomeMsg.innerHTML = `
                <h3>Start chatting with ${friendUsername}</h3>
                <p>Send your first message</p>
            `;
            messagesContainer.appendChild(welcomeMsg);
            return;
        }

        messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${msg.sender === currentUser ? 'self' : ''}`;
            messageElement.classList.add('message-appear');
            
            messageElement.innerHTML = `
                <div class="profile-pic">${msg.sender.charAt(0).toUpperCase()}</div>
                <div class="message-content">
                    ${msg.sender !== currentUser ? `<div class="message-sender">${msg.sender}</div>` : ''}
                    <div class="message-text">${msg.text}</div>
                    <div class="message-time">${formatDate(msg.timestamp)}</div>
                </div>
            `;
            
            messagesContainer.appendChild(messageElement);
        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const sendMessage = () => {
        const messageText = messageInput.value.trim();
        if (!messageText) return;
        
        const urlParams = new URLSearchParams(window.location.search);
        const friendUsername = urlParams.get('friend');
        
        if (!friendUsername) return;
        
        const chatId = [currentUser, friendUsername].sort().join('_');
        const messages = JSON.parse(localStorage.getItem(`messages_${chatId}`)) || [];
        
        messages.push({
            sender: currentUser,
            text: messageText,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem(`messages_${chatId}`, JSON.stringify(messages));
        
        messageInput.value = '';
        loadMessages(friendUsername);
    };

    if (sendMessageBtn && messageInput) {
        sendMessageBtn.addEventListener('click', sendMessage);
        
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    const friendProfileBtn = document.getElementById('friendProfileBtn');
    if (friendProfileBtn) {
        friendProfileBtn.addEventListener('click', () => {
            document.getElementById('friendProfileModal').classList.add('modal-open');
        });
    }

    const clearChatBtn = document.getElementById('clearChatBtn');
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const friendUsername = urlParams.get('friend');
            
            if (!friendUsername) return;
            
            const chatId = [currentUser, friendUsername].sort().join('_');
            localStorage.removeItem(`messages_${chatId}`);
            
            loadMessages(friendUsername);
            document.getElementById('friendProfileModal').classList.remove('modal-open');
            showToast('Chat history cleared');
        });
    }

    const removeFriendBtn = document.getElementById('removeFriendBtn');
    if (removeFriendBtn) {
        removeFriendBtn.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const friendUsername = urlParams.get('friend');
            
            if (!friendUsername) return;
            
            const friends = JSON.parse(localStorage.getItem(`friends_${currentUser}`)) || [];
            const updatedFriends = friends.filter(f => f.username !== friendUsername);
            
            localStorage.setItem(`friends_${currentUser}`, JSON.stringify(updatedFriends));
            
            showToast(`${friendUsername} removed from friends`);
            setTimeout(() => {
                window.location.href = 'friend-list.html';
            }, 1000);
        });
    }

    loadFriendChat();
});

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification fade-in';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}