# User Authentication API

Il s'agit d'une API REST d'authentification utilisateur, exploitant certains points de route clefs.

## Dépendances

* PostgreSQL 12.6
* npm 6.14.11

## Installation

1. Cloner ce repositoire sur votre machine
    ```sh
    git clone https://github.com/joaoandrepestre/user_auth.git
    ```
2. Créer la base des données
    ```sh
    psql -f db_migrations/user_auth_db.sql
    ```
3. Installer les packages NPM
    ```sh
    npm install
    ```
4. Changer les identifiants et la porte postgreSQL dans src/user, si besoin

## Exécution

1. Executer l'API
    ```sh
    npm start
    ```
2. [Facultatif] Ouvrir front/index.html dans un navigateur WEB pour tester l'API.

## Comment utiliser l'API

L'API s'execute sur la porte 3000 et exploite certains points de route clefs:

* /user/create 
    * Méthode: POST
    * Paramètres dans le corps:
        * username: Le nom d'utilisateur à créer;
        * password: Le mot de passe souhaité;
    * Example:
        * POST localhost:3000/user/create
        * body: { username: toto, password: titi }
    * Réponse: Un objet JSON
        * En cas de succès: { status: 'ok', username: le nom d'utilisateur créé }
        * En cas d'erreur: { status: 'err', msg: une message d'erreur }

* /user/login
    * Méthode: POST
    * Paramètres dans le corps:
        * username: Le nom d'utilisateur à acceder;
        * password: Le mot de passe;
    * Example:
        * POST localhost:3000/user/login
        * body: { username: toto, password: titi }
    * Réponse: Un objet JSON
        * En cas de succès: { status: 'ok', username: le nom d'utilisateur accedé, sid: l'ID de session generé}
        * En cas d'erreur: { status: 'err', msg: une message d'erreur }
* /user/logout
    * Méthode: POST
    * Paramètres dans le corps:
        * sid: L'ID de session du dernier login
    * Example:
        * POST localhost:3000/user/logout
        * body: { sid: dkndiiu97iun }
    * Réponse: Un objet JSON
        * En cas de succès: { status: 'ok' }
        * En cas d'erreur: { status: 'err', msg: une message d'erreur }
* /user/session
    * Méthode: POST
    * Paramètres dans le corps:
        * sid: L'ID de session du dernier login
    * Example:
        * POST localhost:3000/user/session
        * body: { sid: dkndiiu97iun }
    * Réponse: Un objet JSON
        * En cas de succès: { status: 'ok', sid: l'ID de session du dernier login }
        * En cas d'erreur: { status: 'err', msg: une message d'erreur }
