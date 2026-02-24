// MossCutter 按钮问题诊断脚本
// 在浏览器Console中运行这些命令

console.log('🔍 MossCutter 按钮问题诊断');
console.log('==========================');

// 1. 检查按钮元素
const selectAllBtn = document.getElementById('selectAllBtn');
const deselectAllBtn = document.getElementById('deselectAllBtn');
const downloadBtn = document.getElementById('downloadBtn');
const downloadSelectedBtn = document.getElementById('downloadSelectedBtn');

console.log('✅ 按钮元素检查:');
console.log('• 全选按钮:', selectAllBtn ? '存在' : '不存在');
console.log('• 取消全选按钮:', deselectAllBtn ? '存在' : '不存在');
console.log('• 下载压缩包按钮:', downloadBtn ? '存在' : '不存在');
console.log('• 下载选中按钮:', downloadSelectedBtn ? '存在' : '不存在');

// 2. 检查按钮状态
console.log('\n✅ 按钮状态检查:');
console.log('• 全选按钮 disabled:', selectAllBtn?.disabled);
console.log('• 取消全选按钮 disabled:', deselectAllBtn?.disabled);
console.log('• 下载压缩包按钮 disabled:', downloadBtn?.disabled);
console.log('• 下载选中按钮 disabled:', downloadSelectedBtn?.disabled);

// 3. 检查事件监听器
console.log('\n✅ 事件监听器检查:');
console.log('• 全选按钮 onclick:', selectAllBtn?.onclick ? '有' : '无');
console.log('• 取消全选按钮 onclick:', deselectAllBtn?.onclick ? '有' : '无');
console.log('• 下载压缩包按钮 onclick:', downloadBtn?.onclick ? '有' : '无');
console.log('• 下载选中按钮 onclick:', downloadSelectedBtn?.onclick ? '有' : '无');

// 4. 检查全局变量
console.log('\n✅ 全局变量检查:');
console.log('• window.pieceInfo:', window.pieceInfo ? `有 ${window.pieceInfo.length} 个片段` : '无');
console.log('• window.selectedPieces:', window.selectedPieces ? `有 ${window.selectedPieces.size} 个选中` : '无');
console.log('• window.currentZip:', window.currentZip ? '有' : '无');

// 5. 测试函数是否存在
console.log('\n✅ 函数存在检查:');
console.log('• downloadZip 函数:', typeof downloadZip === 'function' ? '存在' : '不存在');
console.log('• toggleSelectPiece 函数:', typeof toggleSelectPiece === 'function' ? '存在' : '不存在');
console.log('• downloadSelectedPieces 函数:', typeof downloadSelectedPieces === 'function' ? '存在' : '不存在');

// 6. 添加测试事件监听器
console.log('\n✅ 添加测试事件监听器:');

// 测试全选按钮
if (selectAllBtn) {
    selectAllBtn.addEventListener('click', function() {
        console.log('🎯 全选按钮被点击了！');
        console.log('• 当前选中数量:', window.selectedPieces?.size || 0);
        console.log('• 总片段数量:', window.pieceInfo?.length || 0);
    }, { once: true });
}

// 测试取消全选按钮
if (deselectAllBtn) {
    deselectAllBtn.addEventListener('click', function() {
        console.log('🎯 取消全选按钮被点击了！');
        console.log('• 当前选中数量:', window.selectedPieces?.size || 0);
    }, { once: true });
}

// 测试下载压缩包按钮
if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
        console.log('🎯 下载压缩包按钮被点击了！');
        console.log('• window.currentZip:', window.currentZip ? '有' : '无');
    }, { once: true });
}

console.log('\n🎯 现在请点击按钮测试:');
console.log('1. 点击"全选"按钮 - 查看Console输出');
console.log('2. 点击"取消全选"按钮 - 查看Console输出');
console.log('3. 点击"下载压缩包"按钮 - 查看Console输出');
console.log('4. 如果Console有输出，说明事件监听器工作');
console.log('5. 如果Console无输出，说明事件监听器有问题');

// 7. 手动测试函数
console.log('\n✅ 手动测试函数（可选）:');
console.log('• 运行 toggleSelectPiece(0) 测试选择第一个片段');
console.log('• 运行 downloadZip() 测试下载功能');
console.log('• 运行 downloadSelectedPieces() 测试下载选中功能');

console.log('\n🔧 诊断完成！请根据上面的信息排查问题。');