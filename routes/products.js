const { getProducts, getProductById } = require('../controllers/products');
const { asyncWrapper } = require('../middlewares/middlewares');
const router = require('express').Router();

router.route('/').get(asyncWrapper(getProducts));

router.route('/:id').get(asyncWrapper(getProductById));

module.exports = router;
