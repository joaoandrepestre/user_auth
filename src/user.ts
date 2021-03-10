import { Client, QueryResult } from 'pg';
import crypto from 'crypto';


// Define database connection
const client = new Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'user_auth'
});
client.connect();

// Generate unique random key to use as session id
const generate_key = async (): Promise<String> => {
    
    let key: String = "";

    let exists: Number = 1;
    while (exists > 0) {
        key = crypto.randomBytes(16).toString('base64');
        const res: QueryResult = await client.query(`SELECT * FROM "user" WHERE sid='${key}';`);
        exists = res.rowCount;
    }

    return key;
};

// Check if the given session id is on the database
const check_session_id = async (sid: String): Promise<Boolean> => {
    const res = await client.query(`SELECT sid FROM "user" WHERE sid='${sid}' LIMIT 1;`);
    if (res.rowCount > 0)
        return true;
    return false;
}

// Check if the given username is on the database
const user_exists = async (username: String): Promise<Boolean> => {
    const res = await client.query(`SELECT sid FROM "user" WHERE username='${username}' LIMIT 1;`);
    if (res.rowCount > 0)
        return true;
    return false;
};

// Create a new user with the given username and password, if no user with this username exists
export const create_user = async (username: String, password: String): Promise<Boolean> => {
    if (await user_exists(username))
        return false;

    const res = await client.query(`INSERT INTO "user" (username, password)
                                    VALUES ('${username}', crypt('${password}', gen_salt('bf')));`);
    if (res.rowCount > 0)
        return true;
    return false;
};

// Check if the given username and password match and generates a new session id
export const login = async (username: String, password: String): Promise<String> => {
    const res = await client.query(`SELECT sid FROM "user" WHERE username='${username}' AND password=crypt('${password}', password) LIMIT 1;`);

    if (res.rowCount > 0){
        let sid: String = await generate_key();
        await client.query(`UPDATE "user" SET sid='${sid}' WHERE username='${username}';`);
        return sid;
    }

    return "";
};

// Invalidates the session id, if it exists
export const logout = async (sid: String): Promise<Boolean> => {
    const session: Boolean = await check_session_id(sid);
    if (session){
        await client.query(`UPDATE "user" SET sid=NULL WHERE sid='${sid}';`);
        return true;
    }
    return false;
};