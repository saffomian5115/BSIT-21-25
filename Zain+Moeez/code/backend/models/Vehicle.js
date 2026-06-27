const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['car', 'bike', 'truck'],
      required: [true, 'Category is required'],
    },
    images: [
      {
        type: String, // file path / URL
      },
    ],
    modelFile: {
      type: String, // .glb / .gltf file path (optional)
      default: null,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
