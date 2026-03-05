require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const users = require('../models/userModel');

const resetUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB for reset...");

        const allUsers = await users.find({});
        console.log(`Found ${allUsers.length} users to reset.`);

        if (allUsers.length === 0) {
            console.log("No users found to reset.");
            process.exit(0);
        }

        const commonPassword = "306056";
        const hashedPassword = await bcrypt.hash(commonPassword, 10);

        const userDataToRestore = allUsers.map(user => ({
            username: user.username,
            email: user.email,
            password: hashedPassword,
            role: user.role,
            picture: user.picture,
            address: user.address,
            status: user.status
        }));

        await users.deleteMany({});
        console.log("Cleared all existing users.");

        await users.insertMany(userDataToRestore);
        console.log(`Successfully re-created ${userDataToRestore.length} users with updated timestamps and common password.`);

        process.exit(0);
    } catch (err) {
        console.error("Error during reset:", err);
        process.exit(1);
    }
};

resetUsers();
