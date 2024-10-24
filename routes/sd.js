import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = express.Router()


router.get('/', (req, res) => {
  res.render('hotels/sd')
})

router.post('/delete-folder', (req, res) => {
  const { foldername } = req.body;

  if (!foldername) {
    return res.status(400).json({ error: 'No folder name provided' });
  }

  const folderPath = path.join(__dirname, '..', foldername);

  
  if (!fs.existsSync(folderPath)) {
    return res.status(404).json({ error: 'Folder not found' });
  }

  fs.rm(folderPath, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error('Error deleting folder:', err);
      return res.status(500).json({ error: 'Error deleting folder', details: err.message });
    }
    res.json({ message: 'Folder deleted successfully' });
  });
})

export default router
