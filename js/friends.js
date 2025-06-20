document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }
    
    document.getElementById('menuUsername').textContent = currentUser;
    document.getElementById('profileMenuUsername').textContent = currentUser;
    
    const generateInviteCode = () => {
        return Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + 
               Math.random().toString(36).substring(2, 6).toUpperCase();
    };
    
    let userInviteCode = localStorage.getItem(`inviteCode_${currentUser}`);
    if (!userInviteCode) {
        userInviteCode = generateInviteCode();
        localStorage.setItem(`inviteCode_${currentUser}`, userInviteCode);
    }
    
    document.getElementById('userInviteCode').textContent = userInviteCode;
    document.getElementById('inviteCodeDisplay').textContent = userInviteCode;
    
    const copyInviteBtn = document.getElementById('copyInviteBtn');
    if (copyInviteBtn) {
        copyInviteBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(userInviteCode).then(() => {
                showToast('Invite code copied to clipboard');
            });
        });
    }
    
    const copyInviteCodeBtn = document.getElementById('copyInviteCodeBtn');
    if (copyInviteCodeBtn) {
        copyInviteCodeBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(userInviteCode).then(() => {
                showToast('Invite code copied to clipboard');
            });
        });
    }
    
    const loadFriends = () => {
        const friends = JSON.parse(localStorage.getItem(`friends_${currentUser}`)) || [];
        const onlineFriendsList = document.getElementById('onlineFriends');
        const offlineFriendsList = document.getElementById('offlineFriends');
        
        onlineFriendsList.innerHTML = '';
        offlineFriendsList.innerHTML = '';
        
        friends.forEach(friend => {
            const friendItem = document.createElement('div');
            friendItem.className = 'friend-item';
            friendItem.innerHTML = `
                <div class="profile-pic">${friend.username.charAt(0).toUpperCase()}</div>
                <span>${friend.username}</span>
                <div class="status-indicator ${Math.random() > 0.5 ? 'status-online' : 'status-offline'}"></div>
            `;
            
            friendItem.addEventListener('click', () => {
                window.location.href = `friend-chat.html?friend=${friend.username}`;
            });
            
            if (friendItem.querySelector('.status-indicator').classList.contains('status-online')) {
                onlineFriendsList.appendChild(friendItem);
            } else {
                offlineFriendsList.appendChild(friendItem);
            }
        });
    };
    
    loadFriends();
    
    const searchByUsernameBtn = document.getElementById('searchByUsernameBtn');
    if (searchByUsernameBtn) {
        searchByUsernameBtn.addEventListener('click', () => {
            const username = document.getElementById('friendUsername').value;
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const resultsContainer = document.getElementById('friendSearchResults');
            
            resultsContainer.innerHTML = '';
            
            if (!username) return;
            
            const results = users.filter(user => 
                user.username.toLowerCase().includes(username.toLowerCase()) && 
                user.username !== currentUser
            );
            
            if (results.length === 0) {
                resultsContainer.innerHTML = '<p>No users found</p>';
                return;
            }
            
            results.forEach(user => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <div class="profile-pic">${user.username.charAt(0).toUpperCase()}</div>
                    <span>${user.username}</span>
                    <button class="add-friend-btn">Add</button>
                `;
                
                resultItem.querySelector('.add-friend-btn').addEventListener('click', () => {
                    const friends = JSON.parse(localStorage.getItem(`friends_${currentUser}`)) || [];
                    if (friends.some(f => f.username === user.username)) {
                        alert('This user is already your friend');
                        return;
                    }
                    
                    friends.push({ username: user.username });
                    localStorage.setItem(`friends_${currentUser}`, JSON.stringify(friends));
                    loadFriends();
                    resultsContainer.innerHTML = '<p>Friend added successfully</p>';
                });
                
                resultsContainer.appendChild(resultItem);
            });
        });
    }
    
    const searchByInviteBtn = document.getElementById('searchByInviteBtn');
    if (searchByInviteBtn) {
        searchByInviteBtn.addEventListener('click', () => {
            const inviteCode = document.getElementById('friendInviteCode').value;
            const users = Object.keys(localStorage)
                .filter(key => key.startsWith('inviteCode_'))
                .map(key => ({
                    username: key.replace('inviteCode_', ''),
                    code: localStorage.getItem(key)
                }));
            
            const resultsContainer = document.getElementById('friendSearchResults');
            resultsContainer.innerHTML = '';
            
            if (!inviteCode) return;
            
            const user = users.find(u => u.code === inviteCode);
            
            if (!user) {
                resultsContainer.innerHTML = '<p>No user found with this invite code</p>';
                return;
            }
            
            if (user.username === currentUser) {
                resultsContainer.innerHTML = '<p>You cannot add yourself</p>';
                return;
            }
            
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <div class="profile-pic">${user.username.charAt(0).toUpperCase()}</div>
                <span>${user.username}</span>
                <button class="add-friend-btn">Add</button>
            `;
            
            resultItem.querySelector('.add-friend-btn').addEventListener('click', () => {
                const friends = JSON.parse(localStorage.getItem(`friends_${currentUser}`)) || [];
                if (friends.some(f => f.username === user.username)) {
                    alert('This user is already your friend');
                    return;
                }
                
                friends.push({ username: user.username });
                localStorage.setItem(`friends_${currentUser}`, JSON.stringify(friends));
                loadFriends();
                resultsContainer.innerHTML = '<p>Friend added successfully</p>';
            });
            
            resultsContainer.appendChild(resultItem);
        });
    }
});