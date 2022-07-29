const { AdminUser } = require('../models/AdminUser');
const { encryptPassword } = require('../utils/auth');

const seed = async () => {
    const users = await AdminUser.find({}).lean();
    if (users.length === 0) {
        await AdminUser.create({
            email: 'admin@admin.com',
            password: await encryptPassword('abc123'),
            name: 'Admin User',
        });
    }
};

module.exports = seed;
