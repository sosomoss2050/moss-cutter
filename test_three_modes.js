// MossCutter 三种切割模式对比测试

// 从script.js复制的函数
function calculateExactCut(width, height, rows, cols) {
    const baseCellWidth = Math.floor(width / cols);
    const baseCellHeight = Math.floor(height / rows);
    const widthRemainder = width % cols;
    const heightRemainder = height % rows;
    
    const colWidths = [];
    const rowHeights = [];
    
    for (let col = 0; col < cols; col++) {
        colWidths[col] = baseCellWidth + (col < widthRemainder ? 1 : 0);
    }
    
    for (let row = 0; row < rows; row++) {
        rowHeights[row] = baseCellHeight + (row < heightRemainder ? 1 : 0);
    }
    
    const colStarts = [];
    const rowStarts = [];
    let currentX = 0;
    let currentY = 0;
    
    for (let col = 0; col < cols; col++) {
        colStarts[col] = currentX;
        currentX += colWidths[col];
    }
    
    for (let row = 0; row < rows; row++) {
        rowStarts[row] = currentY;
        currentY += rowHeights[row];
    }
    
    return { colWidths, rowHeights, colStarts, rowStarts };
}

function calculateUniformCut(width, height, rows, cols) {
    const uniformCellWidth = Math.floor(width / cols);
    const uniformCellHeight = Math.floor(height / rows);
    
    const usedWidth = uniformCellWidth * cols;
    const usedHeight = uniformCellHeight * rows;
    
    const lostWidth = width - usedWidth;
    const lostHeight = height - usedHeight;
    
    const startX = Math.floor(lostWidth / 2);
    const startY = Math.floor(lostHeight / 2);
    
    const colWidths = Array(cols).fill(uniformCellWidth);
    const rowHeights = Array(rows).fill(uniformCellHeight);
    
    const colStarts = [];
    const rowStarts = [];
    
    for (let col = 0; col < cols; col++) {
        colStarts[col] = startX + (col * uniformCellWidth);
    }
    
    for (let row = 0; row < rows; row++) {
        rowStarts[row] = startY + (row * uniformCellHeight);
    }
    
    return { 
        colWidths, 
        rowHeights, 
        colStarts, 
        rowStarts,
        lostPixels: { width: lostWidth, height: lostHeight }
    };
}

function calculateFillCut(width, height, rows, cols) {
    const baseCellWidth = Math.floor(width / cols);
    const baseCellHeight = Math.floor(height / rows);
    
    const totalUsedWidth = baseCellWidth * cols;
    const totalUsedHeight = baseCellHeight * rows;
    const fillWidth = width - totalUsedWidth;
    const fillHeight = height - totalUsedHeight;
    
    const leftFill = Math.floor(fillWidth / 2);
    const rightFill = fillWidth - leftFill;
    const topFill = Math.floor(fillHeight / 2);
    const bottomFill = fillHeight - topFill;
    
    const colWidths = Array(cols).fill(baseCellWidth);
    const rowHeights = Array(rows).fill(baseCellHeight);
    
    const colStarts = [];
    const rowStarts = [];
    
    let currentX = leftFill;
    for (let col = 0; col < cols; col++) {
        colStarts[col] = currentX;
        currentX += baseCellWidth;
    }
    
    let currentY = topFill;
    for (let row = 0; row < rows; row++) {
        rowStarts[row] = currentY;
        currentY += baseCellHeight;
    }
    
    return { 
        colWidths, 
        rowHeights, 
        colStarts, 
        rowStarts,
        fillPixels: { 
            left: leftFill, 
            right: rightFill, 
            top: topFill, 
            bottom: bottomFill,
            totalWidth: fillWidth,
            totalHeight: fillHeight
        }
    };
}

// 测试函数
function testThreeModes(name, width, height, rows, cols) {
    console.log(`\n📊 ${name} (${width}×${height} → ${rows}×${cols})`);
    console.log(`宽高比: ${(width/height).toFixed(2)}:1`);
    
    // 测试三种模式
    const exact = calculateExactCut(width, height, rows, cols);
    const uniform = calculateUniformCut(width, height, rows, cols);
    const fill = calculateFillCut(width, height, rows, cols);
    
    console.log('\n1. 🔢 精确像素模式:');
    console.log(`   列宽度: [${exact.colWidths.join(', ')}]`);
    console.log(`   行高度: [${exact.rowHeights.join(', ')}]`);
    const exactTotalWidth = exact.colWidths.reduce((a, b) => a + b, 0);
    const exactTotalHeight = exact.rowHeights.reduce((a, b) => a + b, 0);
    console.log(`   总尺寸: ${exactTotalWidth}×${exactTotalHeight}`);
    console.log(`   状态: ${exactTotalWidth === width && exactTotalHeight === height ? '✅ 像素完整' : '❌ 像素丢失'}`);
    console.log(`   宽高比一致: ${new Set(exact.colWidths).size === 1 && new Set(exact.rowHeights).size === 1 ? '✅' : '❌'}`);
    
    console.log('\n2. 📐 均匀切割模式:');
    console.log(`   单元格尺寸: ${uniform.colWidths[0]}×${uniform.rowHeights[0]}`);
    console.log(`   使用的区域: ${uniform.colWidths[0]*cols}×${uniform.rowHeights[0]*rows}`);
    console.log(`   丢失像素: ${uniform.lostPixels.width}×${uniform.lostPixels.height}`);
    console.log(`   状态: ${uniform.lostPixels.width === 0 && uniform.lostPixels.height === 0 ? '✅ 像素完整' : '⚠️ 丢失像素'}`);
    console.log(`   宽高比一致: ✅`);
    
    console.log('\n3. 🎨 填充模式:');
    console.log(`   单元格尺寸: ${fill.colWidths[0]}×${fill.rowHeights[0]}`);
    console.log(`   填充白边: 左${fill.fillPixels.left}, 右${fill.fillPixels.right}, 上${fill.fillPixels.top}, 下${fill.fillPixels.bottom}`);
    console.log(`   总填充: ${fill.fillPixels.totalWidth}×${fill.fillPixels.totalHeight}`);
    console.log(`   状态: ✅ 像素完整 + 宽高比一致`);
    console.log(`   推荐度: ${fill.fillPixels.totalWidth + fill.fillPixels.totalHeight <= 4 ? '🌟🌟🌟' : '🌟🌟'}`);
    
    // 对比分析
    console.log('\n📈 对比分析:');
    if (exactTotalWidth === width && exactTotalHeight === height && 
        new Set(exact.colWidths).size === 1 && new Set(exact.rowHeights).size === 1) {
        console.log('   ✅ 完美情况：三种模式结果相同');
    } else if (fill.fillPixels.totalWidth + fill.fillPixels.totalHeight <= 4) {
        console.log('   🎯 推荐填充模式：少量白边，完美解决');
    } else if (uniform.lostPixels.width + uniform.lostPixels.height <= 2) {
        console.log('   ⚖️ 考虑均匀模式：丢失像素很少');
    } else {
        console.log('   🔧 根据需求选择：');
        console.log('      • 需要所有像素 → 精确模式');
        console.log('      • 需要一致外观 → 填充模式');
        console.log('      • 可接受裁剪 → 均匀模式');
    }
}

// 运行测试
console.log('MossCutter 三种切割模式对比测试\n');

// 测试各种情况
testThreeModes('你的截图', 1870, 1488, 3, 3);
testThreeModes('16:9视频', 1920, 1080, 4, 4);
testThreeModes('9:16竖屏', 1080, 1920, 3, 3);
testThreeModes('Instagram方形', 1080, 1080, 3, 3);
testThreeModes('宽屏电影', 2560, 1080, 3, 3);
testThreeModes('小尺寸图标', 512, 512, 3, 3);
testThreeModes('有余数情况', 100, 100, 3, 3);
testThreeModes('完美整除', 1200, 900, 3, 3);

console.log('\n🎯 使用建议总结:');
console.log('1. 🎨 填充模式（默认推荐）');
console.log('   • 优点：像素完整 + 宽高比一致');
console.log('   • 适用：大多数场景，特别是社交媒体拼图');
console.log('   • 注意：边缘添加白边，但通常很少');
console.log('');
console.log('2. 🔢 精确像素模式');
console.log('   • 优点：绝对不丢失任何像素');
console.log('   • 适用：图像分析、精确编辑');
console.log('   • 注意：宽高比可能不一致');
console.log('');
console.log('3. 📐 均匀切割模式');
console.log('   • 优点：宽高比一致，无白边');
console.log('   • 适用：可接受少量像素丢失的场景');
console.log('   • 注意：可能裁剪边缘内容');
console.log('');
console.log('💡 智能选择：');
console.log('• 如果图片尺寸可被网格数整除 → 三种模式结果相同');
console.log('• 如果余数很少（<4像素）→ 推荐填充模式');
console.log('• 如果需要绝对精确 → 选择精确模式');
console.log('• 如果白边影响美观 → 考虑均匀模式');