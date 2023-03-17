## Sales Reporting Documentation

The document is intended for creating/executing the project in a development environment using docker containers.

## Tools used
 - Nodejs
 - ExpressJS
	 - Readline
	 - Multer
	 - Stream

## Requirements
- Docker
- NodeJS

## Setup
With the Docker service running, create the Project Database instance:

    docker run --name mysql-container -d -v /var/lib/mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=docker -e MYSQL_DATABASE=docker -e MYSQL_USER=docker -e MYSQL_PASSWORD=docker mariadb:10.5.8

After , load the database:
    ```bash
    docker exec -i mysql-container mysql -udocker -pdocker docker < scriptdesafio.sql
    ```
Then go up to the apis container
    ```bash
    docker run -p 3000:3000 --link mysql-container -v $(pwd):/usr/app --name api-container api-image
    ```
Open the project at **localhost:3000**