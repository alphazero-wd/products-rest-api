require('dotenv').config();
require('./database/db')();
const express = require('express');
const Middlewares = require('./middlewares/middlewares');
const app = express();

app.use(express.json());

app.get('/', (req, res) => res.send('Products API'));
app.use('/api/products', require('./routes/products'));
app.use(Middlewares.notFound);
app.use(Middlewares.errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
