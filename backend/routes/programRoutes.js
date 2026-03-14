const express = require('express');
const router = express.Router();
const { createProgram, getPrograms, getProgram, updateProgram, deleteProgram } = require('../controllers/programController');
const { protect, adminOnly } = require('../middleware/auth');

// Public - get active programs (optionally authenticated to see all)
router.get('/', (req, res, next) => {
  // Try to authenticate but don't fail if not authenticated
  const authHeader = req.headers.authorization;
  if (authHeader) {
    return protect(req, res, next);
  }
  req.user = null;
  next();
}, getPrograms);

router.get('/:id', getProgram);
router.post('/', protect, adminOnly, createProgram);
router.put('/:id', protect, adminOnly, updateProgram);
router.delete('/:id', protect, adminOnly, deleteProgram);

module.exports = router;
