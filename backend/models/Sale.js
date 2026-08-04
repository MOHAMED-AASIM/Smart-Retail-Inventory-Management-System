const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  unitPrice: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required']
  },
  saleDate: {
    type: Date,
    default: Date.now
  },
  recordedBy: {
    type: String,
    default: 'Employee'
  },
  recordedById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Sale', saleSchema);
