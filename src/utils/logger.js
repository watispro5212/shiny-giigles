/**
 * Nexus Protocol — Logger Utility
 * Colorized console output using native ANSI codes (zero dependencies).
 */

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
    white: '\x1b[37m',
    bold: '\x1b[1m',
};

const timestamp = () => `[${new Date().toLocaleString()}]`;

const logger = {
    info: (message) => {
        console.log(`${colors.cyan}${timestamp()} [INFO]${colors.reset} ${message}`);
    },
    success: (message) => {
        console.log(`${colors.green}${timestamp()} [SUCCESS]${colors.reset} ${message}`);
    },
    warn: (message) => {
        console.log(`${colors.yellow}${timestamp()} [WARN]${colors.reset} ${message}`);
    },
    error: (message, error) => {
        console.error(`${colors.red}${timestamp()} [ERROR]${colors.reset} ${message}`);
        if (error) console.error(error);
    },
    debug: (message) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`${colors.gray}${timestamp()} [DEBUG]${colors.reset} ${message}`);
        }
    },
    shard: (shardId, message) => {
        console.log(`${colors.magenta}${timestamp()} [SHARD ${shardId}]${colors.reset} ${message}`);
    },
    command: (commandName, userId) => {
        console.log(`${colors.blue}${timestamp()} [CMD]${colors.reset} /${commandName} by ${userId}`);
    }
};

module.exports = logger;
