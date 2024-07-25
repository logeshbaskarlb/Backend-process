const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  amount: {
    type: String,
  },
  landmark: {
    type: String,
  },
  bedrooms: {
    type: String,
  },
  description : {
    type: String,
  },
  sold : {
    type : String
  }
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
