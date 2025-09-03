const path = require('path');
require('electron-reload')(path.join(__dirname, '.'), {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
});