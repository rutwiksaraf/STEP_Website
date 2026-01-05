const bcrypt = require("bcrypt");

async function hashPassword() {
    const hashedPassword = await bcrypt.hash("ufifasabe27", 10);
    console.log("Hashed Password:", hashedPassword);
}

hashPassword();
