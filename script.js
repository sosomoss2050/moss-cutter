// 全局变量
let originalImage = null;
let canvas = null;
let ctx = null;
let gridOverlay = null;
let currentRows = 3;
let currentCols = 3;

// DOM 元素
const fileInput = document.getElementById('fileInput');
const selectFileBtn = document.getElementById('selectFileBtn');
const uploadArea = document.getElementById('uploadArea');
const previewSection = document.getElementById('previewSection');
const previewCanvas = document.getElementById('previewCanvas');
const gridOverlayElement = document.getElementById('gridOverlay');
const imageInfo = document.getElementById('imageInfo');
const rowsInput = document.getElementById('rows');
const colsInput = document.getElementById('cols');
const presetButtons = document.querySelectorAll('.preset-buttons .btn');
const imageFormatSelect = document.getElementById('imageFormat');
const qualityControl = document.getElementById('qualityControl');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const fileNameInput = document.getElementById('fileName');
const cutBtn = document.getElementById('cutBtn');
const resetBtn = document.getElementById('resetBtn');
const progressSection = document.getElementById('progressSection');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const resultSection = document.getElementById('resultSection');
const gridPreview = document.getElementById('gridPreview');
const pieceCount = document.getElementById('pieceCount');
const downloadBtn = document.getElementById('downloadBtn');

// 初始化
function init() {
    canvas = previewCanvas;
    ctx = canvas.getContext('2d');
    gridOverlay = gridOverlayElement;
    
    // 事件监听器
    selectFileBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    
    // 拖放功能
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // 网格设置
    rowsInput.addEventListener('input', updateGrid);
    colsInput.addEventListener('input', updateGrid);
    
    // 预设按钮
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const rows = parseInt(btn.dataset.rows);
            const cols = parseInt(btn.dataset.cols);
            rowsInput.value = rows;
            colsInput.value = cols;
            updateGrid();
        });
    });
    
    // 输出格式变化
    imageFormatSelect.addEventListener('change', () => {
        const format = imageFormatSelect.value;
        qualityControl.style.display = format === 'jpeg' || format === 'webp' ? 'block' : 'none';
    });
    
    // 质量滑块
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value;
    });
    
    // 切割按钮
    cutBtn.addEventListener('click', cutImage);
    
    // 重置按钮
    resetBtn.addEventListener('click', resetTool);
    
    // 下载按钮
    downloadBtn.addEventListener('click', downloadZip);
    
    // 初始更新
    updateGrid();
}

// 处理文件选择
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImage(file);
    }
}

// 处理拖放
function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    uploadArea.classList.add('drag-over');
}

function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    uploadArea.classList.remove('drag-over');
}

function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    uploadArea.classList.remove('drag-over');
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImage(file);
    }
}

// 加载图片
function loadImage(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            originalImage = img;
            displayImage(img);
            cutBtn.disabled = false;
        };
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

// 显示图片
function displayImage(img) {
    // 设置画布尺寸
    const maxWidth = 600;
    const maxHeight = 400;
    
    let width = img.width;
    let height = img.height;
    
    // 保持宽高比缩放
    if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
    }
    
    if (height > maxHeight) {
        width = (maxHeight / height) * width;
        height = maxHeight;
    }
    
    canvas.width = width;
    canvas.height = height;
    
    // 绘制图片
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, width, height);
    
    // 显示预览区域
    previewSection.style.display = 'block';
    
    // 更新图片信息
    imageInfo.textContent = `尺寸: ${img.width} × ${img.height} | 格式: ${img.src.split(';')[0].split('/')[1]}`;
    
    // 更新网格
    updateGrid();
}

// 更新网格
function updateGrid() {
    if (!originalImage) return;
    
    currentRows = parseInt(rowsInput.value) || 1;
    currentCols = parseInt(colsInput.value) || 1;
    
    // 限制范围
    currentRows = Math.max(1, Math.min(10, currentRows));
    currentCols = Math.max(1, Math.min(10, currentCols));
    
    rowsInput.value = currentRows;
    colsInput.value = currentCols;
    
    drawGrid();
}

