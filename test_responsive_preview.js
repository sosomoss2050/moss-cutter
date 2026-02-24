// 响应式预览测试

console.log('🔧 测试响应式预览修复...\n');

// 模拟不同容器宽度下的预览效果
const testScenarios = [
    { 
        name: '桌面大屏', 
        containerWidth: 1200,
        padding: 40,
        expected: '充分利用宽度'
    },
    { 
        name: '桌面正常', 
        containerWidth: 1000,
        padding: 40,
        expected: '正常显示'
    },
    { 
        name: '平板横屏', 
        containerWidth: 768,
        padding: 30,
        expected: '适应中等宽度'
    },
    { 
        name: '平板竖屏', 
        containerWidth: 600,
        padding: 20,
        expected: '较小宽度'
    },
    { 
        name: '手机横屏', 
        containerWidth: 480,
        padding: 15,
        expected: '紧凑显示'
    },
    { 
        name: '手机竖屏', 
        containerWidth: 360,
        padding: 10,
        expected: '最小宽度'
    }
];

// 测试图片
const testImage = { width: 500, height: 1000 }; // 竖屏图片

// 模拟displayImage函数的逻辑
function simulateResponsiveDisplay(imgWidth, imgHeight, scenario) {
    const availableWidth = scenario.containerWidth - scenario.padding * 2;
    const maxHeight = 500;
    
    let width = imgWidth;
    let height = imgHeight;
    
    // 计算缩放比例，保持宽高比
    const widthRatio = availableWidth / width;
    const heightRatio = maxHeight / height;
    const scale = Math.min(widthRatio, heightRatio, 1);
    
    width = Math.floor(width * scale);
    height = Math.floor(height * scale);
    
    return { 
        availableWidth,
        maxHeight,
        width, 
        height, 
        scale,
        widthUsage: (width / availableWidth * 100).toFixed(1) + '%',
        heightUsage: (height / maxHeight * 100).toFixed(1) + '%'
    };
}

console.log('📊 响应式测试结果：\n');
console.log(`测试图片: ${testImage.width}×${testImage.height} (${(testImage.width/testImage.height).toFixed(2)}:1)\n`);

testScenarios.forEach(scenario => {
    const result = simulateResponsiveDisplay(testImage.width, testImage.height, scenario);
    
    console.log(`📱 ${scenario.name}:`);
    console.log(`   容器宽度: ${scenario.containerWidth}px`);
    console.log(`   Padding: ${scenario.padding}px`);
    console.log(`   可用宽度: ${result.availableWidth}px`);
    console.log(`   预览尺寸: ${result.width} × ${result.height}`);
    console.log(`   缩放比例: ${(result.scale * 100).toFixed(1)}%`);
    console.log(`   宽度使用: ${result.widthUsage}`);
    console.log(`   高度使用: ${result.heightUsage}`);
    
    // 分析空白情况
    if (result.scale === 1) {
        console.log(`   ✅ 原始尺寸显示`);
    } else if (parseFloat(result.widthUsage) > 95) {
        console.log(`   ✅ 宽度占满 (${(100 - parseFloat(result.widthUsage)).toFixed(1)}% 空白)`);
    } else if (parseFloat(result.heightUsage) > 95) {
        console.log(`   ✅ 高度占满 (${(100 - parseFloat(result.heightUsage)).toFixed(1)}% 空白)`);
    } else {
        const widthBlank = result.availableWidth - result.width;
        const heightBlank = result.maxHeight - result.height;
        console.log(`   ⚖️  平衡显示 (宽度空白: ${widthBlank}px, 高度空白: ${heightBlank}px)`);
    }
    
    console.log('');
});

// 测试窗口大小变化
console.log('🔄 窗口大小变化模拟：');
console.log('从桌面大屏 (1200px) 调整到手机竖屏 (360px)');

const desktopResult = simulateResponsiveDisplay(testImage.width, testImage.height, testScenarios[0]);
const mobileResult = simulateResponsiveDisplay(testImage.width, testImage.height, testScenarios[5]);

console.log(`桌面大屏: ${desktopResult.width} × ${desktopResult.height} (缩放: ${(desktopResult.scale * 100).toFixed(1)}%)`);
console.log(`手机竖屏: ${mobileResult.width} × ${mobileResult.height} (缩放: ${(mobileResult.scale * 100).toFixed(1)}%)`);
console.log(`缩放变化: ${((mobileResult.scale - desktopResult.scale) * 100).toFixed(1)}%`);

console.log('\n💡 修复说明：');
console.log('1. 之前问题：使用固定宽度计算，不响应容器实际大小');
console.log('2. 现在修复：使用父容器实际可用宽度 (clientWidth - padding)');
console.log('3. 响应式：添加窗口大小变化监听，实时重新计算');
console.log('4. 自适应：图片始终根据当前可用空间优化显示');

console.log('\n🎯 预期效果：');
console.log('• 桌面大屏：充分利用宽度，高度可能有限制');
console.log('• 平板设备：适应中等宽度，保持可读性');
console.log('• 手机设备：紧凑显示，确保不超出屏幕');
console.log('• 窗口调整：实时适应新的大小');

console.log('\n🚀 测试完成！请刷新页面并测试不同窗口大小下的预览效果。');