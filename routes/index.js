const router = require('express').Router();
const apiRoutes = require('./apiRoutes');

/* All '/' should be using this route. */

router.use('/api', apiRoutes);

module.exports = router;