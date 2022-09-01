const express = require('express');
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}))

//Routes
app.use(require("./app/routes/index"))

//Libraires


//Engine configuration

app.listen(3000, () => {
    console.log('Server is running');
})