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
const cuttingModeSelect = document.getElementById('cuttingMode');
const modeDescription = document.getElementById('modeDescription');
const toggleAdvancedBtn = document.getElementById('toggleAdvanced');
const simpleMode = document.getElementById('simpleMode');
const advancedMode = document.getElementById('advancedMode');
const smartRecommendation = document.getElementById('smartRecommendation');
const recommendationDetails = document.getElementById('recommendationDetails');
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
    
    // 网格设置 - 优化输入体验
    rowsInput.addEventListener('blur', updateGrid);
    colsInput.addEventListener('blur', updateGrid);
    
    // 输入时实时更新，但更智能
    rowsInput.addEventListener('input', handleGridInput);
    colsInput.addEventListener('input', handleGridInput);
    
    // 也监听change事件（用户按回车或选择其他元素时）
    rowsInput.addEventListener('change', updateGrid);
    colsInput.addEventListener('change', updateGrid);
    
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
    
    // 高级选项切换
    toggleAdvancedBtn.addEventListener('click', toggleAdvancedMode);
    
    // 切割模式变化
    cuttingModeSelect.addEventListener('change', updateModeDescription);
    
    // 初始化模式描述
    updateModeDescription();
    
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
    // 先显示预览区域
    previewSection.style.display = 'block';
    
    // 使用setTimeout确保DOM已渲染，可以获取正确的宽度
    setTimeout(() => {
        // 设置画布尺寸 - 使用可靠的方法获取可用宽度
        const previewContainer = canvas.parentElement;
        
        // 方法1：使用父容器的宽度（更可靠）
        const container = document.querySelector('.container');
        let availableWidth = container ? container.clientWidth - 80 : 600; // 减去左右padding
        
        // 方法2：使用窗口宽度作为后备
        if (availableWidth < 300) {
            availableWidth = Math.min(800, window.innerWidth - 100);
        }
        
        const maxHeight = 500; // 最大高度
        
        let width = img.width;
        let height = img.height;
        
        // 计算缩放比例，保持宽高比
        const widthRatio = availableWidth / width;
        const heightRatio = maxHeight / height;
        const scale = Math.min(widthRatio, heightRatio, 1); // 不超过原始尺寸
        
        width = Math.floor(width * scale);
        height = Math.floor(height * scale);
        
        // 设置画布尺寸
        canvas.width = width;
        canvas.height = height;
        
        // 绘制图片
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, width, height);
        
        // 更新图片信息
        const scalePercent = (scale * 100).toFixed(1);
        imageInfo.textContent = `原始尺寸: ${img.width} × ${img.height} | 预览缩放: ${scalePercent}% (${width} × ${height}) | 格式: ${img.src.split(';')[0].split('/')[1]}`;
        
        // 显示智能推荐
        showSmartRecommendations(img.width, img.height);
        
        // 更新网格
        updateGrid();
        
        // 保存原始图片引用，用于窗口大小变化时重新计算
        window.currentDisplayedImage = img;
        window.currentDisplayScale = scale;
        
    }, 50); // 50ms延迟确保渲染完成
}

// 处理网格输入（实时反馈，但不强制验证）
function handleGridInput(e) {
    if (!originalImage) return;
    
    const input = e.target;
    const value = input.value;
    
    // 如果输入为空或只是负号，允许继续输入
    if (value === '' || value === '-') {
        return;
    }
    
    // 尝试转换为数字
    const num = parseInt(value);
    
    // 如果是有效数字且在范围内，实时更新网格
    if (!isNaN(num) && num >= 1 && num <= 10) {
        if (input.id === 'rows') {
            currentRows = num;
        } else {
            currentCols = num;
        }
        
        // 实时更新网格预览（但不强制修改输入框值）
        drawGrid();
    }
    // 如果数字无效或超出范围，不立即纠正，等用户完成输入
}

// 窗口大小变化时重新计算预览和网格
function handleWindowResize() {
    if (window.currentDisplayedImage && canvas) {
        // 重新显示图片以适配新的大小
        displayImage(window.currentDisplayedImage);
    }
    
    // 如果网格已存在，重新绘制以确保位置正确
    if (gridOverlay.children.length > 0) {
        drawGrid();
    }
}

// 添加窗口大小变化监听
window.addEventListener('resize', handleWindowResize);

// 更新网格
function updateGrid() {
    if (!originalImage) return;
    
    // 获取原始输入值（不立即转换）
    let rowsValue = rowsInput.value;
    let colsValue = colsInput.value;
    
    // 特殊处理：如果用户正在输入（比如输入"2"但还未完成），不立即验证
    // 只有当值看起来像完整数字时才验证
    
    // 处理行数
    if (rowsValue === '' || rowsValue === '-') {
        // 用户正在输入，保持当前值不变
    } else {
        const rowsNum = parseInt(rowsValue);
        if (!isNaN(rowsNum)) {
            // 有效数字，进行范围限制
            currentRows = Math.max(1, Math.min(10, rowsNum));
            rowsInput.value = currentRows; // 更新显示
        } else {
            // 无效输入，恢复之前的值
            rowsInput.value = currentRows;
        }
    }
    
    // 处理列数（同样的逻辑）
    if (colsValue === '' || colsValue === '-') {
        // 用户正在输入，保持当前值不变
    } else {
        const colsNum = parseInt(colsValue);
        if (!isNaN(colsNum)) {
            // 有效数字，进行范围限制
            currentCols = Math.max(1, Math.min(10, colsNum));
            colsInput.value = currentCols; // 更新显示
        } else {
            // 无效输入，恢复之前的值
            colsInput.value = currentCols;
        }
    }
    
    drawGrid();
}

// 绘制网格
function drawGrid() {
    if (!canvas || !ctx) return;
    
    // 清空之前的网格
    gridOverlay.innerHTML = '';
    
    const width = canvas.width;
    const height = canvas.height;
    
    // 最简单可靠的方法：网格覆盖层使用与canvas相同的定位
    // canvas使用 margin: 0 auto 居中，所以网格覆盖层也应该这样
    
    // 重置网格覆盖层样式
    gridOverlay.style.position = 'absolute';
    gridOverlay.style.left = '0';
    gridOverlay.style.right = '0';
    gridOverlay.style.margin = '0 auto';
    gridOverlay.style.width = `${width}px`;
    gridOverlay.style.height = `${height}px`;
    gridOverlay.style.top = '20px'; // 匹配.preview-container的padding-top
    
    // 计算网格线位置（使用浮点数确保精确）
    const cellWidth = width / currentCols;
    const cellHeight = height / currentRows;
    
    // 绘制垂直线
    for (let i = 1; i < currentCols; i++) {
        const x = i * cellWidth;
        const line = document.createElement('div');
        line.className = 'grid-line vertical';
        line.style.left = `${x}px`;
        line.style.top = '0';
        line.style.height = `${height}px`;
        gridOverlay.appendChild(line);
    }
    
    // 绘制水平线
    for (let i = 1; i < currentRows; i++) {
        const y = i * cellHeight;
        const line = document.createElement('div');
        line.className = 'grid-line horizontal';
        line.style.top = `${y}px`;
        line.style.left = '0';
        line.style.width = `${width}px`;
        gridOverlay.appendChild(line);
    }
    
    // 可选：绘制网格单元格用于调试
    if (window.debugMode) {
        for (let row = 0; row < currentRows; row++) {
            for (let col = 0; col < currentCols; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.style.left = `${col * cellWidth}px`;
                cell.style.top = `${row * cellHeight}px`;
                cell.style.width = `${cellWidth}px`;
                cell.style.height = `${cellHeight}px`;
                cell.style.border = '1px dashed rgba(255, 0, 0, 0.3)';
                cell.style.boxSizing = 'border-box';
                cell.style.position = 'absolute';
                cell.style.pointerEvents = 'none';
                gridOverlay.appendChild(cell);
            }
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
    const mode = cuttingModeSelect.value;
    
    // 创建画布用于切割
    const sourceCanvas = document.createElement('canvas');
    const sourceCtx = sourceCanvas.getContext('2d');
    
    // 使用原始图片尺寸以获得最佳质量
    sourceCanvas.width = originalImage.width;
    sourceCanvas.height = originalImage.height;
    sourceCtx.drawImage(originalImage, 0, 0);
    
    let colWidths, rowHeights, colStarts, rowStarts;
    let lostPixels = { width: 0, height: 0 };
    let fillPixels = { left: 0, right: 0, top: 0, bottom: 0, totalWidth: 0, totalHeight: 0 };
    
    if (mode === 'exact') {
        // 模式1：精确像素模式（不丢失任何像素）
        ({ colWidths, rowHeights, colStarts, rowStarts } = calculateExactCut(
            originalImage.width, originalImage.height, rows, cols
        ));
    } else if (mode === 'uniform') {
        // 模式2：均匀切割模式（保持宽高比）
        ({ colWidths, rowHeights, colStarts, rowStarts, lostPixels } = calculateUniformCut(
            originalImage.width, originalImage.height, rows, cols
        ));
    } else {
        // 模式3：填充模式（添加白边，保持宽高比，不丢失像素）
        ({ colWidths, rowHeights, colStarts, rowStarts, fillPixels } = calculateFillCut(
            originalImage.width, originalImage.height, rows, cols
        ));
    }
    
    // 显示切割信息
    displayCutInfo(mode, originalImage.width, originalImage.height, rows, cols, 
                   colWidths, rowHeights, lostPixels, fillPixels);
    
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
            
            if (mode === 'fill') {
                // 填充模式：先填充白色背景
                pieceCtx.fillStyle = 'white';
                pieceCtx.fillRect(0, 0, currentCellWidth, currentCellHeight);
                
                // 计算实际图片区域（排除填充）
                const imageStartX = Math.max(0, -startX);
                const imageStartY = Math.max(0, -startY);
                const imageWidth = Math.min(currentCellWidth, sourceCanvas.width - startX);
                const imageHeight = Math.min(currentCellHeight, sourceCanvas.height - startY);
                
                // 只绘制图片部分（如果有）
                if (imageWidth > 0 && imageHeight > 0) {
                    pieceCtx.drawImage(
                        sourceCanvas,
                        Math.max(0, startX),      // 源x
                        Math.max(0, startY),      // 源y
                        imageWidth,               // 源宽度
                        imageHeight,              // 源高度
                        imageStartX,              // 目标x
                        imageStartY,              // 目标y
                        imageWidth,               // 目标宽度
                        imageHeight               // 目标高度
                    );
                }
            } else {
                // 精确模式和均匀模式：直接复制区域
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
            }
            
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

// 智能推荐切割方案
function recommendCuttingOptions(width, height) {
    const recommendations = [];
    
    // 计算宽高比
    const aspectRatio = width / height;
    const isLandscape = aspectRatio >= 1; // 横屏
    const isPortrait = aspectRatio < 1;   // 竖屏
    
    // 推荐1：基于总像素数（目标：每个切片约50-200万像素）
    const totalPixels = width * height;
    const targetPixelsPerPiece = 1000000; // 100万像素/切片
    
    let recommendedPieces = Math.round(totalPixels / targetPixelsPerPiece);
    recommendedPieces = Math.max(4, Math.min(36, recommendedPieces)); // 限制在4-36片
    
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
    
    // 推荐2：社交媒体常用（Instagram九宫格）
    recommendations.push({
        name: '九宫格',
        rows: 3,
        cols: 3,
        pieces: 9,
        reason: '社交媒体常用，适合拼图分享',
        type: 'social'
    });
    
    // 推荐3：根据宽高比推荐
    if (aspectRatio > 1.5) { // 很宽的图片
        recommendations.push({
            name: '宽屏适配',
            rows: 2,
            cols: 4,
            pieces: 8,
            reason: '适合宽屏图片，保持比例',
            type: 'wide'
        });
    } else if (aspectRatio < 0.67) { // 很长的图片
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

// 显示智能推荐
function showSmartRecommendations(width, height) {
    const recommendations = recommendCuttingOptions(width, height);
    
    // 更新智能推荐按钮
    const smartBtn = document.querySelector('[data-type="smart"]');
    if (smartBtn && recommendations[0]) {
        const rec = recommendations[0];
        smartBtn.innerHTML = `<i class="fas fa-brain"></i> ${rec.rows}×${rec.cols}`;
        smartBtn.dataset.rows = rec.rows;
        smartBtn.dataset.cols = rec.cols;
    }
    
    // 显示推荐详情
    let detailsHTML = '';
    recommendations.forEach((rec, index) => {
        const isActive = index === 0 ? 'style="background: rgba(99, 102, 241, 0.1);"' : '';
        detailsHTML += `
            <div ${isActive} style="padding: 8px 12px; margin: 4px 0; border-radius: 6px; cursor: pointer;"
                 onclick="applyRecommendation(${rec.rows}, ${rec.cols})">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${rec.name}</strong> (${rec.rows}×${rec.cols})
                        <div style="font-size: 0.85rem; color: #6b7280; margin-top: 2px;">
                            ${rec.reason}
                        </div>
                    </div>
                    <span style="background: #6366f1; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.85rem;">
                        ${rec.pieces}片
                    </span>
                </div>
            </div>
        `;
    });
    
    recommendationDetails.innerHTML = detailsHTML;
    smartRecommendation.style.display = 'block';
}

// 应用推荐
function applyRecommendation(rows, cols) {
    rowsInput.value = rows;
    colsInput.value = cols;
    updateGrid();
    
    // 高亮显示当前选择
    const recommendationDivs = recommendationDetails.querySelectorAll('div');
    recommendationDivs.forEach(div => {
        const text = div.textContent;
        if (text.includes(`${rows}×${cols}`)) {
            div.style.background = 'rgba(99, 102, 241, 0.15)';
            div.style.border = '1px solid #6366f1';
        } else {
            div.style.background = '';
            div.style.border = 'none';
        }
    });
}

// 切换高级选项
function toggleAdvancedMode() {
    const isAdvanced = advancedMode.style.display === 'block';
    
    if (isAdvanced) {
        // 切换到简单模式
        advancedMode.style.display = 'none';
        simpleMode.style.display = 'block';
        toggleAdvancedBtn.innerHTML = '<i class="fas fa-cog"></i> 高级选项';
        toggleAdvancedBtn.classList.remove('btn-primary');
        toggleAdvancedBtn.classList.add('btn-outline');
    } else {
        // 切换到高级模式
        advancedMode.style.display = 'block';
        simpleMode.style.display = 'none';
        toggleAdvancedBtn.innerHTML = '<i class="fas fa-times"></i> 关闭高级';
        toggleAdvancedBtn.classList.remove('btn-outline');
        toggleAdvancedBtn.classList.add('btn-primary');
    }
}

// 更新切割模式描述
function updateModeDescription() {
    const mode = cuttingModeSelect.value;
    let description = '';
    
    if (mode === 'fill') {
        description = '智能模式会自动添加少量白边，确保所有切片大小一致且不丢失像素';
    } else if (mode === 'uniform') {
        description = '裁剪模式会裁剪图片边缘，确保所有切片比例一致，但可能丢失少量像素';
    } else {
        description = '精确模式保证不丢失任何像素，但切片大小可能不一致';
    }
    
    if (modeDescription) {
        modeDescription.textContent = description;
    }
}

// 计算精确像素切割（不丢失任何像素）
function calculateExactCut(width, height, rows, cols) {
    // 基础单元格尺寸
    const baseCellWidth = Math.floor(width / cols);
    const baseCellHeight = Math.floor(height / rows);
    
    // 计算余数
    const widthRemainder = width % cols;
    const heightRemainder = height % rows;
    
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
    
    return { colWidths, rowHeights, colStarts, rowStarts };
}

// 计算均匀切割（保持宽高比）
function calculateUniformCut(width, height, rows, cols) {
    // 计算理想的单元格尺寸（保持宽高比）
    const idealCellWidth = Math.floor(width / cols);
    const idealCellHeight = Math.floor(height / rows);
    
    // 为了保持宽高比一致，我们需要调整尺寸
    // 方法：所有单元格使用相同的尺寸，可能会丢失边缘像素
    const uniformCellWidth = Math.floor(width / cols);
    const uniformCellHeight = Math.floor(height / rows);
    
    // 计算实际使用的总尺寸
    const usedWidth = uniformCellWidth * cols;
    const usedHeight = uniformCellHeight * rows;
    
    // 计算丢失的像素
    const lostWidth = width - usedWidth;
    const lostHeight = height - usedHeight;
    
    // 计算起始位置（居中显示）
    const startX = Math.floor(lostWidth / 2);
    const startY = Math.floor(lostHeight / 2);
    
    // 所有单元格尺寸相同
    const colWidths = Array(cols).fill(uniformCellWidth);
    const rowHeights = Array(rows).fill(uniformCellHeight);
    
    // 计算起始位置
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

// 计算填充模式（添加白边，保持宽高比，不丢失像素）
function calculateFillCut(width, height, rows, cols) {
    // 计算基础单元格尺寸（向下取整）
    const baseCellWidth = Math.floor(width / cols);
    const baseCellHeight = Math.floor(height / rows);
    
    // 计算需要填充的空白
    const totalUsedWidth = baseCellWidth * cols;
    const totalUsedHeight = baseCellHeight * rows;
    const fillWidth = width - totalUsedWidth;
    const fillHeight = height - totalUsedHeight;
    
    // 计算填充分布（均匀分配到边缘）
    const leftFill = Math.floor(fillWidth / 2);
    const rightFill = fillWidth - leftFill;
    const topFill = Math.floor(fillHeight / 2);
    const bottomFill = fillHeight - topFill;
    
    // 所有单元格尺寸相同（包含填充区域）
    const colWidths = Array(cols).fill(baseCellWidth);
    const rowHeights = Array(rows).fill(baseCellHeight);
    
    // 计算起始位置（考虑填充）
    const colStarts = [];
    const rowStarts = [];
    
    // 列起始位置（左边有填充）
    let currentX = leftFill;
    for (let col = 0; col < cols; col++) {
        colStarts[col] = currentX;
        currentX += baseCellWidth;
    }
    
    // 行起始位置（上边有填充）
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

// 显示切割信息
function displayCutInfo(mode, width, height, rows, cols, colWidths, rowHeights, 
                       lostPixels = { width: 0, height: 0 }, 
                       fillPixels = { left: 0, right: 0, top: 0, bottom: 0, totalWidth: 0, totalHeight: 0 }) {
    const cutInfo = document.getElementById('cutInfo');
    if (!cutInfo) return;
    
    let infoHTML = '';
    const totalWidth = colWidths.reduce((sum, w) => sum + w, 0);
    const totalHeight = rowHeights.reduce((sum, h) => sum + h, 0);
    
    if (mode === 'exact') {
        const widthConsistent = new Set(colWidths).size === 1;
        const heightConsistent = new Set(rowHeights).size === 1;
        const consistentStatus = widthConsistent && heightConsistent ? 
            '<span style="color: #10b981;">✅ 所有切片大小一致</span>' : 
            '<span style="color: #f59e0b;">⚠️ 切片大小可能不一致</span>';
        
        infoHTML = `
            <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1)); 
                        padding: 16px; border-radius: 12px; border-left: 4px solid #3b82f6; margin-bottom: 20px;">
                <strong style="display: block; margin-bottom: 8px; color: #1e40af;">
                    <i class="fas fa-ruler-combined"></i> 精确模式
                </strong>
                <div style="font-size: 0.95rem; line-height: 1.6;">
                    • 图片尺寸: <strong>${width} × ${height}</strong><br>
                    • 切割网格: <strong>${rows} × ${cols}</strong><br>
                    • ${consistentStatus}<br>
                    • <span style="color: #10b981;"><i class="fas fa-check-circle"></i> 保留所有原始像素</span><br>
                    • <span style="color: #f59e0b;"><i class="fas fa-exclamation-triangle"></i> 适合专业图像处理</span><br>
                    <div style="margin-top: 8px; padding: 8px; background: rgba(59, 130, 246, 0.05); border-radius: 6px;">
                        <i class="fas fa-info-circle" style="color: #3b82f6;"></i>
                        <span style="color: #6b7280; font-size: 0.9rem;">
                            此模式保证不丢失任何像素，适合需要精确处理的场景
                        </span>
                    </div>
                </div>
            </div>
        `;
    } else if (mode === 'uniform') {
        const lostInfo = lostPixels.width > 0 || lostPixels.height > 0 ? 
            `• 裁剪边缘: <strong>${lostPixels.width}px 宽度, ${lostPixels.height}px 高度</strong><br>` : 
            '• <span style="color: #10b981;">✅ 无需裁剪</span><br>';
        
        infoHTML = `
            <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1)); 
                        padding: 16px; border-radius: 12px; border-left: 4px solid #f59e0b; margin-bottom: 20px;">
                <strong style="display: block; margin-bottom: 8px; color: #92400e;">
                    <i class="fas fa-crop-alt"></i> 裁剪模式
                </strong>
                <div style="font-size: 0.95rem; line-height: 1.6;">
                    • 图片尺寸: <strong>${width} × ${height}</strong><br>
                    • 切割网格: <strong>${rows} × ${cols}</strong><br>
                    • 每个切片: <strong>${colWidths[0]} × ${rowHeights[0]}</strong> (大小一致)<br>
                    ${lostInfo}
                    • <span style="color: #10b981;"><i class="fas fa-check-circle"></i> 所有切片比例相同</span><br>
                    • <span style="color: #f59e0b;"><i class="fas fa-exclamation-triangle"></i> 可能丢失边缘内容</span><br>
                    <div style="margin-top: 8px; padding: 8px; background: rgba(245, 158, 11, 0.05); border-radius: 6px;">
                        <i class="fas fa-info-circle" style="color: #f59e0b;"></i>
                        <span style="color: #6b7280; font-size: 0.9rem;">
                            此模式会裁剪图片边缘，确保所有切片大小一致且无白边
                        </span>
                    </div>
                </div>
            </div>
        `;
    } else {
        // 智能模式（填充模式）
        const hasFill = fillPixels.totalWidth > 0 || fillPixels.totalHeight > 0;
        let fillInfo = '';
        
        if (hasFill) {
            const fillDetails = [];
            if (fillPixels.left > 0) fillDetails.push(`左${fillPixels.left}px`);
            if (fillPixels.right > 0) fillDetails.push(`右${fillPixels.right}px`);
            if (fillPixels.top > 0) fillDetails.push(`上${fillPixels.top}px`);
            if (fillPixels.bottom > 0) fillDetails.push(`下${fillPixels.bottom}px`);
            
            fillInfo = `• 自动添加白边: ${fillDetails.join(', ')}<br>`;
        } else {
            fillInfo = '• <span style="color: #10b981;">完美匹配，无需添加白边</span><br>';
        }
        
        infoHTML = `
            <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1)); 
                        padding: 16px; border-radius: 12px; border-left: 4px solid #10b981; margin-bottom: 20px;">
                <strong style="display: block; margin-bottom: 8px; color: #065f46;">
                    <i class="fas fa-magic"></i> 智能切割模式
                </strong>
                <div style="font-size: 0.95rem; line-height: 1.6;">
                    • 图片尺寸: <strong>${width} × ${height}</strong><br>
                    • 切割网格: <strong>${rows} × ${cols}</strong><br>
                    • 每个切片: <strong>${colWidths[0]} × ${rowHeights[0]}</strong> (大小一致)<br>
                    ${fillInfo}
                    • <span style="color: #10b981;"><i class="fas fa-check-circle"></i> 保持所有原始像素</span><br>
                    • <span style="color: #10b981;"><i class="fas fa-check-circle"></i> 所有切片比例相同</span><br>
                    • <span style="color: #10b981;"><i class="fas fa-check-circle"></i> 适合社交媒体拼图</span><br>
                    <div style="margin-top: 8px; padding: 8px; background: rgba(16, 185, 129, 0.05); border-radius: 6px;">
                        <i class="fas fa-lightbulb" style="color: #f59e0b;"></i>
                        <span style="color: #6b7280; font-size: 0.9rem;">
                            这是最推荐的模式，确保最佳视觉效果
                        </span>
                    </div>
                </div>
            </div>
        `;
    }
    
    cutInfo.innerHTML = infoHTML;
    
    // 控制台输出
    console.log(`切割模式: ${mode === 'exact' ? '精确像素' : mode === 'uniform' ? '均匀切割' : '填充模式'}`);
    console.log(`图片尺寸: ${width} × ${height}`);
    console.log(`网格: ${rows} × ${cols}`);
    console.log(`列宽度分布: [${colWidths.join(', ')}]`);
    console.log(`行高度分布: [${rowHeights.join(', ')}]`);
    
    if (mode === 'uniform' && (lostPixels.width > 0 || lostPixels.height > 0)) {
        console.log(`丢失像素: 宽度 ${lostPixels.width}px, 高度 ${lostPixels.height}px`);
    }
    
    if (mode === 'fill' && (fillPixels.totalWidth > 0 || fillPixels.totalHeight > 0)) {
        console.log(`填充白边: 左${fillPixels.left}px, 右${fillPixels.right}px, 上${fillPixels.top}px, 下${fillPixels.bottom}px`);
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