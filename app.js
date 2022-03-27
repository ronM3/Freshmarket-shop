const express = require('express');
const server = express()
const cors = require('cors')
const path = require('path');
const usersController = require("./controllers/users-controller");
const productsController = require("./controllers/products-controller");
const categoriesController = require("./controllers/categories-controller")
const cartController = require("./controllers/carts-controller");
const ordersController = require("./controllers/orders-controller");
const filesController = require("./controllers/files-controller");
const errorHandler = require("./errors/error-handler");
const loginFilter = require("./middleware/login-filter");
const fileUpload = require("express-fileupload");
const port = process.env.PORT || 3001

server.use(fileUpload());
process.env.NODE_ENV = "production"
if(process.env.NODE_ENV === "production"){
    server.use(express.static(__dirname + "/dist"))
}
else{
    const corsOptions = {
        origin: ["http://127.0.0.1:8080","http://localhost:8080","http://127.0.0.1:4200","http://localhost:4200", 
    "https://freshmarketapp.herokuapp.com"],
        credentials: true
    }
    server.use(cors(corsOptions))
}
server.use(express.json());
server.use(express.static("files"));
server.use("/users", usersController);
server.use("/products", productsController);
server.use("/cart", cartController);
server.use("/categories", categoriesController);
server.use("/orders", ordersController);
server.use("/files", filesController);
server.get('*',(req, res) =>{
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
}) 

server.use(errorHandler);
server.use(loginFilter);

server.listen(port, () => console.log("listening on http://localhost:3001"));