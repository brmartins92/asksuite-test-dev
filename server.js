require('dotenv').config();
const express = require('express');
const router = require('./routes/router.js');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/', router);

const options = {
    customCss: '.swagger-ui .topbar { display: none }'
  };
  
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

app.listen(port || 8080, () => {
    console.log(`Listening on port ${port}`);
});
