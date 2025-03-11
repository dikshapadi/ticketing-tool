const bcrypt = require("bcryptjs");

const plainPassword = "password"; // Use the actual password entered
const hashedPassword = "$2b$10$bMU6m0cMeWY8vACyh4wtguP25K8qcOVft7XYHHCAwIKo2yc8TawRa"; // From DB

bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
    if (err) console.error("Error comparing:", err);
    console.log("Password Match:", result);
});
