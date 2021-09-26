const Product = require('../models/Product');
const findQueries = {};
const sortQueries = {};

class Controllers {
  static async getProducts(req, res) {
    Queries.findByFreeShipping(req, res);
    Queries.findByCategory(req, res);
    Queries.findByProductTitle(req, res);

    const results = Product.find(findQueries);

    Queries.sortProducts(req, res, results);
    Queries.selectProductsFields(req, res, results);
    Queries.paginate(req, res, results);
    Queries.filterNumeric(req, res, results);
    const products = await results;

    return res.status(200).json({
      code: 200,
      nbHits: products.length,
      products,
    });
  }

  static async getProductById(req, res) {
    const { id } = req.params;
    const product = await Product.findById(id);
    return res.status(200).json({
      code: 200,
      product,
    });
  }
}

class Queries {
  static findByFreeShipping(req, res) {
    const { freeShipping } = req.query;
    if (freeShipping) {
      findQueries.freeShipping = freeShipping === 'true' ? true : false;
    }
  }

  static findByCategory(req, res) {
    const { category } = req.query;
    if (category) {
      findQueries.category = category;
    }
  }

  static findByProductTitle(req, res) {
    const { title } = req.query;
    if (title) {
      findQueries.title = { $regex: title, $options: 'i' };
    }
  }

  static sortProducts(req, res, products) {
    const { sort } = req.query;
    if (sort) {
      sortQueries.sort = sort.split(',').join(' ');
    }
    if (sortQueries.sort) {
      products = products.sort(sortQueries.sort);
    } else {
      products = products.sort('title');
    }
  }

  static selectProductsFields(req, res, products) {
    const { fields } = req.query;
    if (fields) {
      findQueries.fields = fields.split(',').join(' ');
      products = products.select(findQueries.fields);
    } else {
      products = products.select('title price freeShipping');
    }
  }

  static paginate(req, res, products) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    products = products.skip(skip).limit(limit);
  }

  static filterNumeric(req, res) {
    const { numericFilters } = req.query;
    const operators = {
      '>': '$gt',
      '<': '$lt',
      '>=': '$gte',
      '<=': '$lte',
      '=': '$eq',
    };
    if (numericFilters) {
      const regex = /\b(<|>|<=|>=|=)\b/g;
      let filters = numericFilters.replace(
        regex,
        (match) => `-${operators[match]}-`
      );
      const numericOptions = ['price', 'quantity', 'rate', 'count'];
      filters = filters.split(',').forEach((item) => {
        const [field, operator, value] = item.split('-');
        if (numericOptions.includes(field)) {
          findQueries[field] = { [operator]: Number(value) };
        }
      });
    }
  }
}

module.exports = Controllers;
