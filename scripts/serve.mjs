import dotenv from 'dotenv';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env');

// Load .env file
dotenv.config({ path: envPath });

const apiKey = process.env.STRAPI_API_KEY_RO;
if (!apiKey) {
  console.error('STRAPI_API_KEY_RO not found in .env file');
  process.exit(1);
}

// Replace `process.env` at build time with an object containing the API key.
// The --define value must be a valid JS literal, so we use double quotes
// around the shell arg to preserve single quotes inside the JS object.
const cmd = `ng serve --define process.env="{STRAPI_API_KEY_RO: '${apiKey}'}"`;

try {
  execSync(cmd, { stdio: 'inherit', shell: true });
} catch (err) {
  process.exit(err.status ?? 1);
}