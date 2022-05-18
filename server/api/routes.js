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
const createJect = require('./handlers/createJect');
const getJect = require('./handlers/getJect');
const getUserJects = require('./handlers/getUserJects');

/*
const getTask = require('./handlers/getTask');
const getTasksByJect = require('./handlers/getTasksByJect');
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
router.post('/create-ject', jsonParser, createJect);
router.get('/ject/:jectId', getJect);
router.get('/user-jects', getUserJects);

/*
router.get('/user/:userId', getUserInfoById);
router.get('/user-jobs', getUserJobs);
router.get('/task/:taskId', getTask);
router.get('/tasks-by-ject/:jectId', getTasksByJect);
router.get('/messages-by-task/:taskId', getMessagesByTask);
router.get('/wait-messages-by-task/:taskId', waitMessagesByTask);
router.get('/wait-status-change-by-task/:taskId', waitStatusChangeByTask);
router.post('/send-message', jsonParser, sendMessage);
router.post('/change-task-status', jsonParser, changeTaskStatus);
*/

module.exports = router;
