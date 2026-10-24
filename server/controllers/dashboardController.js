import Transaction from "../models/Transaction.js";

export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Calculate total income and expenses by transaction type.
    const totals = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    totals.forEach((entry) => {
      if (entry._id === "income") totalIncome = entry.total;
      if (entry._id === "expense") totalExpense = entry.total;
    });

    const netBalance = totalIncome - totalExpense;

    // Group expenses by category and sort them from highest to lowest spending.
    const categoryBreakdown = await Transaction.aggregate([
      { $match: { user: userId, type: "expense" } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const formattedBreakdown = categoryBreakdown.map((item) => ({
      category: item._id,
      total: item.total,
    }));

    res.status(200).json({
      success: true,
      summary: {
        totalIncome,
        totalExpense,
        netBalance,
        categoryBreakdown: formattedBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};
