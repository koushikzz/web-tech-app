const Budget = require('../models/Budget');

exports.getBudgets = async (req, res, next) => {
    try {
        const budgets = await Budget.find();
        res.json(budgets);
    } catch (err) {
        next(err);
    }
};

exports.setBudget = async (req, res, next) => {
    try {
        const { category, limit } = req.body;
        const budget = await Budget.findOneAndUpdate(
            { category },
            { limit },
            { new: true, upsert: true, runValidators: true }
        );
        res.json(budget);
    } catch (err) {
        next(err);
    }
};
