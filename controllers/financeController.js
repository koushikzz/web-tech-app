const Finance = require('../models/Finance');
const { Parser } = require('json2csv');

exports.getAll = async (req, res, next) => {
    try {
        const data = await Finance.find().sort({ billingDate: -1 });
        res.json(data);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const newItem = new Finance(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const updatedItem = await Finance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(updatedItem);
    } catch (err) {
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        await Finance.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        next(err);
    }
};

exports.getProjection = async (req, res, next) => {
    try {
        const allData = await Finance.find();
        
        const subscriptions = allData.filter(item => item.type === 'Subscription');
        const monthlySubsCost = subscriptions.reduce((acc, curr) => acc + curr.amount, 0);
        const sixMonthSubs = monthlySubsCost * 6;

        const expenses = allData.filter(item => item.type === 'Expense');
        
        const monthlyBuckets = {};
        expenses.forEach(exp => {
            const date = new Date(exp.billingDate);
            const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            monthlyBuckets[key] = (monthlyBuckets[key] || 0) + exp.amount;
        });

        const sortedMonths = Object.keys(monthlyBuckets).sort();
        const last3Months = sortedMonths.slice(-3);
        
        let projectedMonthlyExpense = 0;
        
        if (last3Months.length > 0) {
            let weightedSum = 0;
            let weightTotal = 0;
            last3Months.forEach((key, index) => {
                const weight = index + 1;
                weightedSum += monthlyBuckets[key] * weight;
                weightTotal += weight;
            });
            projectedMonthlyExpense = weightedSum / weightTotal;
        }

        const sixMonthExpenses = projectedMonthlyExpense * 6;
        const totalProjection = sixMonthSubs + sixMonthExpenses;

        res.json({ 
            sixMonthSubs, 
            sixMonthExpenses, 
            totalProjection,
            monthlyAverage: totalProjection / 6
        });

    } catch (err) {
        next(err);
    }
};

exports.exportCSV = async (req, res, next) => {
    try {
        const data = await Finance.find().sort({ billingDate: -1 }).lean();
        
        if (data.length === 0) {
            return res.status(404).json({ message: 'No data to export' });
        }

        const fields = ['type', 'title', 'amount', 'category', 'billingDate'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(data);

        res.header('Content-Type', 'text/csv');
        res.attachment('finance_report.csv');
        res.send(csv);
    } catch (err) {
        next(err);
    }
};
