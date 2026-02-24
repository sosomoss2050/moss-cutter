// MossCutter 智能推荐算法测试

// 从script.js复制的智能推荐函数
function recommendCuttingOptions(width, height) {
    const recommendations = [];
    
    // 计算宽高比
    const aspectRatio = width / height;
    const isLandscape = aspectRatio >= 1;
    const isPortrait = aspectRatio < 1;
    
    // 推荐1：基于总像素数
    const totalPixels = width * height;
    const targetPixelsPerPiece = 1000000; // 100万像素/切片
    
    let recommendedPieces = Math.round(totalPixels / targetPixelsPerPiece);
    recommendedPieces = Math.max(4, Math.min(36, recommendedPieces));
    
    // 根据宽高比分配行列
    let recRows, recCols;
    if (isLandscape) {
        recCols = Math.round(Math.sqrt(recommendedPieces * aspectRatio));
        recRows = Math.round(recommendedPieces / recCols);
    } else {
        recRows = Math.round(Math.sqrt(recommendedPieces / aspectRatio));
        recCols = Math.round(recommendedPieces / recRows);
    }
    
    // 确保行列数合理
    recRows = Math.max(2, Math.min(10, recRows));
    recCols = Math.max(2, Math.min(10, recCols));
    
    recommendations.push({
        name: '智能推荐',
        rows: recRows,
        cols: recCols,
        pieces: recRows * recCols,
        reason: `基于图片尺寸 (${width}×${height}) 自动计算`,
        type: 'smart'
    });
    
    // 推荐2：社交媒体常用
    recommendations.push({
        name: '九宫格',
        rows: 3,
        cols: 3,
        pieces: 9,
        reason: '社交媒体常用，适合拼图分享',
        type: 'social'
    });
    
    // 推荐3：根据宽高比推荐
    if (aspectRatio > 1.5) {
        recommendations.push({
            name: '宽屏适配',
            rows: 2,
            cols: 4,
            pieces: 8,
            reason: '适合宽屏图片，保持比例',
            type: 'wide'
        });
    } else if (aspectRatio < 0.67) {
        recommendations.push({
            name: '竖屏适配',
            rows: 4,
            cols: 2,
            pieces: 8,
            reason: '适合竖屏图片，保持比例',
            type: 'tall'
        });
    }
    
    // 推荐4：标准网格
    recommendations.push({
        name: '标准网格',
        rows: 4,
        cols: 4,
        pieces: 16,
        reason: '标准网格，适合中等尺寸图片',
        type: 'standard'
    });
    
    return recommendations;
}

// 测试函数
function testSmartRecommendation(name, width, height) {
    console.log(`\n=== ${name} (${width}×${height}) ===`);
    console.log(`宽高比: ${(width/height).toFixed(2)}:1`);
    console.log(`总像素: ${(width*height/1000000).toFixed(1)} 百万`);
    
    const recommendations = recommendCuttingOptions(width, height);
    
    console.log('\n推荐方案:');
    recommendations.forEach((rec, index) => {
        const marker = index === 0 ? '🌟' : '•';
        console.log(`${marker} ${rec.name}: ${rec.rows}×${rec.cols} (${rec.pieces}片)`);
        console.log(`  理由: ${rec.reason}`);
        
        // 计算每个切片的像素
        const pieceWidth = Math.floor(width / rec.cols);
        const pieceHeight = Math.floor(height / rec.rows);
        const piecePixels = pieceWidth * pieceHeight;
        console.log(`  切片尺寸: ~${pieceWidth}×${pieceHeight} (${(piecePixels/1000).toFixed(0)}K像素)`);
    });
}

// 运行测试
console.log('MossCutter 智能推荐算法测试\n');

// 测试各种尺寸的图片
testSmartRecommendation('手机竖屏照片', 1080, 1920);      // 9:16
testSmartRecommendation('手机横屏照片', 1920, 1080);      // 16:9
testSmartRecommendation('电脑截图', 1870, 1488);          // 你的截图
testSmartRecommendation('4K屏幕截图', 3840, 2160);        // 16:9 4K
testSmartRecommendation('Instagram方形', 1080, 1080);     // 1:1
testSmartRecommendation('宽屏电影截图', 2560, 1080);      // 21:9
testSmartRecommendation('竖屏文档', 1242, 2208);          // 9:16 iPhone
testSmartRecommendation('中等尺寸图片', 1200, 800);       // 3:2
testSmartRecommendation('小尺寸图标', 512, 512);          // 1:1 小图
testSmartRecommendation('超大图片', 6000, 4000);          // 3:2 大图

console.log('\n🎯 算法原理:');
console.log('1. 基于总像素数计算推荐切片数量');
console.log('2. 根据宽高比智能分配行列');
console.log('3. 提供多种预设方案供选择');
console.log('4. 确保每个切片大小适中（约50-200万像素）');

console.log('\n📱 使用场景:');
console.log('• 社交媒体拼图 → 选择九宫格 (3×3)');
console.log('• 宽屏图片 → 选择宽屏适配 (2×4)');
console.log('• 竖屏图片 → 选择竖屏适配 (4×2)');
console.log('• 不确定 → 点击"智能推荐"按钮');

console.log('\n💡 用户体验:');
console.log('1. 上传图片后立即显示推荐方案');
console.log('2. 点击推荐方案自动设置网格');
console.log('3. 仍然可以手动调整行列数');
console.log('4. 提供详细的推荐理由');