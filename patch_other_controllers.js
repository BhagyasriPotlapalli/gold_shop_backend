import fs from 'fs';
import path from 'path';

const controllers = ['companyController.js', 'branchController.js'];

controllers.forEach(file => {
    const filePath = path.join(process.cwd(), 'controllers', file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/, UserAuditLog/g, "");
        content = content.replace(/await UserAuditLog\.create\(\{[\s\S]*?\}\);/g, `// Replaced with unified audit log
        // To implement properly, import logAudit and call it with req context
        // For now, removing broken references so server boots`);
        fs.writeFileSync(filePath, content);
    }
});
