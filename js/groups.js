document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }
    
    const createGroupForm = document.getElementById('createGroupForm');
    if (createGroupForm) {
        createGroupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const groupName = document.getElementById('groupName').value;
            const groupDescription = document.getElementById('groupDescription').value;
            const maxUsers = parseInt(document.getElementById('groupMaxUsers').value);
            
            const groupId = 'group_' + Date.now();
            const inviteCode = Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + 
                              Math.random().toString(36).substring(2, 6).toUpperCase();
            
            const newGroup = {
                id: groupId,
                name: groupName,
                description: groupDescription,
                maxUsers: maxUsers,
                creator: currentUser,
                createdAt: new Date().toISOString(),
                inviteCode: inviteCode,
                members: [{
                    username: currentUser,
                    role: 'creator',
                    joinedAt: new Date().toISOString()
                }],
                roles: [
                    {
                        name: 'creator',
                        permissions: ['all'],
                        color: '#d4a017',
                        rank: 100
                    },
                    {
                        name: 'admin',
                        permissions: ['manage_messages', 'kick_members', 'ban_members', 'manage_roles', 'manage_rooms'],
                        color: '#f44336',
                        rank: 90
                    },
                    {
                        name: 'member',
                        permissions: ['send_messages'],
                        color: '#4caf50',
                        rank: 10
                    }
                ],
                rooms: [
                    {
                        id: 'main',
                        name: 'Main Chat',
                        description: 'General discussion',
                        permissions: ['send_messages']
                    },
                    {
                        id: 'rules',
                        name: 'Rules',
                        description: 'Group rules',
                        permissions: ['view_room']
                    }
                ]
            };
            
            const groups = JSON.parse(localStorage.getItem('groups')) || [];
            groups.push(newGroup);
            localStorage.setItem('groups', JSON.stringify(groups));
            
            const userGroups = JSON.parse(localStorage.getItem(`userGroups_${currentUser}`)) || [];
            userGroups.push(groupId);
            localStorage.setItem(`userGroups_${currentUser}`, JSON.stringify(userGroups));
            
            document.getElementById('createGroupModal').classList.remove('modal-open');
            window.location.href = `group-chat.html?groupId=${groupId}`;
        });
    }
    
    const uploadGroupPhotoBtn = document.getElementById('uploadGroupPhotoBtn');
    if (uploadGroupPhotoBtn) {
        uploadGroupPhotoBtn.addEventListener('click', () => {
            document.getElementById('groupPhotoInput').click();
        });
    }
    
    const groupPhotoInput = document.getElementById('groupPhotoInput');
    if (groupPhotoInput) {
        groupPhotoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    uploadGroupPhotoBtn.innerHTML = `<i class="fas fa-check"></i> Photo Selected`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    const loadUserGroups = () => {
        const userGroups = JSON.parse(localStorage.getItem(`userGroups_${currentUser}`)) || [];
        const groups = JSON.parse(localStorage.getItem('groups')) || [];
        const groupListMenu = document.getElementById('groupListMenu');
        
        if (groupListMenu) {
            groupListMenu.innerHTML = '';
            
            userGroups.forEach(groupId => {
                const group = groups.find(g => g.id === groupId);
                if (group) {
                    const groupItem = document.createElement('a');
                    groupItem.href = `group-chat.html?groupId=${groupId}`;
                    groupItem.className = 'menu-item';
                    groupItem.innerHTML = `<i class="fas fa-hashtag"></i> ${group.name}`;
                    groupListMenu.appendChild(groupItem);
                }
            });
        }
    };
    
    loadUserGroups();
    
    const addToGroupBtn = document.getElementById('addToGroupBtn');
    if (addToGroupBtn) {
        addToGroupBtn.addEventListener('click', () => {
            const groupSelectModal = document.getElementById('groupSelectModal');
            const existingGroupList = document.getElementById('existingGroupList');
            const createGroupForm = document.getElementById('createGroupForm');
            
            const urlParams = new URLSearchParams(window.location.search);
            const friendUsername = urlParams.get('friend');
            
            if (!friendUsername) return;
            
            const userGroups = JSON.parse(localStorage.getItem(`userGroups_${currentUser}`)) || [];
            const groups = JSON.parse(localStorage.getItem('groups')) || [];
            
            existingGroupList.innerHTML = '';
            
            userGroups.forEach(groupId => {
                const group = groups.find(g => g.id === groupId);
                if (group) {
                    const isMember = group.members.some(m => m.username === friendUsername);
                    if (isMember) return;
                    
                    const currentUserMember = group.members.find(m => m.username === currentUser);
                    const currentUserRole = group.roles.find(r => r.name === currentUserMember.role);
                    
                    const canAddMembers = currentUserRole && 
                                         (currentUserRole.permissions.includes('all') || 
                                          currentUserRole.permissions.includes('add_members'));
                    
                    const groupItem = document.createElement('div');
                    groupItem.className = 'group-item';
                    groupItem.innerHTML = `
                        <h4>${group.name}</h4>
                        <p>${group.description || 'No description'}</p>
                        ${canAddMembers ? 
                          `<button class="btn btn-small add-member-btn" data-group="${group.id}">Add</button>` : 
                          `<button class="btn btn-small send-invite-btn" data-group="${group.id}">Send Invite</button>`}
                    `;
                    
                    if (canAddMembers) {
                        groupItem.querySelector('.add-member-btn').addEventListener('click', () => {
                            group.members.push({
                                username: friendUsername,
                                role: 'member',
                                joinedAt: new Date().toISOString()
                            });
                            localStorage.setItem('groups', JSON.stringify(groups));
                            showToast(`${friendUsername} added to ${group.name}`);
                            groupSelectModal.classList.remove('modal-open');
                        });
                    } else {
                        groupItem.querySelector('.send-invite-btn').addEventListener('click', () => {
                            const invites = JSON.parse(localStorage.getItem(`invites_${friendUsername}`)) || [];
                            invites.push({
                                groupId: group.id,
                                groupName: group.name,
                                invitedBy: currentUser,
                                timestamp: new Date().toISOString()
                            });
                            localStorage.setItem(`invites_${friendUsername}`, JSON.stringify(invites));
                            showToast(`Invite sent to ${friendUsername}`);
                            groupSelectModal.classList.remove('modal-open');
                        });
                    }
                    
                    existingGroupList.appendChild(groupItem);
                }
            });
            
            createGroupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const groupName = document.getElementById('newGroupName').value;
                const groupDescription = document.getElementById('newGroupDescription').value;
                
                const groupId = 'group_' + Date.now();
                const inviteCode = Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + 
                                  Math.random().toString(36).substring(2, 6).toUpperCase();
                
                const newGroup = {
                    id: groupId,
                    name: groupName,
                    description: groupDescription,
                    maxUsers: 32,
                    creator: currentUser,
                    createdAt: new Date().toISOString(),
                    inviteCode: inviteCode,
                    members: [
                        {
                            username: currentUser,
                            role: 'creator',
                            joinedAt: new Date().toISOString()
                        },
                        {
                            username: friendUsername,
                            role: 'member',
                            joinedAt: new Date().toISOString()
                        }
                    ],
                    roles: [
                        {
                            name: 'creator',
                            permissions: ['all'],
                            color: '#d4a017',
                            rank: 100
                        },
                        {
                            name: 'admin',
                            permissions: ['manage_messages', 'kick_members', 'ban_members', 'manage_roles', 'manage_rooms'],
                            color: '#f44336',
                            rank: 90
                        },
                        {
                            name: 'member',
                            permissions: ['send_messages'],
                            color: '#4caf50',
                            rank: 10
                        }
                    ],
                    rooms: [
                        {
                            id: 'main',
                            name: 'Main Chat',
                            description: 'General discussion',
                            permissions: ['send_messages']
                        },
                        {
                            id: 'rules',
                            name: 'Rules',
                            description: 'Group rules',
                            permissions: ['view_room']
                        }
                    ]
                };
                
                const groups = JSON.parse(localStorage.getItem('groups')) || [];
                groups.push(newGroup);
                localStorage.setItem('groups', JSON.stringify(groups));
                
                const userGroups = JSON.parse(localStorage.getItem(`userGroups_${currentUser}`)) || [];
                userGroups.push(groupId);
                localStorage.setItem(`userGroups_${currentUser}`, JSON.stringify(userGroups));
                
                showToast(`Group created and ${friendUsername} added`);
                groupSelectModal.classList.remove('modal-open');
                document.getElementById('friendProfileModal').classList.remove('modal-open');
            });
            
            groupSelectModal.classList.add('modal-open');
        });
    }
});