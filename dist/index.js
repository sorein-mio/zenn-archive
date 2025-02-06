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
    const zennFrontMatter = yaml.parse(frontMatterYaml);
    // 現在時刻をISO 8601形式で生成（ミリ秒を除去）
    const now = new Date();
    const updated_at = now.toISOString().replace(/\.\d{3}Z$/, 'Z');
    // Qiita形式のフロントマターに変換
    const qiitaFrontMatter = {
        title: zennFrontMatter.title,
        tags: (zennFrontMatter.topics || []).map(topic => ({ name: topic })),
        private: false,
        slide: false,
        id: "",
        organization_url_name: "",
        updated_at: updated_at,
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
    const yamlStr = yaml.stringify(frontMatterObj);
    const newFrontMatter = `---
${yamlStr}---

<!-- Converted from Zenn format -->`;
    // 元の本文を取得（先頭の空行を削除）
    const body = content.replace(/^---\n[\s\S]*?\n---\n\s*/, '');
    // 新しい内容を書き込み
    const newContent = `${newFrontMatter}\n${body}`;
    fs.writeFileSync(outputPath, newContent);
    console.log('Conversion completed successfully');
};
const [inputPath, outputPath] = process.argv.slice(2);
console.log('Starting conversion process...');
console.log(`Input path: ${inputPath}`);
console.log(`Output path: ${outputPath}`);
convertToQiitaFormat(inputPath, outputPath);
