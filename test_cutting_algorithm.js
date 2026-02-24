// MossCutter 切割算法测试
// 测试新的切割算法是否正确处理像素分配

function testCuttingAlgorithm(width, height, rows, cols) {
    console.log(`\n=== 测试: ${width}×${height} 图片, ${rows}×${cols} 网格 ===`);
    
    // 基础单元格尺寸
    const baseCellWidth = Math.floor(width / cols);
    const baseCellHeight = Math.floor(height / rows);
    
    // 计算余数
    const widthRemainder = width % cols;
    const heightRemainder = height % rows;
    
    // 计算每列/行的实际尺寸
    const colWidths = [];
    const rowHeights = [];
    
    for (let col = 0; col < cols; col++) {
        colWidths[col] = baseCellWidth + (col < widthRemainder ? 1 : 0);
    }
    
    for (let row = 0; row < rows; row++) {
        rowHeights[row] = baseCellHeight + (row < heightRemainder ? 1 : 0);
    }
    
    // 验证总宽度/高度
    const totalWidth = colWidths.reduce((sum, w) => sum + w, 0);
    const totalHeight = rowHeights.reduce((sum, h) => sum + h, 0);
    
    console.log(`基础单元格: ${baseCellWidth}×${baseCellHeight}`);
    console.log(`宽度余数: ${widthRemainder}, 高度余数: ${heightRemainder}`);
    console.log(`列宽度分布: [${colWidths.join(', ')}]`);
    console.log(`行高度分布: [${rowHeights.join(', ')}]`);
    console.log(`计算总宽度: ${totalWidth} (原始: ${width})`);
    console.log(`计算总高度: ${totalHeight} (原始: ${height})`);
    
    // 验证是否匹配
    const widthMatch = totalWidth === width;
    const heightMatch = totalHeight === height;
    
    console.log(`宽度匹配: ${widthMatch ? '✅' : '❌'}`);
    console.log(`高度匹配: ${heightMatch ? '✅' : '❌'}`);
    
    return widthMatch && heightMatch;
}

// 测试用例
console.log('MossCutter 切割算法测试\n');

// 测试1: 你的截图尺寸
testCuttingAlgorithm(1870, 1488, 3, 3);

// 测试2: 可整除的情况
testCuttingAlgorithm(1200, 800, 4, 3);

// 测试3: 有余数的情况
testCuttingAlgorithm(1920, 1080, 5, 5);

// 测试4: 大尺寸图片
testCuttingAlgorithm(4000, 3000, 10, 10);

// 测试5: 小尺寸图片
testCuttingAlgorithm(100, 100, 3, 3);

// 测试6: 极端情况
testCuttingAlgorithm(7, 7, 3, 3);

console.log('\n=== 算法说明 ===');
console.log('1. 基础单元格尺寸 = Math.floor(图片尺寸 / 网格数)');
console.log('2. 余数 = 图片尺寸 % 网格数');
console.log('3. 前N个单元格获得额外1像素（N = 余数）');
console.log('4. 确保所有像素都被分配，不丢失任何像素');