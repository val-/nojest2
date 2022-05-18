export const backendService = {
    liveUpdateSessionContext,
    getSessionContext,
    login,
    logout,
    registration,
    activation,
    createJect,
    sendMessage,
    getLettersByTask,
    waitLettersByTask,
    waitStatusChangeByTask,
    getJect,
    getTask,
    getUserJectsList,
    getUserJobsList,
    updateProfile,
    uploadAvatar,
    getUserInfo,
    changeTaskStatus,
};

let sessionContextState;
let liveUpdateSessionContextListener = () => {};

function liveUpdateSessionContext(cb) {
    liveUpdateSessionContextListener = cb;
    if (!sessionContextState) {
        updateSessionContext();
    }
}

function updateSessionContext() {
    return fetchJSON('/api/session-context').then(resp => {
        sessionContextState = resp;
        liveUpdateSessionContextListener(resp);
    }, () => {
        liveUpdateSessionContextListener(false);
    })
}

function getSessionContext() {
    return sessionContextState;
}

function login(params) {
    return fetchJSON('/api/login', 'POST', params);
}

function logout() {
    return fetchJSON('/api/logout');
}

function registration(params) {
    return fetchJSON('/api/registration', 'POST', params);
}

function activation(token) {
    return fetchJSON('/api/activation', 'POST', { token });
}

function createJect(params) {
    return fetchJSON('/api/create-ject', 'POST', params)
}

function sendMessage(params) {
    return fetchJSON('/api/send-message', 'POST', params)
}

function changeTaskStatus(params) {
    return fetchJSON('/api/change-task-status', 'POST', params)
}

function getLettersByTask(taskId) {
    return fetchJSON(`/api/messages-by-task/${taskId}`)
}

function waitLettersByTask(taskId) {
    return fetchJSON(`/api/wait-messages-by-task/${taskId}`)
}

function waitStatusChangeByTask(taskId) {
    return fetchJSON(`/api/wait-status-change-by-task/${taskId}`)
}

function getJect(jectId) {
    return fetchJSON(`/api/ject/${jectId}`)
}

function getTask(taskId) {
    return fetchJSON(`/api/task/${taskId}`)
}

function getUserInfo(userId) {
    return fetchJSON(`/api/user/${userId}`)
}

function getUserJectsList() {
    return fetchJSON('/api/user-jects')
}

function getUserJobsList() {
    return fetchJSON('/api/user-jobs')
}

function updateProfile(params) {
    return new Promise((resolve, reject) => {
        fetchJSON('/api/update-profile', 'POST', params).then(
            resp => {
                updateSessionContext().then(() => {
                    resolve(resp);
                }, reject);
            },
            reject
        );
    });
}

function uploadAvatar(params) {
    return new Promise((resolve, reject) => {
        fetchJSON('/api/upload-avatar', 'POST', params).then(
            resp => {
                updateSessionContext().then(() => {
                    resolve(resp);
                }, reject);
            },
            reject
        );
    });
}

function fetchJSON(url, method = 'GET', params = {}) {
    const options = { method };
    if (method === 'POST') {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(params);
    }
    return new Promise((resolve, reject) => {
        fetch(url, options).then(resp => resp.json()).then(
            resp => {
                if (resp.error) {
                    reject(resp.error);
                } else {
                    resolve(resp);
                }
            },
            reject
        );
    });
}