// 绘制网格
function drawGrid() {
    if (!canvas || !ctx) return;
    
    // 清空之前的网格
    gridOverlay.innerHTML = '';
    
    const width = canvas.width;
    const height = canvas.height;
    
    // 计算网格线位置（使用浮点数确保精确）
    const cellWidth = width / currentCols;
    const cellHeight = height / currentRows;
    
    // 绘制垂直线
    for (let i = 1; i < currentCols; i++) {
        const x = i * cellWidth;
        const line = document.createElement('div');
        line.className = 'grid-line vertical';
        line.style.left = `${x}px`;
        gridOverlay.appendChild(line);
    }
    
    // 绘制水平线
    for (let i = 1; i < currentRows; i++) {
        const y = i * cellHeight;
        const line = document.createElement('div');
        line.className = 'grid-line horizontal';
        line.style.top = `${y}px`;
        gridOverlay.appendChild(line);
    }
    
    // 绘制网格单元格（可选，用于调试）
    for (let row = 0; row < currentRows; row++) {
        for (let col = 0; col < currentCols; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.style.left = `${col * cellWidth}px`;
            cell.style.top = `${row * cellHeight}px`;
            cell.style.width = `${cellWidth}px`;
            cell.style.height = `${cellHeight}px`;
            gridOverlay.appendChild(cell);
        }
    }
}

// 切割图片
async function cutImage() {
    if (!originalImage) return;
    
    // 显示进度
    progressSection.style.display = 'block';
    resultSection.style.display = 'none';
    updateProgress(0, '准备切割...');
    
    const rows = currentRows;
    const cols = currentCols;
    const totalPieces = rows * cols;
    
    // 创建画布用于切割
    const sourceCanvas = document.createElement('canvas');
    const sourceCtx = sourceCanvas.getContext('2d');
    
    // 使用原始图片尺寸以获得最佳质量
    sourceCanvas.width = originalImage.width;
    sourceCanvas.height = originalImage.height;
    sourceCtx.drawImage(originalImage, 0, 0);
    
    // 计算单元格尺寸（改进算法，不丢失像素）
    // 基础单元格尺寸
    const baseCellWidth = Math.floor(originalImage.width / cols);
    const baseCellHeight = Math.floor(originalImage.height / rows);
    
    // 计算余数（需要额外分配的像素）
    const widthRemainder = originalImage.width % cols;
    const heightRemainder = originalImage.height % rows;
    
    // 存储每行/列的实际尺寸
    const colWidths = [];
    const rowHeights = [];
    
    // 计算每列的宽度（均匀分配余数）
    for (let col = 0; col < cols; col++) {
        colWidths[col] = baseCellWidth + (col < widthRemainder ? 1 : 0);
    }
    
    // 计算每行的高度（均匀分配余数）
    for (let row = 0; row < rows; row++) {
        rowHeights[row] = baseCellHeight + (row < heightRemainder ? 1 : 0);
    }
    
    // 计算起始位置
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
    
    // 显示切割信息（调试用）
    console.log('切割信息:');
    console.log(`图片尺寸: ${originalImage.width} × ${originalImage.height}`);
    console.log(`网格: ${rows} × ${cols}`);
    console.log(`基础单元格: ${baseCellWidth} × ${baseCellHeight}`);
    console.log(`宽度余数: ${widthRemainder}, 高度余数: ${heightRemainder}`);
    console.log('列宽度分布:', colWidths);
    console.log('行高度分布:', rowHeights);
    
    // 在界面上显示切割信息
    const cutInfo = document.getElementById('cutInfo');
    if (cutInfo) {
        let infoHTML = `
            <div style="background: #f0f9ff; padding: 12px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 16px;">
                <strong>切割算法信息:</strong><br>
                • 图片尺寸: ${originalImage.width} × ${originalImage.height}<br>
                • 网格: ${rows} × ${cols}<br>
                • 基础单元格: ${baseCellWidth} × ${baseCellHeight}<br>
                • 余数分配: 宽度余数 ${widthRemainder}px, 高度余数 ${heightRemainder}px<br>
                • 确保不丢失任何像素
            </div>
        `;
        cutInfo.innerHTML = infoHTML;
    }
    
    // 创建 ZIP
    const zip = new JSZip();
    const format = imageFormatSelect.value;
    const quality = format === 'jpeg' || format === 'webp' ? parseFloat(qualitySlider.value) / 100 : 1.0;
    
    // 预览网格
    gridPreview.innerHTML = '';
    const previewGridSize = Math.min(4, Math.max(rows, cols));
    gridPreview.style.gridTemplateColumns = `repeat(${previewGridSize}, 1fr)`;
    gridPreview.style.gridTemplateRows = `repeat(${previewGridSize}, 1fr)`;
    
    // 清空预览网格
    const previewGrid = document.getElementById('previewGrid');
    previewGrid.innerHTML = '';
    
    // 存储所有切片的Blob数据
    window.pieceBlobs = [];
    window.pieceInfo = [];
    
    // 切割每个单元格
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const pieceIndex = row * cols + col;
            const progress = (pieceIndex / totalPieces) * 100;
            updateProgress(progress, `切割片段 ${pieceIndex + 1}/${totalPieces}`);
            
            // 获取当前单元格的实际尺寸
            const currentCellWidth = colWidths[col];
            const currentCellHeight = rowHeights[row];
            const startX = colStarts[col];
            const startY = rowStarts[row];
            
            // 创建画布片段
            const pieceCanvas = document.createElement('canvas');
            pieceCanvas.width = currentCellWidth;
            pieceCanvas.height = currentCellHeight;
            const pieceCtx = pieceCanvas.getContext('2d');
            
            // 从源画布复制区域
            pieceCtx.drawImage(
                sourceCanvas,
                startX,               // 源x
                startY,               // 源y
                currentCellWidth,     // 源宽度
                currentCellHeight,    // 源高度
                0, 0,                 // 目标x,y
                currentCellWidth,     // 目标宽度
                currentCellHeight     // 目标高度
            );
            
            // 转换为Blob
            const blob = await new Promise(resolve => {
                pieceCanvas.toBlob(
                    blob => resolve(blob),
                    `image/${format}`,
                    quality
                );
            });
            
            // 添加到ZIP
            const fileName = `piece_${row + 1}_${col + 1}.${format}`;
            zip.file(fileName, blob);
            
            // 保存Blob数据用于预览
            window.pieceBlobs.push(blob);
            window.pieceInfo.push({
                row: row + 1,
                col: col + 1,
                index: pieceIndex,
                fileName: fileName,
                format: format
            });
            
            // 添加到预览（只显示前几个）
            if (pieceIndex < previewGridSize * previewGridSize) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(blob);
                img.alt = `片段 ${row + 1}-${col + 1}`;
                img.title = `第 ${row + 1} 行, 第 ${col + 1} 列`;
                gridPreview.appendChild(img);
            }
            
            // 小延迟以避免阻塞UI
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }
    
    // 完成
    updateProgress(100, '切割完成！');
    pieceCount.textContent = totalPieces;
    
    // 保存ZIP引用
    window.currentZip = zip;
    
    // 生成预览网格
    generatePreviewGrid();
    
    // 显示结果
    setTimeout(() => {
        progressSection.style.display = 'none';
        resultSection.style.display = 'block';
    }, 500);
}

