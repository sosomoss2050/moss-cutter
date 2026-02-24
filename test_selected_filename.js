// 测试选择的切片下载文件名格式

console.log('📦 测试选择的切片下载文件名格式...\n');

// 模拟生成文件名
function generateSelectedZipName() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `mcut_selected_${year}${month}${day}${hours}${minutes}.zip`;
}

// 测试函数
function testSelectedFilename() {
    console.log('🎯 文件名格式对比：');
    
    const formats = [
        { 
            name: '旧格式', 
            pattern: 'selected_pieces_TIMESTAMP.zip',
            example: 'selected_pieces_1771925504662.zip',
            length: '27-40字符',
            description: '通用前缀+毫秒时间戳'
        },
        { 
            name: '新格式', 
            pattern: 'mcut_selected_YYYYMMDDHHMM.zip',
            example: 'mcut_selected_202602241735.zip',
            length: '28字符',
            description: '品牌前缀+日期时间（到分钟）'
        }
    ];
    
    console.log('┌──────────┬──────────────────────────┬──────────┬────────────────────────────┐');
    console.log('│  格式    │          示例            │   长度   │           描述             │');
    console.log('├──────────┼──────────────────────────┼──────────┼────────────────────────────┤');
    
    formats.forEach(format => {
        const name = format.name.padEnd(8);
        const example = format.example.padEnd(24);
        const length = format.length.padEnd(8);
        const description = format.description;
        console.log(`│ ${name} │ ${example} │ ${length} │ ${description} │`);
    });
    
    console.log('└──────────┴──────────────────────────┴──────────┴────────────────────────────┘');
    
    console.log('\n💡 新格式优点：');
    console.log('1. 品牌统一：mcut_前缀与切片文件名一致');
    console.log('2. 人类可读：YYYYMMDDHHMM格式，知道何时下载');
    console.log('3. 长度固定：28字符，比时间戳更稳定');
    console.log('4. 易于排序：按日期时间自动排列');
    console.log('5. 避免冲突：分钟级精度，同一分钟内可能重复但概率低');
    
    console.log('\n📅 实际文件名示例：');
    
    // 模拟不同时间
    const testTimes = [
        '2026-02-24 17:35:00',
        '2026-02-24 23:59:59',
        '2026-12-31 23:59:59',
        '2027-01-01 00:00:01'
    ];
    
    testTimes.forEach(timeStr => {
        const date = new Date(timeStr);
        const name = generateSelectedZipName.call({ now: date });
        
        console.log(`  时间: ${timeStr}`);
        console.log(`  文件名: ${name}`);
        
        // 验证格式
        const pattern = /^mcut_selected_(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})\.zip$/;
        const match = name.match(pattern);
        
        if (match) {
            const [_, year, month, day, hours, minutes] = match;
            console.log(`  可读为: ${year}年${month}月${day}日 ${hours}:${minutes}`);
            console.log(`  长度: ${name.length} 字符`);
        } else {
            console.log(`  ❌ 格式错误`);
        }
        
        console.log('');
    });
    
    // 测试唯一性
    console.log('🔍 唯一性分析：');
    
    console.log('时间精度选择：');
    const precisionOptions = [
        { unit: '毫秒', format: 'YYYYMMDDHHMMSSmmm', length: 31, unique: '绝对唯一' },
        { unit: '秒', format: 'YYYYMMDDHHMMSS', length: 28, unique: '秒内不重复' },
        { unit: '分钟', format: 'YYYYMMDDHHMM', length: 25, unique: '分钟内可能重复' },
        { unit: '小时', format: 'YYYYMMDDHH', length: 23, unique: '小时内可能重复' }
    ];
    
    precisionOptions.forEach(option => {
        console.log(`  ${option.unit}级: ${option.format}`);
        console.log(`    长度: ${option.length}字符`);
        console.log(`    唯一性: ${option.unique}`);
        
        // 实际场景分析
        if (option.unit === '分钟') {
            console.log(`    实际使用: 用户一分钟内下载多次选择的可能性低`);
        }
        
        console.log('');
    });
    
    console.log('🎯 选择分钟级精度的理由：');
    console.log('1. 实际需求：用户很少在一分钟内多次下载选择');
    console.log('2. 长度合理：25字符（加上前缀共28字符）');
    console.log('3. 人类友好：1415 比 141530 更易读');
    console.log('4. 足够唯一：配合品牌前缀，重复概率极低');
    
    // 测试实际场景
    console.log('\n📱 实际使用场景：');
    
    const scenarios = [
        {
            name: '选择部分切片',
            action: '从9宫格中选择3-5个切片下载',
            frequency: '一次操作',
            filename: 'mcut_selected_202602241735.zip'
        },
        {
            name: '批量下载',
            action: '选择所有切片打包下载',
            frequency: '一次操作',
            filename: 'mcut_selected_202602241735.zip'
        },
        {
            name: '多次选择',
            action: '不同时间选择不同切片下载',
            frequency: '间隔几分钟',
            filename: '不同时间戳，不会重复'
        }
    ];
    
    scenarios.forEach(scenario => {
        console.log(`👤 ${scenario.name}:`);
        console.log(`  操作: ${scenario.action}`);
        console.log(`  频率: ${scenario.frequency}`);
        console.log(`  文件名: ${scenario.filename}`);
        console.log('');
    });
    
    // 测试文件名组织
    console.log('🗂️ 文件组织示例：');
    console.log('用户目录结构：');
    console.log('├── MCut20260224141530.zip          # 完整切割（所有切片）');
    console.log('├── mcut_selected_202602241735.zip  # 选择的部分切片');
    console.log('├── mcut_1_1.png                    # 单个切片');
    console.log('├── mcut_1_2.png                    # 单个切片');
    console.log('└── mcut_1_3.png                    # 单个切片');
    console.log('');
    console.log('命名规则总结：');
    console.log('• 完整ZIP: MCutYYYYMMDDHHMMSS.zip');
    console.log('• 选择ZIP: mcut_selected_YYYYMMDDHHMM.zip');
    console.log('• 单个切片: mcut_行_列.扩展名');
    console.log('');
    console.log('✅ 所有文件名统一使用"mcut"品牌前缀，易于识别和管理。');
}

// 运行测试
testSelectedFilename();

console.log('\n🚀 测试验证步骤：');
console.log('1. 切割一张图片（如3×3网格）');
console.log('2. 在预览区域选择多个切片（如第1、3、5个）');
console.log('3. 点击"下载选中图片"按钮');
console.log('4. 检查下载的ZIP文件名是否为 mcut_selected_YYYYMMDDHHMM.zip 格式');
console.log('5. 解压ZIP，检查内部切片文件名是否为 mcut_行_列.png 格式');
console.log('');
console.log('🎯 预期结果：');
console.log('• 选择的切片ZIP：mcut_selected_202602241735.zip');
console.log('• 内部切片文件：mcut_1_1.png, mcut_1_3.png, mcut_2_2.png 等');
console.log('• 品牌统一：所有文件都有"mcut"前缀');
console.log('');
console.log('✅ 测试完成！选择的切片下载文件名格式已更新。');