import express from 'express';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Prediction API
app.post('/api/predict', (req, res) => {
  console.log('Inputs received from frontend:', req.body);

  const python = spawn('python', ['predict.py'], { cwd: __dirname });
  const input = JSON.stringify(req.body);

  let output = '';
  let errorOutput = '';

  python.stdin.write(input);
  python.stdin.end();

  python.stdout.on('data', data => {
    output += data.toString();
    console.log('Python Output:', data.toString());
  });

  python.stderr.on('data', data => {
    errorOutput += data.toString();
    console.error('Python Error Output:', data.toString());
  });

  python.on('close', code => {
    if (code !== 0) {
      console.error('Python script exited with error code:', code);
      if (!res.headersSent) {
        return res.status(500).json({ error: 'Python script failed', details: errorOutput });
      }
      return;
    }

    try {
      const lines = output.split('\n');
      const jsonLine = lines.find(line => line.trim().startsWith('{') && line.trim().endsWith('}'));
      if (!jsonLine) throw new Error("No valid JSON object found.");
      const result = JSON.parse(jsonLine);
      if (!res.headersSent) {
        res.json({ ...result, status: 'success' });
      }
    } catch (err) {
      console.error('JSON parsing failed:', err.message);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to parse Python output', details: err.message });
      }
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'aircraft-risk-predictor'
  });
});

// Serve React app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
