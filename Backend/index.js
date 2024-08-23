
// Importing necessary modules
import express from "express";
import mongoose from "mongoose";
import cors from 'cors';

// Importing custom configurations
import { PORT, mongoDBURL } from './config.js';

// Importing routes
import UserAccount_Route from './Routes/UserAccount_Route.js';
import Employee_Route from './Routes/Employee_Route.js';
//import Inventory_Route from './Routes/Inventory_Route.js';

//import Booking_Route from './Routes/Booking_Route.js';
//import Package_Route from './Routes/Package_Route.js';
import Service_Route from './Routes/Service_Route.js';

import Manager_Route from './Routes/Manager_Route.js';
import EmployeeAttendence_Route from "./Routes/EmployeeAttendence_Route.js";
import { ReadOneHome_Route } from "./Routes/ReadOneHome_Route.js";
import EmployeeSalary_Route from './Routes/EmployeeSalary_Route.js';


// Creating an instance of the Express application
const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS POLICY
app.use(cors());

// Using routes for endpoints
app.use('/customer', UserAccount_Route);
app.use('/employees', Employee_Route);

//app.use('/inventory', Inventory_Route);

//app.use('/Package', Package_Route);
app.use('/Service', Service_Route);

app.use('/Manager', Manager_Route);
app.use('/EmployeeAttendence', EmployeeAttendence_Route);

app.use('/Home', ReadOneHome_Route);
app.use('/EmployeeSalary', EmployeeSalary_Route);


// Connecting to the MongoDB database
mongoose.connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });