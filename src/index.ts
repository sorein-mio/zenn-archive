import * as fs from 'fs';
import * as path from 'path';

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
  const zennFrontMatter = parseYaml(frontMatterYaml) as ZennFrontMatter;

  // Qiita形式のフロントマターに変換
  const qiitaFrontMatter: QiitaFrontMatter = {
    title: zennFrontMatter.title,
    tags: (zennFrontMatter.topics || []).map(topic => ({ name: topic })),
    private: false,
    slide: false,
    id: "",
    organization_url_name: "",
    updated_at: new Date().toISOString(),
  };

  // 新しいフロントマターを作成
  const newFrontMatter = `---
title: "${qiitaFrontMatter.title}"
tags:
${qiitaFrontMatter.tags.map(tag => `  - name: "${tag.name}"`).join('\n')}
private: false
slide: false
id: ""
organization_url_name: ""
updated_at: "${qiitaFrontMatter.updated_at}"
---

<!-- Converted from Zenn format -->`;

  // 元の本文を取得（先頭の空行を削除）
  const body = content.replace(/^---\n[\s\S]*?\n---\n\s*/, '');

  // 新しい内容を書き込み
  const newContent = `${newFrontMatter}\n${body}`;
  fs.writeFileSync(outputPath, newContent);
  console.log('Conversion completed successfully');
};

const parseYaml = (yaml: string): any => {
  const result: any = {};
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
      } else {
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