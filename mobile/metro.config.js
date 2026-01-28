const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Limit watching to only the frontend directory
config.watchFolders = [__dirname];

// Set the project root to this directory only
config.projectRoot = __dirname;

// Exclude parent directories and backend files
config.resolver.blockList = [
  // Exclude all parent directory contents
  /\.\.\/(api|src|migrations|instance|venv|_archive|scripts|templates|static)\/.*/,
  // Exclude git and python cache
  /\.\.\/\.git\/.*/,
  /.*\/__pycache__\/.*/,
  /.*\.pyc$/,
  // Exclude common cache directories
  /.*\/\.expo\/.*/,
  /.*\/\.git\/.*/,
];

// Limit file watcher to reduce file handles
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Ignore requests for parent directory files
      if (req.url.includes('../')) {
        res.writeHead(404);
        res.end();
        return;
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
