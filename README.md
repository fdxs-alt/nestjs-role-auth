### Nestjs role user auth

Features:

1. Login with passing username and password. Username - unique, password - hashed.
2. CRUD for User Entity.
3. JWT Bearer Token Auth.
4. Role based auth - login - public route, me - only for logged users, and other routes for admin role.
5. Swagger OpenAPI
6. Docker and docker-compose

How to run:
```
git clone https://github.com/fdxs-alt/nestjs-role-auth.git
cd nestjs-role-auth
yarn install
yarn run start:dev
or docker-compose up -d 
```  
then go to http://localhost:3000/api to preview the routes 
