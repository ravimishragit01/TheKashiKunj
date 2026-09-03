const router = require('express').Router();
const Cab = require('../models/Cab');

router.get('/', async (req, res) => {
  const cabs = await Cab.find();
  res.json(cabs);
});

router.post('/', async (req, res) => {
  const cab = await Cab.create(req.body);
  res.status(201).json(cab);
});

router.put('/:id', async (req, res) => {
  const cab = await Cab.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(cab);
});

router.delete('/:id', async (req, res) => {
  await Cab.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
