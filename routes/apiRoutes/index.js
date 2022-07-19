const router = require('express').Router();
const todoRoutes = require('./todoRoutes');

/* '/api/routes' forward all routes to todoRoutes. */

router.use('/todos', todoRoutes);

module.exports = router;