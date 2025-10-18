const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
  getStatistic: () => console.log('Statistic requested'),
});
