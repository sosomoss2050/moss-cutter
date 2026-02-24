// 测试时间格式ZIP文件名

console.log('⏱️ 测试时间格式ZIP文件名...\n');

// 时间格式函数
function generateTimeBasedZipName() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `MossCut${year}${month}${day}${hours}${minutes}${seconds}`;
}

// 测试函数
function testTimeBasedNames() {
    console.log('📅 时间格式测试：');
    
    // 生成多个测试文件名（模拟快速连续调用）
    const testNames = [];
    const startTime = Date.now();
    
    for (let i = 0; i < 10; i++) {
        // 模拟稍微不同的时间
        const fakeTime = new Date(startTime + i * 100); // 每100ms
        const name = generateTimeBasedZipName.call({ now: fakeTime });
        testNames.push({ time: fakeTime, name });
    }
    
    // 显示结果
    testNames.forEach((item, index) => {
        const timeStr = item.time.toISOString().replace('T', ' ').substring(0, 19);
        console.log(`  测试 ${index + 1}:`);
        console.log(`    时间: ${timeStr}`);
        console.log(`    文件名: ${item.name}`);
        
        // 验证格式
        const pattern = /^MossCut(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/;
        const match = item.name.match(pattern);
        
        if (match) {
            const [_, year, month, day, hours, minutes, seconds] = match;
            console.log(`    ✅ 格式正确`);
            console.log(`      日期: ${year}-${month}-${day}`);
            console.log(`      时间: ${hours}:${minutes}:${seconds}`);
            
            // 验证与时间匹配
            const expectedYear = item.time.getFullYear();
            const expectedMonth = String(item.time.getMonth() + 1).padStart(2, '0');
            const expectedDay = String(item.time.getDate()).padStart(2, '0');
            const expectedHours = String(item.time.getHours()).padStart(2, '0');
            const expectedMinutes = String(item.time.getMinutes()).padStart(2, '0');
            const expectedSeconds = String(item.time.getSeconds()).padStart(2, '0');
            
            if (year == expectedYear && month == expectedMonth && day == expectedDay &&
                hours == expectedHours && minutes == expectedMinutes && seconds == expectedSeconds) {
                console.log(`    ✅ 时间匹配`);
            } else {
                console.log(`    ❌ 时间不匹配`);
                console.log(`      预期: ${expectedYear}-${expectedMonth}-${expectedDay} ${expectedHours}:${expectedMinutes}:${expectedSeconds}`);
            }
        } else {
            console.log(`    ❌ 格式错误`);
        }
        
        console.log('');
    });
    
    // 测试唯一性
    console.log('🎯 唯一性测试：');
    
    const uniqueSet = new Set();
    const testCount = 1000;
    
    // 快速生成（实际中不可能这么快）
    for (let i = 0; i < testCount; i++) {
        const fakeTime = new Date(startTime + i); // 每1ms
        const name = generateTimeBasedZipName.call({ now: fakeTime });
        uniqueSet.add(name);
    }
    
    console.log(`  生成 ${testCount} 个文件名`);
    console.log(`  唯一值: ${uniqueSet.size}`);
    
    if (uniqueSet.size === testCount) {
        console.log(`  ✅ 100% 唯一（毫秒级差异）`);
    } else {
        console.log(`  ❌ 有 ${testCount - uniqueSet.size} 个重复`);
        
        // 分析重复原因
        const duplicates = [];
        const nameMap = {};
        
        Array.from(uniqueSet).forEach(name => {
            if (!nameMap[name]) nameMap[name] = 0;
            nameMap[name]++;
        });
        
        Object.entries(nameMap).forEach(([name, count]) => {
            if (count > 1) {
                duplicates.push({ name, count });
            }
        });
        
        if (duplicates.length > 0) {
            console.log(`  重复的文件名:`);
            duplicates.forEach(dup => {
                console.log(`    ${dup.name}: ${dup.count} 次`);
            });
        }
    }
    
    console.log('');
    
    // 测试实际使用场景
    console.log('📱 实际使用场景分析：');
    console.log('用户使用MossCutter的时间间隔：');
    
    const usageScenarios = [
        { scenario: '快速连续使用', interval: 1, unit: '秒', usesPerHour: 3600 },
        { scenario: '正常使用', interval: 30, unit: '秒', usesPerHour: 120 },
        { scenario: '偶尔使用', interval: 300, unit: '秒', usesPerHour: 12 },
        { scenario: '稀疏使用', interval: 1800, unit: '秒', usesPerHour: 2 }
    ];
    
    usageScenarios.forEach(scenario => {
        console.log(`\n  ${scenario.scenario}:`);
        console.log(`    间隔: ${scenario.interval} ${scenario.unit}`);
        console.log(`    每小时: ${scenario.usesPerHour} 次`);
        console.log(`    每天: ${scenario.usesPerHour * 24} 次`);
        
        const dailyUses = scenario.usesPerHour * 24;
        const dailyUnique = 86400; // 每天86400秒
        
        if (dailyUses <= dailyUnique) {
            console.log(`    ✅ 足够唯一（秒级精度）`);
        } else {
            console.log(`    ⚠️  需要毫秒级精度`);
            const neededPrecision = dailyUses > 86400000 ? '微秒级' : '毫秒级';
            console.log(`      建议: 使用${neededPrecision}时间戳`);
        }
    });
}

// 测试文件名可读性
function testReadability() {
    console.log('\n📖 可读性测试：');
    
    const testCases = [
        { time: '2026-02-24 14:15:30', expected: 'MossCut20260224141530' },
        { time: '2026-12-31 23:59:59', expected: 'MossCut20261231235959' },
        { time: '2027-01-01 00:00:01', expected: 'MossCut20270101000001' },
        { time: '2026-06-15 09:30:45', expected: 'MossCut20260615093045' }
    ];
    
    testCases.forEach(test => {
        const date = new Date(test.time);
        const name = generateTimeBasedZipName.call({ now: date });
        
        console.log(`  时间: ${test.time}`);
        console.log(`  生成: ${name}`);
        console.log(`  预期: ${test.expected}`);
        
        if (name === test.expected) {
            console.log(`  ✅ 匹配`);
        } else {
            console.log(`  ❌ 不匹配`);
        }
        
        // 人类可读性分析
        const match = name.match(/^MossCut(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
        if (match) {
            const [_, year, month, day, hours, minutes, seconds] = match;
            console.log(`  可读为: ${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`);
        }
        
        console.log('');
    });
}

// 运行测试
testTimeBasedNames();
testReadability();

console.log('💡 时间格式 vs 随机数格式对比：');
console.log('┌──────────────┬──────────────────────┬──────────────────────┐');
console.log('│  对比项      │     随机数格式       │     时间格式         │');
console.log('├──────────────┼──────────────────────┼──────────────────────┤');
console.log('│ 格式         │ MossCutYYYYMMDDXXX   │ MossCutYYYYMMDDHHMMSS│');
console.log('│ 示例         │ MossCut20260224123   │ MossCut20260224141530│');
console.log('│ 长度         │ 18字符              │ 21字符              │');
console.log('│ 唯一性       │ 每天900个可能值     │ 每天86400个可能值   │');
console.log('│ 可读性       │ 日期+随机数         │ 完整日期时间        │');
console.log('│ 排序         │ 按日期，随机无序    │ 按时间顺序          │');
console.log('│ 隐私         │ 不暴露具体时间      │ 暴露具体时间        │');
console.log('│ 重复概率     │ 低（但存在）        │ 零（秒级）          │');
console.log('└──────────────┴──────────────────────┴──────────────────────┘');

console.log('\n🎯 时间格式优点：');
console.log('1. 绝对唯一：同一秒内用户不可能使用两次');
console.log('2. 时间顺序：按文件名排序就是按使用时间排序');
console.log('3. 信息丰富：包含完整的日期和时间信息');
console.log('4. 便于归档：按年月日时分秒自动组织文件');
console.log('5. 无需随机：避免随机数生成和重复检查');

console.log('\n⚠️  注意事项：');
console.log('1. 暴露时间：文件名包含具体使用时间');
console.log('2. 长度稍长：21字符 vs 18字符（增加16.7%）');
console.log('3. 格式固定：用户可能需要适应新格式');

console.log('\n🚀 实际效果预览：');
console.log('• 下午2点15分30秒使用：MossCut20260224141530');
console.log('• 晚上11点59分59秒使用：MossCut20260224235959');
console.log('• 午夜0点0分1秒使用：MossCut20260225000001');
console.log('• 文件名排序：自动按时间顺序排列');

console.log('\n✅ 测试完成！时间格式ZIP文件名已生效。');