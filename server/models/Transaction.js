import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: {
      type: String,
    },
    date: {
      type: String,
      required: true
    },
    paymentMethod: {
      type: String,
      required: true
    }
  });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;