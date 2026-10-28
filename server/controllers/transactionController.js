import Transaction from "../models/Transaction.js";

export const createTransaction = async (req, res, next) => {
  try {
    const { type, category, amount, description, date, paymentMethod } =
      req.body;

    // Validate
    if (!type || !category || !amount || !paymentMethod) {
      res.status(400);
      throw new Error("Please provide type, category, amount and payment method");
    }

    if (!["income", "expense"].includes(type)) {
      res.status(400);
      throw new Error('Type must be either "income" or "expense"');
    }

    if (amount <= 0) {
      res.status(400);
      throw new Error("Amount must be greater than 0");
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      category,
      amount,
      description,
      date,
      paymentMethod,
    });

    res.status(201).json({ success: true, transaction });
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      transactions,
    });

  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findById(req.params.id);

    // Validate
    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found");
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to update this transaction");
    }

    const { type, category, amount, description, date, paymentMethod } = req.body;

    if (type && !["income", "expense"].includes(type)) {
      res.status(400);
      throw new Error('Type must be either "income" or "expense"');
    }

    if (amount !== undefined && amount <= 0) {
      res.status(400);
      throw new Error("Amount must be greater than 0");
    }

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { type, category, amount, description, date, paymentMethod },
      { new: true }
    );

    res.status(200).json({ success: true, transaction });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    // Validate
    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found");
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to delete this transaction");
    }

    await transaction.deleteOne();

    res.status(200).json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    next(error);
  }
};
