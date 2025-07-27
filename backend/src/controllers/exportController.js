import archiver from 'archiver';
import Component from '../models/Component.js';

export const exportSessionZip = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const components = await Component.find({ sessionId });

    if (!components || components.length === 0) {
      return res.status(404).json({ message: 'No components found for this session.' });
    }

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename=session-${sessionId}.zip`,
    });

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    components.forEach((comp, i) => {
      archive.append(comp.jsx, { name: `Component${i + 1}.jsx` });
      archive.append(comp.css, { name: `Component${i + 1}.css` });
    });

    archive.finalize();
  } catch (error) {
    console.error('Error exporting ZIP:', error);
    res.status(500).json({ message: 'Server error during export.' });
  }
};
