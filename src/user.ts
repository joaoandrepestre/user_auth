import { Client, QueryResult } from 'pg';
import crypto from 'crypto';


// Define database connection
const client: Client = new Client({
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

    // repeat until generated key is unique
    while (exists > 0) {
        // generate a random key
        key = crypto.randomBytes(16).toString('base64');

        // check if key exists in the database
        const res: QueryResult = await client.query(`SELECT * FROM "user" WHERE sid='${key}';`);
        exists = res.rowCount;
    }

    return key;
};

// Check if the given session id is on the database
export const check_session_id = async (sid: String): Promise<Boolean> => {
    const res: QueryResult = await client.query(`SELECT sid FROM "user" WHERE sid='${sid}' LIMIT 1;`);
    if (res.rowCount > 0)
        return true;
    return false;
}

// Check if the given username is on the database
const user_exists = async (username: String): Promise<Boolean> => {
    const res: QueryResult = await client.query(`SELECT sid FROM "user" WHERE username='${username}' LIMIT 1;`);
    if (res.rowCount > 0)
        return true;
    return false;
};

// Create a new user with the given username and password, if no user with this username exists
export const create_user = async (username: String, password: String): Promise<Boolean> => {

    // check if the username already exists, returns false if it does
    if (await user_exists(username))
        return false;

    // inserts new user into database, if username not already in use
    const res: QueryResult = await client.query(`INSERT INTO "user" (username, password)
                                    VALUES ('${username}', crypt('${password}', gen_salt('bf')));`);
    if (res.rowCount > 0)
        return true;
    return false;
};

// Check if the given username and password match and generates a new session id
export const login = async (username: String, password: String): Promise<String> => {

    // checks if the username and password match
    const res: QueryResult = await client.query(`SELECT sid FROM "user" WHERE username='${username}' AND password=crypt('${password}', password) LIMIT 1;`);

    if (res.rowCount > 0){
        // if it does, generate new key 
        let sid: String = await generate_key();
        // set user's session id to the new generated key
        await client.query(`UPDATE "user" SET sid='${sid}' WHERE username='${username}';`);
        return sid;
    }

    return "";
};

// Invalidates the session id, if it exists
export const logout = async (sid: String): Promise<Boolean> => {
    // checks if the session id is valid in the database
    const session: Boolean = await check_session_id(sid);
    if (session){
        // if it is, invalidates it
        await client.query(`UPDATE "user" SET sid=NULL WHERE sid='${sid}';`);
        return true;
    }
    return false;
};