const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');

router.get('/export', financeController.exportCSV);
router.get('/projection', financeController.getProjection);
router.get('/', financeController.getAll);
router.post('/', financeController.create);
router.put('/:id', financeController.update);
router.delete('/:id', financeController.delete);

module.exports = router;
