const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', 
    required: true
  }],
  totalAmount: {
    type: Number, 
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery', 'other'] // adjust as needed
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  invoiceUrl: {
    type: String
  },
  orderedAt: {
    type: Date,
    default: Date.now
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  deliveryDate: {
    type: Date
  },
  couponCode: {
    type: String
  },
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer'
  }
}, {
  timestamps: true 
});


orderSchema.index({ userId: 1, orderedAt: -1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ orderStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);