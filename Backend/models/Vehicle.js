const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  model: {
    type: String,
    required: [true, 'Car model is required'],
    minlength: [3, 'Car model must be at least 3 letters long']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(v) {
        return /^\d{11}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    validate: {
      validator: function(v) {
        return /^[A-Za-z\s]+$/.test(v);
      },
      message: props => `${props.value} is not a valid city name! Only alphabetic characters are allowed.`
    }
  },
pictures: [{
  data: Buffer,
  contentType: String
}]
});

VehicleSchema.path('pictures').validate(function (pictures) {
return pictures.length >= 1 && pictures.length <= 10;
}, 'The number of pictures must be between 1 and 10.');

module.exports = mongoose.model('Vehicle', VehicleSchema);
