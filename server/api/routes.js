const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const sessionContext = require('./handlers/sessionContext');
const login = require('./handlers/login');
const logout = require('./handlers/logout');
const registration = require('./handlers/registration');
const activation = require('./handlers/activation');
const updateProfile = require('./handlers/updateProfile');
const uploadAvatar = require('./handlers/uploadAvatar');

/*
const createOrder = require('./handlers/createOrder');
const getOrder = require('./handlers/getOrder');
const getTask = require('./handlers/getTask');
const getTasksByOrder = require('./handlers/getTasksByOrder');
const getUserOrders = require('./handlers/getUserOrders');
const getUserJobs = require('./handlers/getUserJobs');
const getMessagesByTask = require('./handlers/getMessagesByTask');
const waitMessagesByTask = require('./handlers/waitMessagesByTask');
const waitStatusChangeByTask = require('./handlers/waitStatusChangeByTask');
const sendMessage = require('./handlers/sendMessage');
const changeTaskStatus = require('./handlers/changeTaskStatus');
const getUserInfoById = require('./handlers/getUserInfoById');
*/

router.get('/session-context', jsonParser, sessionContext);
router.post('/login', jsonParser, login);
router.get('/logout', logout);
router.post('/registration', jsonParser, registration);
router.post('/activation', jsonParser, activation);
router.post('/update-profile', jsonParser, updateProfile);
router.post('/upload-avatar', jsonParser, uploadAvatar);

/*
router.post('/create-order', jsonParser, createOrder);
router.get('/user/:userId', getUserInfoById);
router.get('/user-orders', getUserOrders);
router.get('/user-jobs', getUserJobs);
router.get('/order/:orderId', getOrder);
router.get('/task/:taskId', getTask);
router.get('/tasks-by-order/:orderId', getTasksByOrder);
router.get('/messages-by-task/:taskId', getMessagesByTask);
router.get('/wait-messages-by-task/:taskId', waitMessagesByTask);
router.get('/wait-status-change-by-task/:taskId', waitStatusChangeByTask);
router.post('/send-message', jsonParser, sendMessage);
router.post('/change-task-status', jsonParser, changeTaskStatus);
*/

module.exports = router;
