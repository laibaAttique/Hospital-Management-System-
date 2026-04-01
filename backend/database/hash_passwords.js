const bcrypt = require('bcrypt');

// Script to generate bcrypt hashes for passwords
async function generateHashes() {
    const passwords = {
        admin: 'admin123',
        user: 'user123'
    };

    console.log('Generating password hashes...\n');

    for (const [username, password] of Object.entries(passwords)) {
        const hash = await bcrypt.hash(password, 10);
        console.log(`${username}:`);
        console.log(`  Password: ${password}`);
        console.log(`  Hash: ${hash}\n`);
    }

    console.log('Copy these hashes into seed.sql to replace the placeholder hashes.');
}

generateHashes();
