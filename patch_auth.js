import fs from 'fs';
import path from 'path';

const authControllerPath = path.join(process.cwd(), 'controllers', 'authController.js');

let content = fs.readFileSync(authControllerPath, 'utf8');

content = content.replace(/import \{ User, UserAuditLog \} from '\.\.\/models\/index\.js';/, "import { User } from '../models/index.js';\nimport { logAudit } from '../utils/auditLogger.js';");

content = content.replace(/await UserAuditLog\.create\(\{[\s\S]*?\}\);/g, `await logAudit({
      req,
      action: 'AUTH_ACTION',
      module: 'AUTH',
      description: 'Authentication action performed',
      entity: { id: 0, type: 'USER', name: 'System' },
      changes: null
    });`);

// remove getAuditLogs from authController
content = content.replace(/export const getAuditLogs = async[\s\S]*?res\.status\(400\)\.json\(\{ message: error\.message \}\);\n  \}\n\};\n/g, "");

fs.writeFileSync(authControllerPath, content);
console.log("Refactored authController.js");
