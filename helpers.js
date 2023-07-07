const getUserByEmail = function (email, users) {
    // Retrieves a user object by their email from the users database
    for (const userId in users) {
        const user = users[userId];
        if (user.email === email) {
            return user;
        }
    }
    return undefined;
    // Return undefined if user email is not found
};

module.exports = { getUserByEmail };