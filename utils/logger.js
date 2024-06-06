const fs = require("fs");
const path = require("path");

function getLogFileName() {
  return `${new Date().toISOString().slice(0, 10)}.log`;
}

function writeLog(level, message) {
  const logDir = "./logs";
  const logFile = path.join(logDir, getLogFileName());
  const logMessage = `${new Date().toISOString()} [${level}] ${message}\n`;

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  fs.appendFileSync(logFile, logMessage);
  console.log(logMessage.trim());
}

function info(message) {
  writeLog("INFO", message);
}

function error(message) {
  writeLog("ERROR", message);
}

function cleanupOldLogFiles() {
  const logDir = "./logs";
  const maxLogFiles = 50;

  fs.readdir(logDir, (err, files) => {
    if (err) {
      console.error("Failed to read log directory:", err);
      return;
    }

    const logFiles = files.filter((file) => file.endsWith(".log"));

    if (logFiles.length <= maxLogFiles) {
      return;
    }

    const sortedLogFiles = logFiles.sort().reverse();
    const oldLogFiles = sortedLogFiles.slice(maxLogFiles);

    oldLogFiles.forEach((file) => {
      const filePath = path.join(logDir, file);
      fs.unlinkSync(filePath);
    });
  });
}

module.exports = {
  info,
  error,
  cleanupOldLogFiles,
};
