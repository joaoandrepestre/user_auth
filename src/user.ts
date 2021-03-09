import { Client } from 'pg';

const client = new Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'user_auth'
});

client.connect();

const user_exists = async (username: String): Promise<Boolean> => {
    const res = await client.query(`SELECT sid FROM "user" WHERE username='${username}' LIMIT 1;`);
    if (res.rowCount > 0)
        return true;
    return false;
};

export const create_user = async (username: String, password: String): Promise<Boolean> => {
    if (await user_exists(username))
        return false;
    const res = await client.query(`INSERT INTO "user" (username, password)
                                    VALUES ('${username}', crypt('${password}', gen_salt('bf')));`);
    if (res.rowCount > 0)
        return true;
    return false;
};

export const login = async (username: String, password: String): Promise<Boolean> => {
    const res = await client.query(`SELECT sid FROM "user" WHERE username='${username}' AND password=crypt('${password}', password) LIMIT 1;`);
    
    if (res.rowCount > 0)
        return true;
    return false;
};

export const logout = (): Boolean => {
    return true;
};