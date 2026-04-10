import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前模块的路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取spine.json文件
const spineJsonPath = path.join(__dirname, 'public', 'spine.json');

async function extractAnimations() {
  try {
    const data = await fs.readFile(spineJsonPath, 'utf8');
    
    // 简单提取动画名称，避免解析整个大JSON
    const animationMatches = data.match(/"name":"([^"]+)"/g);
    if (animationMatches) {
      const animationNames = [...new Set(animationMatches.map(match => match.replace(/"name":"([^"]+)"/, '$1')))];
      console.log('=== Available Animations ===');
      animationNames.forEach((name, index) => {
        console.log(`${index + 1}. ${name}`);
      });
      console.log('=========================');
      console.log(`Total animations: ${animationNames.length}`);
    } else {
      console.error('No animations found in spine.json');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

extractAnimations();
