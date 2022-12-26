const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'JiHwa API',
      version: '1.0.0',
      description: 'API description',
    },
    servers: [
      {
        url: 'http://localhost:8000',
      },
    ],
    basePath: '/',
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  specs,
};