// 更新进度
function updateProgress(percent, text) {
    progressFill.style.width = `${percent}%`;
    progressText.textContent = text;
}

// 下载ZIP
async function downloadZip() {
    if (!window.currentZip) return;
    
    updateProgress(0, '正在创建ZIP文件...');
    progressSection.style.display = 'block';
    
    try {
        const zipName = fileNameInput.value || 'cut_images';
        
        // 生成ZIP
        const content = await window.currentZip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 6
            }
        }, metadata => {
            const percent = Math.round((metadata.currentFile / metadata.total) * 100);
            updateProgress(percent, `压缩中: ${metadata.currentFile}/${metadata.total} 个文件`);
        });
        
        // 保存文件
        saveAs(content, `${zipName}.zip`);
        
        updateProgress(100, '下载完成！');
        
        setTimeout(() => {
            progressSection.style.display = 'none';
        }, 1000);
        
    } catch (error) {
        console.error('下载失败:', error);
        alert('下载失败，请重试');
        progressSection.style.display = 'none';
    }
}

// 重置工具
function resetTool() {
    // 重置文件输入
    fileInput.value = '';
    
    // 重置图片
    originalImage = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 隐藏预览和结果
    previewSection.style.display = 'none';
    resultSection.style.display = 'none';
    progressSection.style.display = 'none';
    
    // 重置网格
    rowsInput.value = 3;
    colsInput.value = 3;
    gridOverlay.innerHTML = '';
    
    // 禁用切割按钮
    cutBtn.disabled = true;
    
    // 重置输出设置
    fileNameInput.value = 'cut_images';
    imageFormatSelect.value = 'png';
    qualityControl.style.display = 'none';
    
    // 清空ZIP引用
    window.currentZip = null;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 显示品牌信息
    console.log(`
    ╔══════════════════════════════════════════╗
    ║           MossCutter v1.0.0              ║
    ║    Intelligent Image Grid Cutting Tool   ║
    ║         by SOSOMOSS LTD.                 ║
    ║      https://github.com/sosomoss         ║
    ╚══════════════════════════════════════════╝
    `);
    
    init();
});

