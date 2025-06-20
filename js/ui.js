let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, {passive: true});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, {passive: true});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        openSideMenu();
    }
}

function openSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    sideMenu.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
}

function closeSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    sideMenu.classList.remove('menu-open');
    document.body.style.overflow = 'auto';
}

function openProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    profileMenu.classList.add('profile-menu-open');
    document.body.style.overflow = 'hidden';
}

function closeProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    profileMenu.classList.remove('profile-menu-open');
    document.body.style.overflow = 'auto';
}

document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const closeMenuBtn = document.getElementById('closeMenu');
    const profileBtn = document.getElementById('profileBtn');
    const closeProfileMenuBtn = document.getElementById('closeProfileMenu');
    
    if (menuBtn) menuBtn.addEventListener('click', openSideMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeSideMenu);
    if (profileBtn) profileBtn.addEventListener('click', openProfileMenu);
    if (closeProfileMenuBtn) closeProfileMenuBtn.addEventListener('click', closeProfileMenu);
    
    const backBtn = document.getElementById('backBtn');
    if (backBtn) backBtn.addEventListener('click', () => {
        window.history.back();
    });
    
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('modal-open');
            });
        }
    });
    
    const friendsCard = document.getElementById('friendsCard');
    if (friendsCard) {
        friendsCard.addEventListener('click', () => {
            window.location.href = 'friend-list.html';
        });
    }
    
    const groupsCard = document.getElementById('groupsCard');
    if (groupsCard) {
        groupsCard.addEventListener('click', () => {
            const sideMenu = document.getElementById('sideMenu');
            if (sideMenu) {
                openSideMenu();
                document.getElementById('groupsMenuItem').click();
            }
        });
    }
    
    const inviteCard = document.getElementById('inviteCard');
    if (inviteCard) {
        inviteCard.addEventListener('click', () => {
            const inviteModal = document.getElementById('inviteModal');
            if (inviteModal) {
                inviteModal.classList.add('modal-open');
            }
        });
    }
    
    const addFriendBtn = document.getElementById('addFriendBtn');
    if (addFriendBtn) {
        addFriendBtn.addEventListener('click', () => {
            const addFriendModal = document.getElementById('addFriendModal');
            if (addFriendModal) {
                addFriendModal.classList.add('modal-open');
            }
        });
    }
    
    const createGroupBtn = document.getElementById('createGroupBtn');
    if (createGroupBtn) {
        createGroupBtn.addEventListener('click', () => {
            const createGroupModal = document.getElementById('createGroupModal');
            if (createGroupModal) {
                createGroupModal.classList.add('modal-open');
            }
        });
    }
    
    const copyInviteBtn = document.getElementById('copyInviteBtn');
    if (copyInviteBtn) {
        copyInviteBtn.addEventListener('click', () => {
            const inviteCode = document.getElementById('userInviteCode').textContent;
            navigator.clipboard.writeText(inviteCode).then(() => {
                showToast('Invite code copied!');
            });
        });
    }
    
    const tabContainers = document.querySelectorAll('.tab-container');
    tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('.tab-btn');
        const tabContents = container.parentElement.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const tabId = tab.getAttribute('data-tab');
                const content = container.parentElement.querySelector(`#${tabId}Tab`);
                if (content) content.classList.add('active');
            });
        });
    });
    
    const banDurationSelect = document.getElementById('banDuration');
    if (banDurationSelect) {
        banDurationSelect.addEventListener('change', (e) => {
            const customDateGroup = document.getElementById('customDateGroup');
            customDateGroup.style.display = e.target.value === 'custom' ? 'block' : 'none';
        });
    }
});

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