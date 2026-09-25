import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const portArgIndex = process.argv.indexOf('--port');
const port = Number(portArgIndex >= 0 ? process.argv[portArgIndex + 1] : process.env.PORT) || 5173;

const contentTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon'
};

function resolveRequestPath(url) {
    const pathname = decodeURIComponent(new URL(url, `http://localhost:${port}`).pathname);
    const requestedPath = pathname === '/' ? '/index.html' : pathname;
    const normalizedPath = normalize(requestedPath).replace(/^(\.\.[/\\])+/, '');
    const fullPath = join(root, normalizedPath);

    if (!fullPath.startsWith(root)) {
        return null;
    }

    if (existsSync(fullPath) && statSync(fullPath).isFile()) {
        return fullPath;
    }

    return join(root, 'index.html');
}

const server = createServer((request, response) => {
    const filePath = resolveRequestPath(request.url);

    if (!filePath || !existsSync(filePath)) {
        response.writeHead(404);
        response.end('Not found');
        return;
    }

    response.writeHead(200, {
        'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream'
    });

    createReadStream(filePath).pipe(response);
});

server.listen(port, () => {
    console.log(`MLOps Flow SPA is running at http://localhost:${port}/`);
});
