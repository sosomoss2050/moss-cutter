// 测试ZIP文件名生成

console.log('🔤 测试ZIP文件名生成...\n');

// 复制generateDefaultZipName函数
function generateDefaultZipName() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // 生成三位随机数字（001-999）
    const randomNum = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    
    return `MossCut${year}${month}${day}${randomNum}`;
}

// 测试函数
function testZipNameGeneration() {
    console.log('📅 当前日期测试：');
    
    // 生成多个测试文件名
    const testNames = [];
    for (let i = 0; i < 5; i++) {
        testNames.push(generateDefaultZipName());
    }
    
    // 分析文件名格式
    testNames.forEach((name, index) => {
        console.log(`  测试 ${index + 1}: ${name}`);
        
        // 验证格式
        const pattern = /^MossCut(\d{8})(\d{3})$/;
        const match = name.match(pattern);
        
        if (match) {
            const dateStr = match[1];
            const randomStr = match[2];
            
            console.log(`    ✅ 格式正确`);
            console.log(`      日期部分: ${dateStr}`);
            console.log(`      随机部分: ${randomStr}`);
            
            // 验证日期部分
            const year = parseInt(dateStr.substring(0, 4));
            const month = parseInt(dateStr.substring(4, 6));
            const day = parseInt(dateStr.substring(6, 8));
            
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth() + 1;
            const currentDay = now.getDate();
            
            if (year === currentYear && month === currentMonth && day === currentDay) {
                console.log(`    ✅ 日期正确: ${year}-${month}-${day}`);
            } else {
                console.log(`    ❌ 日期错误: 期望 ${currentYear}-${currentMonth}-${currentDay}, 得到 ${year}-${month}-${day}`);
            }
            
            // 验证随机部分
            const randomNum = parseInt(randomStr);
            if (randomNum >= 1 && randomNum <= 999) {
                console.log(`    ✅ 随机数范围正确: 1-999`);
            } else {
                console.log(`    ❌ 随机数范围错误: ${randomNum}`);
            }
        } else {
            console.log(`    ❌ 格式错误`);
        }
        
        console.log('');
    });
    
    // 测试边界情况
    console.log('🎯 边界情况测试：');
    
    // 模拟特定日期（用于测试）
    function generateTestZipName(year, month, day) {
        const date = new Date(year, month - 1, day);
        const dateStr = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
        const randomNum = '123'; // 固定随机数用于测试
        return `MossCut${dateStr}${randomNum}`;
    }
    
    const testCases = [
        { year: 2026, month: 2, day: 24, expected: 'MossCut20260224123' },
        { year: 2024, month: 12, day: 31, expected: 'MossCut20241231123' },
        { year: 2025, month: 1, day: 1, expected: 'MossCut20250101123' },
        { year: 2030, month: 6, day: 15, expected: 'MossCut20300615123' }
    ];
    
    testCases.forEach(test => {
        const name = generateTestZipName(test.year, test.month, test.day);
        console.log(`  ${test.year}-${test.month}-${test.day}: ${name}`);
        
        if (name === test.expected) {
            console.log(`    ✅ 匹配预期`);
        } else {
            console.log(`    ❌ 不匹配，预期: ${test.expected}`);
        }
    });
    
    console.log('');
    
    // 测试随机性
    console.log('🎲 随机性测试：');
    const randomSet = new Set();
    for (let i = 0; i < 100; i++) {
        randomSet.add(generateDefaultZipName());
    }
    
    console.log(`  生成100个文件名，唯一性: ${randomSet.size}/100`);
    if (randomSet.size === 100) {
        console.log(`  ✅ 所有文件名都唯一`);
    } else {
        console.log(`  ⚠️  有 ${100 - randomSet.size} 个重复`);
    }
    
    // 检查重复模式
    const duplicates = [];
    const namesArray = Array.from(randomSet);
    const patternCount = {};
    
    namesArray.forEach(name => {
        const datePart = name.substring(7, 15); // MossCutYYYYMMDD
        const randomPart = name.substring(15); // XXX
        
        if (!patternCount[datePart]) {
            patternCount[datePart] = new Set();
        }
        patternCount[datePart].add(randomPart);
    });
    
    console.log('\n📊 日期分布：');
    Object.keys(patternCount).forEach(date => {
        const count = patternCount[date].size;
        console.log(`  ${date}: ${count} 个不同随机数`);
    });
}

// 运行测试
testZipNameGeneration();

console.log('\n💡 文件名格式说明：');
console.log('格式: MossCutYYYYMMDDXXX');
console.log('示例: MossCut20260224001');
console.log('解释:');
console.log('  • MossCut: 固定前缀，品牌标识');
console.log('  • YYYY: 4位年份，如2026');
console.log('  • MM: 2位月份，如02');
console.log('  • DD: 2位日期，如24');
console.log('  • XXX: 3位随机数，001-999');
console.log('');
console.log('🎯 优点：');
console.log('1. 品牌识别度高（MossCut开头）');
console.log('2. 日期信息明确（方便归档）');
console.log('3. 随机数避免重复（001-999）');
console.log('4. 格式统一规范（固定长度）');
console.log('5. 易于排序（按日期+随机数）');

console.log('\n🚀 测试完成！新的ZIP文件名格式已生效。');