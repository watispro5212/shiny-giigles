function formatTime() {
    return new Date().toLocaleTimeString('en-US', { hour12: false });
}

const logger = {
    info: (message) => console.log(`\x1b[90m[${formatTime()}]\x1b[0m \x1b[36m[INFO]\x1b[0m ${message}`),
    warn: (message) => console.log(`\x1b[90m[${formatTime()}]\x1b[0m \x1b[33m[WARN]\x1b[0m ${message}`),
    error: (message) => console.error(`\x1b[90m[${formatTime()}]\x1b[0m \x1b[31m[ERROR]\x1b[0m ${message}`),
    debug: (message) => console.log(`\x1b[90m[${formatTime()}]\x1b[0m \x1b[35m[DEBUG]\x1b[0m ${message}`),
    success: (message) => console.log(`\x1b[90m[${formatTime()}]\x1b[0m \x1b[32m[OK]\x1b[0m ${message}`),
};

module.exports = logger;
