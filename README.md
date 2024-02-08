# NodeJS,Mongoose,Express Project in MVC Architecture

**Supported version of nodejs >= 12**,
**Supported version of mongoose >= 6**

## About 
- This is a Node application, developed using MVC pattern with Node.js, ExpressJS, and Mongoose. 
- MongoDB database is used for data storage, with object modeling provided by Mongoose.
- pov : All this are made with dhiwise website . 

## Initial
1. ```$ npm install```
2. ```$ npm start```

## How to run with Docker ? :
- if you have docker file you can execute following command
- build the image
	```$ docker build --pull --rm -f "Dockerfile" -t <imageName>:latest "." ```
- execute the command
	```$ docker run -p 3000:3000 <imageName> ```


## Folder structure:
```
  ├── app.js       - starting point of the application
  ├── config
  │   └── db.js    - contains api database connection
  ├── constants    - contains commonly used constants 
  ├── controllers               
  │   └── platform - contains business logic
  ├── models       - models of application
  ├── postman      - postman collection files
  ├── routes       - contains all the routes of application
  ├── services     - contains commonly used services
  ├── views        - templates
  └── utils        - contains utility functions    
```
## Backend Design:

