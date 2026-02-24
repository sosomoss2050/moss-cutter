// 网格对齐测试

console.log('🔧 测试网格对齐问题...\n');

// 模拟场景：图片居中，但网格没有居中
function simulateGridAlignmentIssue() {
    console.log('📐 模拟网格对齐问题：');
    
    // 假设容器尺寸
    const containerWidth = 800;
    const containerHeight = 540; // 500px canvas + 40px padding
    
    // 假设canvas尺寸（居中显示）
    const canvasWidth = 250;
    const canvasHeight = 500;
    
    // canvas在容器中的位置（居中）
    const canvasOffsetX = (containerWidth - canvasWidth) / 2;
    const canvasOffsetY = 20; // padding-top
    
    console.log(`容器尺寸: ${containerWidth} × ${containerHeight}`);
    console.log(`Canvas尺寸: ${canvasWidth} × ${canvasHeight}`);
    console.log(`Canvas位置: 左${canvasOffsetX}px, 上${canvasOffsetY}px`);
    console.log('');
    
    // 测试3×3网格
    const rows = 3;
    const cols = 3;
    const cellWidth = canvasWidth / cols;
    const cellHeight = canvasHeight / rows;
    
    console.log(`网格: ${rows} × ${cols}`);
    console.log(`单元格: ${cellWidth.toFixed(1)} × ${cellHeight.toFixed(1)}`);
    console.log('');
    
    // 计算网格线位置（错误的方法 - 不考虑canvas偏移）
    console.log('❌ 错误方法（不考虑canvas偏移）：');
    for (let i = 1; i < cols; i++) {
        const x = i * cellWidth;
        console.log(`  垂直线 ${i}: x = ${x.toFixed(1)}px`);
    }
    for (let i = 1; i < rows; i++) {
        const y = i * cellHeight;
        console.log(`  水平线 ${i}: y = ${y.toFixed(1)}px`);
    }
    
    console.log('');
    
    // 计算网格线位置（正确的方法 - 考虑canvas偏移）
    console.log('✅ 正确方法（考虑canvas偏移）：');
    for (let i = 1; i < cols; i++) {
        const x = canvasOffsetX + (i * cellWidth);
        console.log(`  垂直线 ${i}: x = ${x.toFixed(1)}px (偏移: +${canvasOffsetX}px)`);
    }
    for (let i = 1; i < rows; i++) {
        const y = canvasOffsetY + (i * cellHeight);
        console.log(`  水平线 ${i}: y = ${y.toFixed(1)}px (偏移: +${canvasOffsetY}px)`);
    }
    
    console.log('');
    
    // 验证对齐
    console.log('🎯 验证对齐：');
    const firstVerticalX = canvasOffsetX + cellWidth;
    const lastVerticalX = canvasOffsetX + (cellWidth * (cols - 1));
    const firstHorizontalY = canvasOffsetY + cellHeight;
    const lastHorizontalY = canvasOffsetY + (cellHeight * (rows - 1));
    
    console.log(`第一条垂直线: ${firstVerticalX.toFixed(1)}px (应该在canvas内)`);
    console.log(`最后一条垂直线: ${lastVerticalX.toFixed(1)}px (应该在canvas内)`);
    console.log(`第一条水平线: ${firstHorizontalY.toFixed(1)}px (应该在canvas内)`);
    console.log(`最后一条水平线: ${lastHorizontalY.toFixed(1)}px (应该在canvas内)`);
    
    // 检查是否在canvas范围内
    const inCanvasX = firstVerticalX >= canvasOffsetX && lastVerticalX <= canvasOffsetX + canvasWidth;
    const inCanvasY = firstHorizontalY >= canvasOffsetY && lastHorizontalY <= canvasOffsetY + canvasHeight;
    
    console.log('');
    console.log(inCanvasX ? '✅ 垂直线在canvas范围内' : '❌ 垂直线超出canvas范围');
    console.log(inCanvasY ? '✅ 水平线在canvas范围内' : '❌ 水平线超出canvas范围');
}

// 测试不同场景
console.log('=== 场景1: 竖屏图片 (500×1000) ===');
simulateGridAlignmentIssue();

console.log('\n=== 场景2: 宽屏图片 (1920×1080) ===');
// 更新参数
const containerWidth2 = 800;
const canvasWidth2 = 596;
const canvasHeight2 = 335;
const canvasOffsetX2 = (containerWidth2 - canvasWidth2) / 2;
const canvasOffsetY2 = 20;

console.log(`容器宽度: ${containerWidth2}px`);
console.log(`Canvas尺寸: ${canvasWidth2} × ${canvasHeight2}`);
console.log(`Canvas位置: 左${canvasOffsetX2.toFixed(1)}px, 上${canvasOffsetY2}px`);

console.log('\n=== 场景3: 方形图片 (800×800) ===');
const containerWidth3 = 800;
const canvasWidth3 = 500;
const canvasHeight3 = 500;
const canvasOffsetX3 = (containerWidth3 - canvasWidth3) / 2;
const canvasOffsetY3 = 20;

console.log(`容器宽度: ${containerWidth3}px`);
console.log(`Canvas尺寸: ${canvasWidth3} × ${canvasHeight3}`);
console.log(`Canvas位置: 左${canvasOffsetX3.toFixed(1)}px, 上${canvasOffsetY3}px`);

console.log('\n💡 问题分析：');
console.log('1. 图片居中显示，但网格线使用绝对定位在容器左上角');
console.log('2. 网格线没有考虑canvas在容器中的偏移位置');
console.log('3. 需要计算canvas.getBoundingClientRect()获取精确位置');
console.log('4. 网格线位置 = canvas偏移 + 网格线在canvas内的位置');

console.log('\n🛠️ 修复方案：');
console.log('1. 获取canvas和容器的getBoundingClientRect()');
console.log('2. 计算偏移: offsetX = canvas.left - container.left');
console.log('3. 计算偏移: offsetY = canvas.top - container.top');
console.log('4. 网格线位置 = offsetX/Y + (i * cellWidth/Height)');

console.log('\n🚀 修复已应用！请测试网格是否与图片对齐。');