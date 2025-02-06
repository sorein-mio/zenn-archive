import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

interface ZennFrontMatter {
  title: string;
  emoji?: string;
  type?: string;
  topics?: string[];
  published?: boolean;
}

interface QiitaFrontMatter {
  title: string;
  tags: { name: string }[];
  private: boolean;
  slide: boolean;
  id: string;
  organization_url_name: string;
  updated_at: string;
}

const convertToQiitaFormat = (inputPath: string, outputPath: string) => {
  console.log(`Converting file from ${inputPath} to ${outputPath}`);
  const content = fs.readFileSync(inputPath, 'utf8');
  
  // フロントマターを抽出
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontMatterMatch) {
    throw new Error('No front matter found');
  }

  const frontMatterYaml = frontMatterMatch[1];
  const zennFrontMatter = yaml.parse(frontMatterYaml) as ZennFrontMatter;

  // 現在時刻をISO 8601形式で生成（ミリ秒を除去）
  const now = new Date();
  const updated_at = now.toISOString().replace(/\.\d{3}Z$/, 'Z');

  // Qiita形式のフロントマターに変換
  const qiitaFrontMatter: QiitaFrontMatter = {
    title: zennFrontMatter.title,
    tags: (zennFrontMatter.topics || []).map(topic => ({ name: topic })),
    private: false,
    slide: false,
    id: "",
    organization_url_name: "",
    updated_at: updated_at,
  };

  // 新しいフロントマターを作成（YAMLを手動で構築）
  const newFrontMatter = `---
title: "${qiitaFrontMatter.title}"
tags:
${qiitaFrontMatter.tags.map(tag => `  - name: "${tag.name}"`).join('\n')}
private: false
slide: false
id: ""
organization_url_name: ""
updated_at: '${qiitaFrontMatter.updated_at}'
---

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