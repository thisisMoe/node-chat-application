const users = [];

// addUser, removeUser, getUser, getUserInRoom

const addUser = ({ id, username, room }) => {
    //Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //Validate the data
    if (!username || !room) {
        return {
            error: 'Username and Room are required.',
        };
    }

    //Check for existing username
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });

    //Validate username
    if (existingUser) {
        return {
            error: 'Username is in use',
        };
    }

    //Store username
    const user = { id, username, room };
    users.push(user);
    return { user };
};

//REmoving a user by it's id
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getUser = (id) => {
    //accept id
    //return user object or unefined
    return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
    //accept room
    //return array of users or empty array
    return users.filter((user) => user.room === room);
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
};
