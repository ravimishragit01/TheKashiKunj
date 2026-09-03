const router = require('express').Router();
const Room = require('../models/Room');

router.get('/', async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

router.get('/:id', async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json(room);
});

router.post('/', async (req, res) => {
  const room = await Room.create(req.body);
  res.status(201).json(room);
});

router.put('/:id', async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(room);
});

router.delete('/:id', async (req, res) => {
  await Room.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
