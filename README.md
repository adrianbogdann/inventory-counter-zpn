# Inventory Manager - Zupan Challenge
( implemented by Adi Nistor )


## Steps for setup:
 - Create .env file in the root of the project (see .env.sample for example)
 - Run:
```sh 
        docker-compose up -d 
``` 
(this will create a container containg the db, cache & server. The exposed ports for each one will be defined in the .env file: *MYSQLDB_LOCAL_PORT, NODE_LOCAL_PORT, REDIS_LOCAL_PORT*)
 - If you update something: 
```sh
        sudo docker-compose build
        docker-compose up -d 
```

 - To view the DB, download a mySql client and setup a new connection to the DB using the variables defined in the .env file:
```sh 
            MYSQLDB_HOST=<<db_host>>
            MYSQLDB_USER=<<db_user>>
            MYSQLDB_ROOT_PASSWORD=<<db_pass>>
            MYSQLDB_DATABASE=<<db_name>>
            MYSQLDB_LOCAL_PORT=<<db_port>
```
 -  To test the API calls, import the file called **InventoryManagement.postman_collection** into Postman
 -- An example for testing the endpoints would be:
     1. Add product (`/product/add-product`)
    2. Add subproducts (`/subproduct/add-subproduct`)
    3. Add Barcodes (`/barcode/add-barcode/4`)
    4. Assign subproducts to product (`/product/assign-subproducts/4`)
    5. Build count plan (`/count-plan/build-countplan`)
    6. Start count execution (`count-plan/start-countplan/1`)
    7. Add user product count (`http://localhost:6868/product-count/add-productcount`)
    8. Extract prices (`/count-execution/extract-prices/1`)
---


#### NOTES: 
##### Honest and honorable mentions. Didn't Do / Improvements: 
1. Created migrations + seeders (
        Reasons: 
            a) I didn't start the DB creation process with sequelize-cli and when I figured I should use migrations + seeders it was already too late) 
            b) I tried adding seeders manually but it turned out to be a pain in the ass to get it to work with Docker and I didn't want to spend any extra time on it because I considered it to be out of the scope of the challange)

2. Implmented the challenge in **TS** (reasons: since I had limited time to work on this, I cut some corners to save some time & write less code and implmented it in JS, although I added validations on routes and added comments where I felt was necessary.
3. Write a YAML file for the API interface describing all the endpoints, however I attached a file that you can import in postman to test the API calls.
4. Implemented an auth system, but emulated that with the `userId` field which is required in the body of every API call
