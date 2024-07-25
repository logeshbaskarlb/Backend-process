const express = require("express");
const cors = require("cors");
const app = express();
const bcrypt = require("bcryptjs");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const URL = process.env.MONGO_URL;
const jsonwebtoken = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const dbConfig = require("./config/config");
const multer = require('multer');
const Property = require('./models/Property');

app.use(cors({
    origin:'*'
}))


app.use(express.json());

app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body; 
      const connection = await MongoClient.connect(URL);
      const db = connection.db("rentify");
      const user = await db.collection("Registered").findOne({ email });
  
      if (!user) {
        res.status(404).json({ message: "User or password not match!" });
        return;
      }
  
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        res.status(404).json({ message: "User or password not match!" });
        return;
      }
  
      const token = jsonwebtoken.sign(
        { userId: user._id },  
        secretKey,
        { expiresIn: "24h" }
      );
  
      res.status(200).json({
        userId: user._id,
        token,
      });
  
      connection.close();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  

  app.post("/register", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");
      try {       
        const { firstName,lastName,phone, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const connection = await MongoClient.connect(URL);
        const db = connection.db("rentify");
        const newUser ={
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
        };
  
        const result = await db.collection("Registered").insertOne(newUser);
        const token = jsonwebtoken.sign(
          {
            userId:  result.insertedId,
          },
          secretKey,
          { expiresIn: "24h" }
        );
        res.status(201).json({
          message: "Registration success",
          token,
        });
        connection.close();
      } catch (error) {
        console.log(error);
        res.status(500).json({
          message: "Server error",
        });
      } 
    });


    app.post('/seller-property', async (req, res) => {
        try {
          const { amount, landmark, bedrooms, description, sold } = req.body;
    
            // Create a new property instance
            const property = new Property({
              amount,
              landmark,
              bedrooms,
              description,
              sold
            });
    
            // Save the property to the database
            await property.save();
                
            res.status(201).json({ message: 'Property added successfully' });
        } catch (error) {
            console.error('Error adding property:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    app.get('/seller-profile', async (req, res) => {
        try {
          // Fetch all properties from the database
          const properties = await Property.find({});
      
          // Return the properties as JSON response
          res.status(200).json(properties);
        } catch (error) {
          console.error('Error fetching properties:', error);
          // If there's an error, send a 500 Internal Server Error response
          res.status(500).json({ message: 'Internal server error' });
        }
      });

      app.put('/seller-property/:id', async (req, res) => {
        try {
          const { id } = req.params;
          const { amount, landmark, bedrooms,  description, sold } = req.body;
      
          // Find the property by ID and update its details
          const updatedProperty = await Property.findByIdAndUpdate(id, {
            amount,
            landmark,
            bedrooms,
            description,
            sold
          }, { new: true });
      
          if (!updatedProperty) {
            return res.status(404).json({ message: 'Property not found' });
          }
      
          res.status(200).json({ message: 'Property updated successfully', property: updatedProperty });
        } catch (error) {
          console.error('Error updating property:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      });
      
      app.delete('/seller-profile/:id', async (req, res) => {
        const id = req.params.id;
      
        try {
          // Find the property by ID and delete it
          const deletedProperty = await Property.findByIdAndDelete(id);
      
          if (!deletedProperty) {
            return res.status(404).json({ message: 'Property not found' });
          }
      
          res.status(200).json({ message: 'Property deleted successfully' });
        } catch (error) {
          console.error('Error deleting property:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      });

const SMTP = process.env.SMTP;
app.listen(SMTP,()=>{
    console.log(`Server is running on ${process.env.SMTP}`);
})