import fs from 'fs';
import path from 'path';

const controllersDir = path.join(process.cwd(), 'controllers');

const filesToRefactor = ['authController.js', 'companyController.js', 'branchController.js'];

filesToRefactor.forEach(file => {
  const filePath = path.join(controllersDir, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace UserAuditLog imports with logAudit utility
  content = content.replace(/import \{.*?UserAuditLog.*?\} from '\.\.\/models\/index\.js';/g, "import { User, Company, Branch } from '../models/index.js';\nimport { logAudit } from '../utils/auditLogger.js';");
  content = content.replace(/import \{.*?UserAuditLog.*?\} from '\.\.\/models';/g, "import { User, Company, Branch } from '../models/index.js';\nimport { logAudit } from '../utils/auditLogger.js';");

  // Replace getAuditLogs with a stub or remove it since it's now handled by auditLogController
  content = content.replace(/export const getAuditLogs = async \([^]*?res\.status\(400\)\.json\(\{ message: error\.message \}\);\n  \}\n\};\n/g, "");

  // Naive replacement of UserAuditLog.create with logAudit
  // This is a bit complex using regex, let's just do a simpler search and replace for the exact calls if possible
  // Or just rewrite the whole thing manually. For safety, I'll rewrite authController.js manually if it's too complex.
});
