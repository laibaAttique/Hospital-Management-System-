const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function runMigration() {
    try {
        console.log('Reading migration file...');
        const migrationPath = path.join(__dirname, '../database/migrate_patient_dashboard.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        // Split SQL into individual statements
        // This is a simple split by semicolon, might need more robustness for complex SQL
        // but sufficient for this migration script
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`Found ${statements.length} SQL statements to execute.`);

        for (const statement of statements) {
            if (statement.toUpperCase().startsWith('USE')) {
                console.log('Skipping USE statement (using connection config)');
                continue;
            }

            console.log('Executing:', statement.substring(0, 50) + '...');
            try {
                await db.query(statement);
            } catch (err) {
                // Ignore "Duplicate column name" errors which mean migration already ran
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log('  -> Column already exists, skipping.');
                } else if (err.code === 'ER_DUP_KEYNAME') {
                    console.log('  -> Index/Key already exists, skipping.');
                } else {
                    throw err;
                }
            }
        }

        console.log('✅ Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
