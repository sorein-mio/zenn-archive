import * as fs from 'fs';
import * as path from 'path';

const convertToQiitaFormat = (inputPath: string, outputPath: string) => {
  console.log(`Converting file from ${inputPath} to ${outputPath}`);
  const content = fs.readFileSync(inputPath, 'utf8');
  // ここでZenn形式からQiita形式への変換ロジックを実装
  fs.writeFileSync(outputPath, content);
  console.log('Conversion completed successfully');
};

const [inputPath, outputPath] = process.argv.slice(2);
console.log('Starting conversion process...');
console.log(`Input path: ${inputPath}`);
console.log(`Output path: ${outputPath}`);
convertToQiitaFormat(inputPath, outputPath); 