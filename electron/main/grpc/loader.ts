import path from 'path';
import { loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, 'proto', 'learning_session.proto');

const packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
  includeDirs: [path.join(__dirname, 'proto'), path.join(process.cwd(), 'node_modules/google-proto-files')],
});

const root = loadPackageDefinition(packageDefinition);

// 🔥 FIX: dynamically detect the correct namespace
export const LearningSession = (root as any).LearningSession?.v1 ?? (root as any).LearningSession ?? root;
