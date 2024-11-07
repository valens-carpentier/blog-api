const authController = require('./authController');
const authorController = require('./authorController');
const visitorController = require('./visitorController');

module.exports = {
    ...authController,
    ...authorController,
    ...visitorController
};
