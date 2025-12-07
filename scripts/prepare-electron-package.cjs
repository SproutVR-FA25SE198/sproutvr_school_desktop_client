const fs = require('fs');
const path = require('path');

const electronPackage = {
  name: 'sproutvr-electron',
  version: '1.0.0',
  main: 'main/main.js',
  dependencies: {
    '@grpc/grpc-js': '^1.14.1',
    '@grpc/proto-loader': '^0.8.0',
    dotenv: '^17.2.3',
  },
};

const distElectronPath = path.join(__dirname, '..', 'dist-electron');

// Ensure directory exists
if (!fs.existsSync(distElectronPath)) {
  fs.mkdirSync(distElectronPath, { recursive: true });
}

// Write package.json
fs.writeFileSync(path.join(distElectronPath, 'package.json'), JSON.stringify(electronPackage, null, 2));
