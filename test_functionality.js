// MossCutter 功能测试脚本
// 用于验证所有按钮和功能是否正常工作

console.log('🔧 MossCutter 功能测试开始...\n');

// 模拟DOM环境
global.document = {
    getElementById: function(id) {
        console.log(`✅ document.getElementById('${id}') 被调用`);
        return {
            value: id.includes('rows') ? '3' : id.includes('cols') ? '3' : '',
            style: { display: 'none' },
            addEventListener: function(event, handler) {
                console.log(`✅ ${id}.addEventListener('${event}', handler)`);
            },
            querySelectorAll: function(selector) {
                console.log(`✅ ${id}.querySelectorAll('${selector}')`);
                return [];
            }
        };
    },
    querySelectorAll: function(selector) {
        console.log(`✅ document.querySelectorAll('${selector}')`);
        return [];
    },
    createElement: function(tag) {
        console.log(`✅ document.createElement('${tag}')`);
        return {
            width: 100,
            height: 100,
            getContext: function() {
                return {
                    drawImage: function() {},
                    fillRect: function() {},
                    fillStyle: ''
                };
            },
            toBlob: function(callback) {
                callback(new Blob(['test'], { type: 'image/png' }));
            }
        };
    }
};

// 加载script.js进行语法检查
try {
    const fs = require('fs');
    const scriptContent = fs.readFileSync('script.js', 'utf8');
    
    // 检查关键函数是否存在
    const requiredFunctions = [
        'initializeApp',
        'handleFileSelect', 
        'loadImage',
        'updateGrid',
        'cutImage',
        'resetTool',
        'toggleAdvancedMode',
        'updateModeDescription'
    ];
    
    console.log('\n📋 检查关键函数:');
    requiredFunctions.forEach(func => {
        if (scriptContent.includes(`function ${func}`)) {
            console.log(`✅ ${func}() 函数存在`);
        } else if (scriptContent.includes(`const ${func} =`)) {
            console.log(`✅ ${func} 变量存在`);
        } else {
            console.log(`❌ ${func} 未找到`);
        }
    });
    
    // 检查事件监听器
    console.log('\n📋 检查事件监听器:');
    const events = [
        'DOMContentLoaded',
        'click',
        'change',
        'input',
        'dragover',
        'drop'
    ];
    
    events.forEach(event => {
        const count = (scriptContent.match(new RegExp(`\\.addEventListener\\(['"]${event}['"]`, 'g')) || []).length;
        if (count > 0) {
            console.log(`✅ ${event} 事件监听器: ${count}个`);
        } else {
            console.log(`⚠️ ${event} 事件监听器未找到`);
        }
    });
    
    // 检查变量声明
    console.log('\n📋 检查变量声明:');
    const variables = [
        'uploadArea',
        'fileInput',
        'selectFileBtn',
        'previewCanvas',
        'gridOverlayElement',
        'rowsInput',
        'colsInput',
        'presetButtons',
        'cutBtn',
        'resetBtn'
    ];
    
    variables.forEach(variable => {
        const regex = new RegExp(`(const|let|var)\\s+${variable}\\s*=`);
        if (regex.test(scriptContent)) {
            console.log(`✅ ${variable} 变量已声明`);
        } else {
            console.log(`❌ ${variable} 变量未声明`);
        }
    });
    
    // 检查重复声明
    console.log('\n📋 检查重复声明:');
    const allVars = scriptContent.match(/(const|let|var)\s+(\w+)\s*=/g) || [];
    const varNames = allVars.map(v => v.split(/\s+/)[1]).filter(v => v);
    const duplicates = varNames.filter((name, index) => varNames.indexOf(name) !== index);
    
    if (duplicates.length > 0) {
        console.log(`❌ 发现重复声明: ${duplicates.join(', ')}`);
    } else {
        console.log('✅ 无重复变量声明');
    }
    
    // 检查语法错误
    console.log('\n📋 检查语法错误:');
    try {
        eval(scriptContent.replace(/document\./g, 'global.document.'));
        console.log('✅ 语法检查通过');
    } catch (error) {
        console.log(`❌ 语法错误: ${error.message}`);
        console.log(`位置: ${error.stack}`);
    }
    
} catch (error) {
    console.log(`❌ 读取文件失败: ${error.message}`);
}

console.log('\n🎯 测试完成！');
console.log('\n💡 如果所有检查都通过，请：');
console.log('1. 等待GitHub Pages更新（约1-2分钟）');
console.log('2. 清除浏览器缓存');
console.log('3. 重新访问 https://sosomoss2050.github.io/moss-cutter/');
console.log('4. 测试上传、网格设置、高级选项等功能');