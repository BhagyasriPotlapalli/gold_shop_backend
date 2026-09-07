import fs from 'fs';
import path from 'path';

const controllersDir = path.join(process.cwd(), 'controllers');
const routesDir = path.join(process.cwd(), 'routes');

const profiles = ['Vendor', 'Worker', 'Bullion', 'Processor', 'Order'];

const generateController = (name) => "import { " + name + ", " + name + "Audit } from '../models/index.js';\n\n" +
"export const create" + name + " = async (req, res) => {\n" +
"  try {\n" +
"    const data = await " + name + ".create(req.body);\n" +
"    await " + name + "Audit.create({ " + name.toLowerCase() + "Id: data.id, action: 'CREATE', newData: data });\n" +
"    res.status(201).json(data);\n" +
"  } catch (error) {\n" +
"    res.status(500).json({ error: error.message });\n" +
"  }\n" +
"};\n\n" +
"export const get" + name + "s = async (req, res) => {\n" +
"  try {\n" +
"    const data = await " + name + ".findAll();\n" +
"    res.status(200).json(data);\n" +
"  } catch (error) {\n" +
"    res.status(500).json({ error: error.message });\n" +
"  }\n" +
"};\n\n" +
"export const get" + name + "ById = async (req, res) => {\n" +
"  try {\n" +
"    const data = await " + name + ".findByPk(req.params.id);\n" +
"    if (!data) return res.status(404).json({ message: 'Not found' });\n" +
"    res.status(200).json(data);\n" +
"  } catch (error) {\n" +
"    res.status(500).json({ error: error.message });\n" +
"  }\n" +
"};\n\n" +
"export const update" + name + " = async (req, res) => {\n" +
"  try {\n" +
"    const data = await " + name + ".findByPk(req.params.id);\n" +
"    if (!data) return res.status(404).json({ message: 'Not found' });\n" +
"    \n" +
"    const oldData = data.toJSON();\n" +
"    await data.update(req.body);\n" +
"    \n" +
"    await " + name + "Audit.create({ " + name.toLowerCase() + "Id: data.id, action: 'UPDATE', oldData, newData: data });\n" +
"    res.status(200).json(data);\n" +
"  } catch (error) {\n" +
"    res.status(500).json({ error: error.message });\n" +
"  }\n" +
"};\n\n" +
"export const delete" + name + " = async (req, res) => {\n" +
"  try {\n" +
"    const data = await " + name + ".findByPk(req.params.id);\n" +
"    if (!data) return res.status(404).json({ message: 'Not found' });\n" +
"    \n" +
"    const oldData = data.toJSON();\n" +
"    await data.destroy();\n" +
"    \n" +
"    await " + name + "Audit.create({ " + name.toLowerCase() + "Id: data.id, action: 'DELETE', oldData });\n" +
"    res.status(200).json({ message: 'Deleted successfully' });\n" +
"  } catch (error) {\n" +
"    res.status(500).json({ error: error.message });\n" +
"  }\n" +
"};\n";

const generateRoute = (name) => "import express from 'express';\n" +
"import { create" + name + ", get" + name + "s, get" + name + "ById, update" + name + ", delete" + name + " } from '../controllers/" + name.toLowerCase() + "Controller.js';\n\n" +
"const router = express.Router();\n\n" +
"router.post('/', create" + name + ");\n" +
"router.get('/', get" + name + "s);\n" +
"router.get('/:id', get" + name + "ById);\n" +
"router.put('/:id', update" + name + ");\n" +
"router.delete('/:id', delete" + name + ");\n\n" +
"export default router;\n";

profiles.forEach(name => {
  fs.writeFileSync(path.join(controllersDir, name.toLowerCase() + 'Controller.js'), generateController(name));
  fs.writeFileSync(path.join(routesDir, name.toLowerCase() + 'Routes.js'), generateRoute(name));
});

console.log('Controllers and Routes generated successfully!');
