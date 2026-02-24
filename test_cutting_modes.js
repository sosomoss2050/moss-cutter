// MossCutter 切割模式测试
// 测试两种切割模式：精确像素 vs 均匀切割

function testExactMode(width, height, rows, cols) {
    console.log(`\n=== 精确像素模式测试: ${width}×${height} → ${rows}×${cols} ===`);
    
    const { colWidths, rowHeights, colStarts, rowStarts } = calculateExactCut(width, height, rows, cols);
    
    const totalWidth = colWidths.reduce((sum, w) => sum + w, 0);
    const totalHeight = rowHeights.reduce((sum, h) => sum + h, 0);
    
    console.log(`列宽度: [${colWidths.join(', ')}] (总和: ${totalWidth})`);
    console.log(`行高度: [${rowHeights.join(', ')}] (总和: ${totalHeight})`);
    console.log(`列起始: [${colStarts.join(', ')}]`);
    console.log(`行起始: [${rowStarts.join(', ')}]`);
    
    const widthMatch = totalWidth === width;
    const heightMatch = totalHeight === height;
    
    console.log(`宽度匹配: ${widthMatch ? '✅' : '❌'}`);
    console.log(`高度匹配: ${heightMatch ? '✅' : '❌'}`);
    
    // 检查宽高比一致性
    const uniqueWidths = [...new Set(colWidths)];
    const uniqueHeights = [...new Set(rowHeights)];
    const uniformWidth = uniqueWidths.length === 1;
    const uniformHeight = uniqueHeights.length === 1;
    
    console.log(`宽度一致: ${uniformWidth ? '✅' : '❌'} (${uniqueWidths.length} 种尺寸)`);
    console.log(`高度一致: ${uniformHeight ? '✅' : '❌'} (${uniqueHeights.length} 种尺寸)`);
    
    return { widthMatch, heightMatch, uniformWidth, uniformHeight };
}

function testUniformMode(width, height, rows, cols) {
    console.log(`\n=== 均匀切割模式测试: ${width}×${height} → ${rows}×${cols} ===`);
    
    const { colWidths, rowHeights, colStarts, rowStarts, lostPixels } = calculateUniformCut(width, height, rows, cols);
    
    const totalWidth = colWidths.reduce((sum, w) => sum + w, 0);
    const totalHeight = rowHeights.reduce((sum, h) => sum + h, 0);
    
    console.log(`单元格尺寸: ${colWidths[0]} × ${rowHeights[0]}`);
    console.log(`使用的区域: ${totalWidth} × ${totalHeight}`);
    console.log(`丢失像素: 宽度 ${lostPixels.width}px, 高度 ${lostPixels.height}px`);
    console.log(`列起始: [${colStarts.join(', ')}]`);
    console.log(`行起始: [${rowStarts.join(', ')}]`);
    
    // 检查宽高比一致性
    const allSameWidth = colWidths.every(w => w === colWidths[0]);
    const allSameHeight = rowHeights.every(h => h === rowHeights[0]);
    
    console.log(`所有宽度相同: ${allSameWidth ? '✅' : '❌'}`);
    console.log(`所有高度相同: ${allSameHeight ? '✅' : '❌'}`);
    
    // 计算宽高比
    const aspectRatio = (colWidths[0] / rowHeights[0]).toFixed(3);
    console.log(`单元格宽高比: ${aspectRatio}:1`);
    
    return { allSameWidth, allSameHeight, lostPixels };
}

// 从script.js复制的函数（简化版）
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

// 运行测试
console.log('MossCutter 切割模式对比测试\n');

// 测试1: 你的截图（1870×1488 → 3×3）
console.log('📱 测试1: 截图 (1870×1488 → 3×3)');
const exact1 = testExactMode(1870, 1488, 3, 3);
const uniform1 = testUniformMode(1870, 1488, 3, 3);

console.log('\n📊 对比分析:');
console.log(`• 精确模式: ${exact1.uniformWidth ? '宽度一致' : '宽度不一致'}，${exact1.uniformHeight ? '高度一致' : '高度不一致'}`);
console.log(`• 均匀模式: 丢失 ${uniform1.lostPixels.width}×${uniform1.lostPixels.height} 像素，但所有单元格尺寸相同`);

// 测试2: 16:9 图片 (1920×1080 → 4×4)
console.log('\n\n🎬 测试2: 16:9 视频截图 (1920×1080 → 4×4)');
const exact2 = testExactMode(1920, 1080, 4, 4);
const uniform2 = testUniformMode(1920, 1080, 4, 4);

// 测试3: 9:16 竖屏图片 (1080×1920 → 3×3)
console.log('\n\n📱 测试3: 9:16 竖屏图片 (1080×1920 → 3×3)');
const exact3 = testExactMode(1080, 1920, 3, 3);
const uniform3 = testUniformMode(1080, 1920, 3, 3);

// 测试4: 4:3 图片 (1200×900 → 3×3)
console.log('\n\n🖼️ 测试4: 4:3 图片 (1200×900 → 3×3)');
const exact4 = testExactMode(1200, 900, 3, 3);
const uniform4 = testUniformMode(1200, 900, 3, 3);

// 测试5: 3:2 图片 (1800×1200 → 3×3)
console.log('\n\n📸 测试5: 3:2 照片 (1800×1200 → 3×3)');
const exact5 = testExactMode(1800, 1200, 3, 3);
const uniform5 = testUniformMode(1800, 1200, 3, 3);

console.log('\n\n🎯 使用建议:');
console.log('1. 精确像素模式 → 需要处理所有像素的场景（如图像分析、精确编辑）');
console.log('2. 均匀切割模式 → 社交媒体拼图、创意设计、需要一致宽高比的场景');
console.log('3. 如果图片尺寸可被网格数整除，两种模式结果相同');
console.log('4. 均匀模式丢失的像素通常很少（< 网格数），对视觉效果影响很小');