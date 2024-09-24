// scripts.js
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        if (response.ok) {
            window.location.href = "home.html";
            //alert(result.message);
            // Handle successful login (e.g., redirect or store token)
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error logging in');
    }
});

document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        if (response.ok) {
            //alert(result.message);
            // Handle successful registration (e.g., redirect to login)
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error registering user');
    }
});
function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('formTitle').textContent = 'Register';
}

function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('formTitle').textContent = 'Login';
}


///////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

// Placeholder functions for search and create
function searchChatrooms() {
    const searchInput = document.getElementById('searchInput').value;
    console.log('Searching for chatrooms:', searchInput);
    // Call the search API and update the chatroomsList
}

function createChatroom() {
    const createInput = document.getElementById('createInput').value;
    console.log('Creating chatroom:', createInput);
    // Call the create API and update the chatroomsList
}

// Example function to add chatrooms to the list (you would call this with actual data)
function displayJoinedChatrooms(chatrooms) {
    const chatroomsList = document.getElementById('chatroomsList');
    chatroomsList.innerHTML = ''; // Clear existing chatrooms

    chatrooms.forEach(chatroom => {
        const chatroomDiv = document.createElement('div');
        chatroomDiv.className = 'chatroom';

        // Chatroom information
        const chatroomInfo = document.createElement('div');
        chatroomInfo.className = 'chatroom-info';

        const chatroomName = document.createElement('p');
        chatroomName.className = 'chatroom-name';
        chatroomName.textContent = chatroom.name;

        const chatroomCreator = document.createElement('p');
        chatroomCreator.className = 'chatroom-creator';
        chatroomCreator.textContent = `Creator: ${chatroom.creator}`;

        chatroomInfo.appendChild(chatroomName);
        chatroomInfo.appendChild(chatroomCreator);

        // Chatroom members count
        const chatroomMembers = document.createElement('p');
        chatroomMembers.className = 'chatroom-members';
        chatroomMembers.textContent = `${chatroom.members.length} Members`;

        // Append to chatroom div
        chatroomDiv.appendChild(chatroomInfo);
        chatroomDiv.appendChild(chatroomMembers);

        // Append to the chatrooms list
        chatroomsList.appendChild(chatroomDiv);
    });
}

// Example data for testing
const exampleChatrooms = [
    {
        name: 'Chatroom 1',
        creator: 'User 1',
        members: [{ username: 'User 1' }, { username: 'User 2' }]
    },
    {
        name: 'Chatroom 2',
        creator: 'User 2',
        members: [{ username: 'User 2' }]
    }
];

// Call this function to display the example data on load
displayJoinedChatrooms(exampleChatrooms);
