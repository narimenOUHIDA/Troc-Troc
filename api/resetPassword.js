import argon2 from "argon2";

const newPassword = "0000";

const hash = await argon2.hash(newPassword);

console.log(hash);

//narimen@oclock.com
//1234

//alice@example.com
//0000