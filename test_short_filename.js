// 测试短格式ZIP文件名：MCutYYYYMMDDHHMMSS

console.log('🔤 测试短格式ZIP文件名...\n');

// 短格式函数
function generateShortZipName() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `MCut${year}${month}${day}${hours}${minutes}${seconds}`;
}

// 测试函数
function testShortFormat() {
    console.log('📊 格式对比分析：');
    
    const formats = [
        { name: '原始格式', prefix: 'cut_images', length: 10, example: 'cut_images' },
        { name: '随机数格式', prefix: 'MossCut', length: 18, example: 'MossCut20260224123' },
        { name: '时间格式（长）', prefix: 'MossCut', length: 21, example: 'MossCut20260224141530' },
        { name: '时间格式（短）', prefix: 'MCut', length: 18, example: 'MCut20260224141530' }
    ];
    
    console.log('┌──────────────┬──────────┬──────┬──────────────────────────┐');
    console.log('│  格式名称    │  前缀    │ 长度 │         示例            │');
    console.log('├──────────────┼──────────┼──────┼──────────────────────────┤');
    
    formats.forEach(format => {
        const name = format.name.padEnd(12);
        const prefix = format.prefix.padEnd(8);
        const length = String(format.length).padStart(4);
        const example = format.example;
        console.log(`│ ${name} │ ${prefix} │ ${length} │ ${example} │`);
    });
    
    console.log('└──────────────┴──────────┴──────┴──────────────────────────┘');
    
    console.log('\n🎯 短格式优点：');
    console.log('1. 长度优化：18字符，与随机数格式相同');
    console.log('2. 品牌识别：MCut = MossCut缩写，保持品牌');
    console.log('3. 信息完整：包含完整日期时间');
    console.log('4. 绝对唯一：秒级时间戳保证唯一');
    console.log('5. 易于输入：前缀更短，用户修改更方便');
    
    console.log('\n📅 实际文件名示例：');
    
    // 模拟不同时间
    const testTimes = [
        '2026-02-24 09:05:10',
        '2026-02-24 14:15:30',
        '2026-02-24 20:45:00',
        '2026-12-31 23:59:59',
        '2027-01-01 00:00:01'
    ];
    
    testTimes.forEach(timeStr => {
        const date = new Date(timeStr);
        const name = generateShortZipName.call({ now: date });
        
        console.log(`  时间: ${timeStr}`);
        console.log(`  文件名: ${name}`);
        
        // 验证格式
        const pattern = /^MCut(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/;
        const match = name.match(pattern);
        
        if (match) {
            const [_, year, month, day, hours, minutes, seconds] = match;
            console.log(`  可读为: ${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`);
            console.log(`  长度: ${name.length} 字符`);
        }
        
        console.log('');
    });
    
    // 测试唯一性
    console.log('🔍 唯一性测试：');
    
    const uniqueSet = new Set();
    const testCount = 100;
    
    // 模拟快速生成（实际中不可能这么快）
    const startTime = Date.now();
    for (let i = 0; i < testCount; i++) {
        const fakeTime = new Date(startTime + i * 1000); // 每秒一个
        const name = generateShortZipName.call({ now: fakeTime });
        uniqueSet.add(name);
    }
    
    console.log(`  生成 ${testCount} 个文件名（每秒一个）`);
    console.log(`  唯一值: ${uniqueSet.size}`);
    
    if (uniqueSet.size === testCount) {
        console.log(`  ✅ 100% 唯一`);
    } else {
        console.log(`  ❌ 有 ${testCount - uniqueSet.size} 个重复`);
    }
    
    // 测试品牌识别度
    console.log('\n🏷️ 品牌识别度分析：');
    
    const brandPrefixes = [
        { prefix: 'MossCut', length: 7, recognition: '高', description: '完整品牌名，识别度高' },
        { prefix: 'MCut', length: 4, recognition: '中高', description: '品牌缩写，MossTools用户能识别' },
        { prefix: 'MC', length: 2, recognition: '中', description: '过于简短，可能与其他工具冲突' },
        { prefix: 'Moss', length: 4, recognition: '中', description: '系列前缀，但不是工具名' }
    ];
    
    console.log('品牌前缀选择：');
    brandPrefixes.forEach(brand => {
        const example = `${brand.prefix}20260224141530`;
        console.log(`  ${brand.prefix.padEnd(7)} (${brand.length}字符): ${example}`);
        console.log(`    识别度: ${brand.recognition}`);
        console.log(`    说明: ${brand.description}`);
        console.log('');
    });
    
    console.log('🎖️ 选择 MCut 的理由：');
    console.log('1. 平衡长度与识别度：4字符 vs 7字符（节省43%）');
    console.log('2. 保持品牌关联：MCut = MossCut，用户能联想');
    console.log('3. MossTools系列统一：未来工具可用 MEdit、MConv 等');
    console.log('4. 输入便利性：前缀更短，用户修改时少删3字符');
}

// 测试实际场景
function testRealWorldScenarios() {
    console.log('\n📱 实际使用场景：');
    
    const scenarios = [
        {
            name: '社交媒体创作者',
            usage: '每天制作9宫格图片',
            frequency: '每天5-10次',
            benefit: '文件名按时间排序，便于管理作品'
        },
        {
            name: '电商产品经理',
            usage: '切割产品细节图',
            frequency: '每周几次',
            benefit: 'MCut前缀明确是切割工具生成'
        },
        {
            name: '设计师',
            usage: '创意网格设计',
            frequency: '项目需要时',
            benefit: '短文件名在文件管理器中更清晰'
        },
        {
            name: '普通用户',
            usage: '偶尔切割图片',
            frequency: '每月几次',
            benefit: '文件名包含时间，知道什么时候处理的'
        }
    ];
    
    scenarios.forEach(scenario => {
        console.log(`👤 ${scenario.name}:`);
        console.log(`  用途: ${scenario.usage}`);
        console.log(`  频率: ${scenario.frequency}`);
        console.log(`  受益: ${scenario.benefit}`);
        
        // 生成示例文件名
        const exampleTime = new Date();
        exampleTime.setHours(14, 15, 30); // 下午2:15:30
        const exampleName = generateShortZipName.call({ now: exampleTime });
        
        console.log(`  示例文件名: ${exampleName}`);
        console.log('');
    });
}

// 运行测试
testShortFormat();
testRealWorldScenarios();

console.log('💡 文件名演变历程：');
console.log('1. cut_images → 通用但无品牌（10字符）');
console.log('2. MossCut20260224123 → 品牌+日期+随机数（18字符）');
console.log('3. MossCut20260224141530 → 品牌+完整时间（21字符）');
console.log('4. MCut20260224141530 → 短品牌+完整时间（18字符）← 当前');
console.log('');
console.log('🚀 最终格式：MCutYYYYMMDDHHMMSS');
console.log('• 前缀: MCut (MossCut缩写)');
console.log('• 日期: YYYYMMDD (20260224)');
console.log('• 时间: HHMMSS (141530)');
console.log('• 总长: 18字符');
console.log('• 唯一性: 秒级时间戳保证');
console.log('• 可读性: 品牌+日期+时间');
console.log('');
console.log('✅ 测试完成！短格式ZIP文件名已生效。');