// 添加一些工具提示
document.addEventListener('DOMContentLoaded', () => {
    // 为输入框添加提示
    const addTooltip = (element, text) => {
        element.title = text;
    };
    
    addTooltip(rowsInput, '设置网格的行数 (1-10)');
    addTooltip(colsInput, '设置网格的列数 (1-10)');
    addTooltip(fileNameInput, '设置下载的ZIP文件名');
    addTooltip(imageFormatSelect, '选择输出图片格式');
    addTooltip(qualitySlider, '设置JPEG/WebP图片质量 (1-100)');
});

// 添加键盘快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl + O 打开文件
    if (e.ctrlKey && e.key === 'o') {
        e.preventDefault();
        fileInput.click();
    }
    
    // Ctrl + R 重置
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        resetTool();
    }
    
    // Ctrl + S 切割
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (!cutBtn.disabled) {
            cutImage();
        }
    }
    
    // Ctrl + D 下载
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        if (window.currentZip) {
            downloadZip();
        }
    }
});

// ===== v1.1.0 新增功能：预览网格 =====

// 生成预览网格
function generatePreviewGrid() {
    const previewGrid = document.getElementById('previewGrid');
    previewGrid.innerHTML = '';
    
    const rows = parseInt(rowsInput.value);
    const cols = parseInt(colsInput.value);
    const totalPieces = rows * cols;
    
    // 设置网格列数
    const gridCols = Math.min(cols, 6); // 最多显示6列
    previewGrid.className = `preview-grid grid-size-${gridCols}`;
    
    // 设置预览项大小
    let previewSize = 'preview-size-medium';
    if (totalPieces > 20) previewSize = 'preview-size-small';
    if (totalPieces <= 9) previewSize = 'preview-size-large';
    
    // 生成每个预览项
    for (let i = 0; i < totalPieces; i++) {
        const piece = window.pieceInfo[i];
        const blob = window.pieceBlobs[i];
        const blobUrl = URL.createObjectURL(blob);
        
        // 创建预览项
        const previewItem = document.createElement('div');
        previewItem.className = `preview-item ${previewSize}`;
        previewItem.dataset.index = i;
        
        // 创建复选框
        const checkbox = document.createElement('div');
        checkbox.className = 'preview-checkbox';
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSelectPiece(i);
        });
        
        // 创建图片
        const img = document.createElement('img');
        img.src = blobUrl;
        img.alt = `片段 ${piece.row}-${piece.col}`;
        img.loading = 'lazy';
        
        // 创建信息覆盖层
        const infoOverlay = document.createElement('div');
        infoOverlay.className = 'preview-info-overlay';
        
        const indexSpan = document.createElement('span');
        indexSpan.className = 'preview-index';
        indexSpan.textContent = `#${i + 1} (${piece.row},${piece.col})`;
        
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'preview-download-btn';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> 下载';
        downloadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            downloadSinglePiece(i);
        });
        
        infoOverlay.appendChild(indexSpan);
        infoOverlay.appendChild(downloadBtn);
        
        // 组装预览项
        previewItem.appendChild(checkbox);
        previewItem.appendChild(img);
        previewItem.appendChild(infoOverlay);
        
        // 点击预览项切换选择
        previewItem.addEventListener('click', (e) => {
            if (e.target === checkbox || e.target === downloadBtn) return;
            toggleSelectPiece(i);
        });
        
        previewGrid.appendChild(previewItem);
    }
    
    // 初始化选择状态
    window.selectedPieces = new Set();
    
    // 绑定控制按钮事件
    bindPreviewControls();
}

// 切换选择单个片段
function toggleSelectPiece(index) {
    const previewItem = document.querySelector(`.preview-item[data-index="${index}"]`);
    const checkbox = previewItem.querySelector('.preview-checkbox');
    
    if (window.selectedPieces.has(index)) {
        window.selectedPieces.delete(index);
        previewItem.classList.remove('selected');
        checkbox.classList.remove('checked');
    } else {
        window.selectedPieces.add(index);
        previewItem.classList.add('selected');
        checkbox.classList.add('checked');
    }
    
    updateSelectedCount();
}

