const bcrypt = require('bcryptjs');

const HashPassword = {
    hashPassword: async (password) => {
        const salt = await bcrypt.genSalt(12);
        return await bcrypt.hash(password, salt)
    },

    matchPassword: async (plainTextPassword, hashedPassword) => {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
    }
}


module.exports = HashPassword;