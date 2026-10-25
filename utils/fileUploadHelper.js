"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFile = void 0;
const { mkdirSync, writeFileSync } = require("fs");
const { tmpdir } = require("os");
const { join } = require("path");
const TINY_JPG = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=', 'base64');
const TINY_PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
const TINY_PDF = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n', 'latin1');
const MIME = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    png: 'image/png',
    exe: 'application/x-msdownload',
    txt: 'text/plain',
    'fake-pdf': 'application/pdf',
};
function base(kind) {
    switch (kind) {
        case 'pdf':
            return TINY_PDF;
        case 'jpg':
            return TINY_JPG;
        case 'png':
            return TINY_PNG;
        case 'exe':
            return Buffer.concat([Buffer.from('MZ'), Buffer.alloc(256, 0x90)]);
        case 'txt':
        case 'fake-pdf':
            return Buffer.from('This is plain text, not a real document.\n', 'utf8');
    }
}
/**
 * Creates a file in a temp folder. `sizeKb` pads the file (valid header first, padding after) so size-limit tests
 * can build 5,120 KB / 5,121 KB files at run time instead of committing large binaries.
 */
function makeFile(kind, name, sizeKb) {
    const dir = join(tmpdir(), 'insurance-uploads');
    mkdirSync(dir, { recursive: true });
    const ext = kind === 'fake-pdf' ? 'pdf' : kind;
    const fileName = name ?? `qa-${kind}-${Date.now()}.${ext}`;
    let buffer = base(kind);
    if (sizeKb && buffer.length < sizeKb * 1024) {
        buffer = Buffer.concat([buffer, Buffer.alloc(sizeKb * 1024 - buffer.length, 0x20)]);
    }
    const full = join(dir, fileName);
    writeFileSync(full, buffer);
    return { path: full, name: fileName, mimeType: MIME[kind], buffer, sizeKb: Math.round(buffer.length / 1024) };
}
exports.makeFile = makeFile;
