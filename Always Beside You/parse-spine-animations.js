import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前模块的路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取spine.json文件
const spineJsonPath = path.join(__dirname, 'public', 'spine.json');

async function parseSpineAnimations() {
  try {
    const data = await fs.readFile(spineJsonPath, 'utf8');
    const spineData = JSON.parse(data);
    
    // 检查是否有animations字段
    if (spineData.animations) {
      console.log('=== Animations Structure ===');
      console.log('Type of animations:', typeof spineData.animations);
      console.log('Animations keys:', Object.keys(spineData.animations));
      console.log('=========================');
      
      // 遍历动画对象
      const animationNames = Object.keys(spineData.animations);
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

parseSpineAnimations();
