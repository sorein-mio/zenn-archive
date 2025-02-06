"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const yaml = __importStar(require("yaml"));
const convertToQiitaFormat = (inputPath, outputPath) => {
    console.log(`Converting file from ${inputPath} to ${outputPath}`);
    const content = fs.readFileSync(inputPath, 'utf8');
    // フロントマターを抽出
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontMatterMatch) {
        throw new Error('No front matter found');
    }
    const frontMatterYaml = frontMatterMatch[1];
    const zennFrontMatter = parseYaml(frontMatterYaml);
    // Qiita形式のフロントマターに変換
    const qiitaFrontMatter = {
        title: zennFrontMatter.title,
        tags: (zennFrontMatter.topics || []).map(topic => ({ name: topic })),
        private: false,
        slide: false,
        id: "example_id",
        organization_url_name: "example_org",
        updated_at: new Date().toISOString(),
    };
    // YAMLとしてフロントマターを生成
    const frontMatterObj = {
        title: qiitaFrontMatter.title,
        tags: qiitaFrontMatter.tags,
        private: qiitaFrontMatter.private,
        slide: qiitaFrontMatter.slide,
        id: qiitaFrontMatter.id,
        organization_url_name: qiitaFrontMatter.organization_url_name,
        updated_at: qiitaFrontMatter.updated_at,
    };
    // 新しいフロントマターを作成
    const newFrontMatter = `---
${yaml.stringify(frontMatterObj).trim()}
---

<!-- Converted from Zenn format -->`;
    // 元の本文を取得（先頭の空行を削除）
    const body = content.replace(/^---\n[\s\S]*?\n---\n\s*/, '');
    // 新しい内容を書き込み
    const newContent = `${newFrontMatter}\n${body}`;
    fs.writeFileSync(outputPath, newContent);
    console.log('Conversion completed successfully');
};
const parseYaml = (yaml) => {
    const result = {};
    const lines = yaml.split('\n');
    for (const line of lines) {
        const match = line.match(/^([^:]+):\s*(.+)$/);
        if (match) {
            const [_, key, value] = match;
            if (value.startsWith('[') && value.endsWith(']')) {
                // 配列の場合、カンマで分割して各要素をトリム
                result[key] = value
                    .slice(1, -1)
                    .split(',')
                    .map(s => s.trim().replace(/["']/g, ''));
            }
            else {
                // 文字列の場合、クォートを削除してトリム
                result[key] = value.replace(/["']/g, '').trim();
            }
        }
    }
    return result;
};
const [inputPath, outputPath] = process.argv.slice(2);
console.log('Starting conversion process...');
console.log(`Input path: ${inputPath}`);
console.log(`Output path: ${outputPath}`);
convertToQiitaFormat(inputPath, outputPath);
