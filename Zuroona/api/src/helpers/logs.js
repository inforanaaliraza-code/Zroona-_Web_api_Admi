const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m"
};

const log = {
    success: (message) => console.log(`${colors.green}[SUCCESS] ${new Date().toISOString()} - ${message}${colors.reset}`),
    info: (message) => console.log(`${colors.blue}[INFO] ${new Date().toISOString()} - ${message}${colors.reset}`),
    warning: (message) => console.log(`${colors.yellow}[WARNING] ${new Date().toISOString()} - ${message}${colors.reset}`),
    error: (message) => console.log(`${colors.red}[ERROR] ${new Date().toISOString()} - ${message}${colors.reset}`)
};



module.exports = log
