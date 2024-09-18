const URL = 'http://localhost:8080/admin';

document.addEventListener('DOMContentLoaded', function () {
    loadUsers();
});


async function loadUsers() {
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const users = await response.json();
        const userTableBody = document.getElementById('userTableBody');
        userTableBody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.age}</td>
                <td>${user.roles.map(role => role.name).join(', ')}</td>
                <td><button class="btn btn__edit" onclick="editUser(${user.id})">Edit</button></td>
                <td><button class="btn btn-danger" onclick="showDeleteModal(${user.id})">Delete</button></td>
            `;
            userTableBody.appendChild(row);

        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

async function loadRoles() {
    try {
        const rolesResponse = await fetch(`${URL}/roles`);
        if (!rolesResponse.ok) {
            throw new Error('Error fetching roles');
        }
        return await rolesResponse.json();
    } catch (error) {
        console.error('Error loading roles:', error);
        return [];
    }
}

async function editUser(userId) {
    try {
        const response = await fetch(`${URL}/${userId}`);
        if (!response.ok) {
            throw new Error('Error fetching user data');
        }
        const user = await response.json();

        document.getElementById('editID').value = user.id;
        document.getElementById('editName').value = user.username;
        document.getElementById('editAge').value = user.age;

        const allRoles = await loadRoles();

        const rolesSelect = document.getElementById('editRoles');
        rolesSelect.innerHTML = '';

        allRoles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id; // ID роли
            option.textContent = role.name; // Имя роли
            option.selected = user.roles && user.roles.some(userRole => userRole.id === role.id);
            rolesSelect.appendChild(option);
        });

        const editModal = new bootstrap.Modal(document.getElementById('editModal'));
        editModal.show();
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

document.getElementById('editUserForm').addEventListener('submit', async (event) => {
    console.log('Form submitted');
    event.preventDefault();

    const userId = document.getElementById('editID').value;
    const userData = {
        id: userId,
        username: document.getElementById('editName').value,
        age: parseInt(document.getElementById('editAge').value),
        password: document.getElementById('editPassword').value,
        roles: Array.from(document.getElementById('editRoles').selectedOptions).map(option => ({
            id: option.value,
            name: option.textContent
        }))
    };

    try {
        const response = await fetch(`${URL}/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        let responseText = await response.text();
        console.log('Response Text:', responseText);

        if (!response.ok) {
            const errorData = JSON.parse(responseText);
            throw new Error('Failed to update user: ' + (errorData.message || 'Unknown error'));
        }

        const updatedUser = JSON.parse(responseText);
        console.log('User updated successfully:', updatedUser);
        await loadUsers();
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        if (editModal) {
            editModal.hide();
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
});


async function showDeleteModal(userId) {
    try {
        const response = await fetch(`${URL}/${userId}`);
        if (!response.ok) {
            throw new Error('Error fetching user data');
        }
        const user = await response.json();

        document.getElementById('deleteID').value = user.id;
        document.getElementById('deleteName').value = user.username;
        document.getElementById('deleteAge').value = user.age;
        const rolesContainer = document.getElementById('deleteRoles');
        rolesContainer.innerHTML = '';
        user.roles.forEach(role => {
            const option = document.createElement('option');
            option.textContent = role.name;
            rolesContainer.appendChild(option);
        });


        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        deleteModal.show();

        document.getElementById('deleteChanges').onclick = async (event) => {
            event.preventDefault();
            await deleteUser(userId);
            deleteModal.hide();
        };
    } catch (error) {
        console.error('Error fetching user for deletion:', error);
    }
}

async function deleteUser(userId) {
    try {
        const response = await fetch(`${URL}/${userId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            await loadUsers();
        } else {
            throw new Error('Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

async function addUser() {

    const userData = {
        username: document.getElementById('inputName').value,
        age: parseInt(document.getElementById('inputAge').value),
        password: document.getElementById('inputPassword').value,
        roles: Array.from(document.getElementById('inputRoles').selectedOptions).map(option => ({
            id: option.value,
            name: option.textContent
        }))
    };

    try {

        const response = await fetch(`${URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        let responseText = await response.text();
        console.log('Response Text:', responseText);

        if (!response.ok) {
            const errorData = JSON.parse(responseText);
            throw new Error('Failed to add user: ' + (errorData.message || 'Unknown error'));
        }

        const newUser = JSON.parse(responseText);
        console.log('User added successfully:', newUser);
        await loadUsers();
        const allUsersTab = new bootstrap.Tab(document.getElementById('nav-home-tab'));
        allUsersTab.show();
    } catch (error) {
        console.error('Error adding user:', error);
    }
}

async function initializeRoles() {
    const roles = await loadRoles();
    const rolesSelect = document.getElementById('inputRoles');
    rolesSelect.innerHTML = '';

    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.id;
        option.textContent = role.name;
        rolesSelect.appendChild(option);
    });
}


document.getElementById('addUserForm').addEventListener('submit', async (event) => {
    console.log('Add user form submitted');
    event.preventDefault();
    await addUser();
});
document.addEventListener('DOMContentLoaded', initializeRoles);