// 更新选中数量显示
function updateSelectedCount() {
    const downloadSelectedBtn = document.getElementById('downloadSelectedBtn');
    const count = window.selectedPieces.size;
    
    if (count > 0) {
        downloadSelectedBtn.innerHTML = `<i class="fas fa-download"></i> 下载选中 (${count})`;
        downloadSelectedBtn.disabled = false;
    } else {
        downloadSelectedBtn.innerHTML = `<i class="fas fa-download"></i> 下载选中`;
        downloadSelectedBtn.disabled = true;
    }
}

// 绑定预览控制按钮事件
function bindPreviewControls() {
    const selectAllBtn = document.getElementById('selectAllBtn');
    const deselectAllBtn = document.getElementById('deselectAllBtn');
    const downloadSelectedBtn = document.getElementById('downloadSelectedBtn');
    
    if (!selectAllBtn || !deselectAllBtn || !downloadSelectedBtn) return;
    
    // 全选
    selectAllBtn.addEventListener('click', () => {
        const totalPieces = window.pieceInfo.length;
        for (let i = 0; i < totalPieces; i++) {
            if (!window.selectedPieces.has(i)) {
                toggleSelectPiece(i);
            }
        }
    });
    
    // 取消全选
    deselectAllBtn.addEventListener('click', () => {
        window.selectedPieces.forEach(index => {
            toggleSelectPiece(index);
        });
    });
    
    // 下载选中
    downloadSelectedBtn.addEventListener('click', downloadSelectedPieces);
}

// 下载单个片段
function downloadSinglePiece(index) {
    const piece = window.pieceInfo[index];
    const blob = window.pieceBlobs[index];
    
    const fileName = piece.fileName;
    saveAs(blob, fileName);
    
    // 显示下载反馈
    showDownloadFeedback(`已下载: ${fileName}`);
}

// 下载选中片段
async function downloadSelectedPieces() {
    if (window.selectedPieces.size === 0) return;
    
    const selectedIndices = Array.from(window.selectedPieces);
    
    if (selectedIndices.length === 1) {
        // 单个文件直接下载
        downloadSinglePiece(selectedIndices[0]);
        return;
    }
    
    // 多个文件打包下载
    updateProgress(0, '正在打包选中文件...');
    document.getElementById('progressSection').style.display = 'block';
    
    try {
        const zip = new JSZip();
        let processed = 0;
        
        for (const index of selectedIndices) {
            const piece = window.pieceInfo[index];
            const blob = window.pieceBlobs[index];
            
            zip.file(piece.fileName, blob);
            
            processed++;
            const percent = Math.round((processed / selectedIndices.length) * 100);
            updateProgress(percent, `打包中: ${processed}/${selectedIndices.length}`);
            
            // 小延迟避免阻塞
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        
        // 生成ZIP
        const content = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });
        
        // 保存文件
        const zipName = `selected_pieces_${Date.now()}.zip`;
        saveAs(content, zipName);
        
        updateProgress(100, '下载完成！');
        showDownloadFeedback(`已下载 ${selectedIndices.length} 个文件`);
        
        setTimeout(() => {
            document.getElementById('progressSection').style.display = 'none';
        }, 1000);
        
    } catch (error) {
        console.error('下载失败:', error);
        alert('下载失败，请重试');
        document.getElementById('progressSection').style.display = 'none';
    }
}

// 显示下载反馈
function showDownloadFeedback(message) {
    // 创建反馈元素
    let feedback = document.getElementById('downloadFeedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.id = 'downloadFeedback';
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #48bb78;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-weight: 600;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(feedback);
        
        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    feedback.textContent = message;
    feedback.style.display = 'block';
    
    // 3秒后自动隐藏
    setTimeout(() => {
        feedback.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            feedback.style.display = 'none';
            feedback.style.animation = '';
        }, 500);
    }, 3000);
}

// 重置时清理预览数据
function resetPreviewData() {
    if (window.pieceBlobs) {
        window.pieceBlobs.forEach(blob => {
            URL.revokeObjectURL(blob);
        });
    }
    
    window.pieceBlobs = [];
    window.pieceInfo = [];
    window.selectedPieces = new Set();
    
    const previewGrid = document.getElementById('previewGrid');
    if (previewGrid) previewGrid.innerHTML = '';
}

// 修改原有的重置函数
const originalResetTool = resetTool;
resetTool = function() {
    originalResetTool();
    resetPreviewData();
};