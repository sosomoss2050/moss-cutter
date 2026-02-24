// 预览区域自适应测试

console.log('🔧 测试预览区域自适应修复...\n');

// 模拟不同尺寸的图片
const testImages = [
    { name: '竖屏图片', width: 500, height: 1000, expected: '高度自适应' },
    { name: '宽屏图片', width: 1920, height: 1080, expected: '宽度自适应' },
    { name: '方形图片', width: 800, height: 800, expected: '等比例缩放' },
    { name: '超宽图片', width: 2560, height: 1080, expected: '宽度限制' },
    { name: '超高图片', width: 1080, height: 2560, expected: '高度限制' }
];

// 模拟displayImage函数的逻辑
function simulateDisplayImage(imgWidth, imgHeight, containerWidth = 596) {
    const containerHeight = 500; // 最大高度
    
    let width = imgWidth;
    let height = imgHeight;
    
    // 计算缩放比例，保持宽高比
    const widthRatio = containerWidth / width;
    const heightRatio = containerHeight / height;
    const scale = Math.min(widthRatio, heightRatio, 1); // 不超过原始尺寸
    
    width = Math.floor(width * scale);
    height = Math.floor(height * scale);
    
    return { width, height, scale, containerWidth, containerHeight };
}

console.log('📊 测试结果：\n');

testImages.forEach(test => {
    const result = simulateDisplayImage(test.width, test.height);
    const aspectRatio = (test.width / test.height).toFixed(2);
    const previewRatio = (result.width / result.height).toFixed(2);
    
    console.log(`📸 ${test.name} (${test.width}×${test.height}, ${aspectRatio}:1):`);
    console.log(`   原始尺寸: ${test.width} × ${test.height}`);
    console.log(`   预览尺寸: ${result.width} × ${result.height} (缩放: ${(result.scale * 100).toFixed(1)}%)`);
    console.log(`   宽高比: ${aspectRatio}:1 → ${previewRatio}:1`);
    console.log(`   容器使用: ${result.width}/${result.containerWidth}px 宽度, ${result.height}/${result.containerHeight}px 高度`);
    
    // 检查是否有空白
    const widthUsage = (result.width / result.containerWidth * 100).toFixed(1);
    const heightUsage = (result.height / result.containerHeight * 100).toFixed(1);
    
    if (widthUsage < 95 && heightUsage < 95) {
        console.log(`   ⚠️  警告: 两边都有空白 (宽度使用率: ${widthUsage}%, 高度使用率: ${heightUsage}%)`);
    } else if (widthUsage < 95) {
        console.log(`   ✅ 宽度自适应: 高度占满，宽度有 ${(100 - widthUsage).toFixed(1)}% 空白`);
    } else if (heightUsage < 95) {
        console.log(`   ✅ 高度自适应: 宽度占满，高度有 ${(100 - heightUsage).toFixed(1)}% 空白`);
    } else {
        console.log(`   ✅ 完美适配: 占满容器`);
    }
    
    console.log('');
});

// 测试特定情况：500×1000竖屏图片
console.log('🎯 重点测试：500×1000竖屏图片');
const verticalTest = simulateDisplayImage(500, 1000);
console.log(`   容器宽度: ${verticalTest.containerWidth}px`);
console.log(`   计算缩放: ${(verticalTest.scale * 100).toFixed(1)}%`);
console.log(`   预览尺寸: ${verticalTest.width} × ${verticalTest.height}`);
console.log(`   空白分析:`);
console.log(`     - 宽度使用率: ${(verticalTest.width / verticalTest.containerWidth * 100).toFixed(1)}%`);
console.log(`     - 高度使用率: ${(verticalTest.height / verticalTest.containerHeight * 100).toFixed(1)}%`);
console.log(`     - 右侧空白: ${verticalTest.containerWidth - verticalTest.width}px`);

console.log('\n💡 修复说明：');
console.log('1. 之前问题：固定max-width导致宽高比不匹配的图片出现空白');
console.log('2. 现在修复：根据图片宽高比自适应缩放');
console.log('3. 算法：Math.min(容器宽度/图片宽度, 容器高度/图片高度, 1)');
console.log('4. 结果：图片总是占满宽度或高度中的一个方向');

console.log('\n🎯 预期效果：');
console.log('• 竖屏图片：占满高度，宽度居中（可能有左右空白）');
console.log('• 宽屏图片：占满宽度，高度居中（可能有上下空白）');
console.log('• 方形图片：等比例缩放，占满较小的一边');
console.log('• 无拉伸变形：保持原始宽高比');

console.log('\n🚀 测试完成！请刷新页面查看实际效果。');