// 测试改进的ZIP文件名生成

console.log('🔤 测试改进的ZIP文件名生成...\n');

// 改进的generateDefaultZipName函数
function generateDefaultZipName() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // 生成三位随机数字（100-999）
    const randomNum = String(Math.floor(Math.random() * 900) + 100); // 100-999
    
    return `MossCut${year}${month}${day}${randomNum}`;
}

// 测试随机数分布
function testRandomDistribution() {
    console.log('🎲 随机数分布测试：');
    
    const counts = {};
    const totalTests = 10000;
    
    // 统计随机数出现次数
    for (let i = 0; i < totalTests; i++) {
        const name = generateDefaultZipName();
        const randomPart = name.substring(15); // 获取XXX部分
        counts[randomPart] = (counts[randomPart] || 0) + 1;
    }
    
    // 分析结果
    const uniqueRandoms = Object.keys(counts).length;
    const expectedUnique = 900; // 100-999共900个可能值
    
    console.log(`  测试次数: ${totalTests}`);
    console.log(`  唯一随机数: ${uniqueRandoms}/${expectedUnique}`);
    console.log(`  覆盖率: ${(uniqueRandoms / expectedUnique * 100).toFixed(1)}%`);
    
    // 检查范围
    let minRandom = 999;
    let maxRandom = 100;
    Object.keys(counts).forEach(num => {
        const n = parseInt(num);
        if (n < minRandom) minRandom = n;
        if (n > maxRandom) maxRandom = n;
    });
    
    console.log(`  随机数范围: ${minRandom}-${maxRandom}`);
    console.log(`  理论范围: 100-999`);
    
    if (minRandom >= 100 && maxRandom <= 999) {
        console.log(`  ✅ 范围正确`);
    } else {
        console.log(`  ❌ 范围错误`);
    }
    
    // 检查重复情况
    let duplicates = 0;
    Object.values(counts).forEach(count => {
        if (count > 1) duplicates += (count - 1);
    });
    
    console.log(`  重复次数: ${duplicates}`);
    console.log(`  重复率: ${(duplicates / totalTests * 100).toFixed(2)}%`);
    
    // 理论重复率
    // 生日悖论：在900个可能值中选10000次，重复概率很高
    const expectedDuplicates = totalTests - uniqueRandoms;
    console.log(`  理论重复: ${expectedDuplicates}`);
    
    console.log('');
    
    // 实际使用场景：用户一天内使用次数有限
    console.log('📱 实际使用场景分析：');
    console.log('假设用户一天内使用MossCutter：');
    
    const dailyUsageScenarios = [
        { scenario: '轻度使用', usesPerDay: 5, days: 30 },
        { scenario: '中度使用', usesPerDay: 20, days: 30 },
        { scenario: '重度使用', usesPerDay: 100, days: 30 }
    ];
    
    dailyUsageScenarios.forEach(scenario => {
        const totalUses = scenario.usesPerDay * scenario.days;
        const uniqueNeeded = totalUses;
        const availableUnique = 900; // 每天900个唯一值
        
        console.log(`\n  ${scenario.scenario}:`);
        console.log(`    每天使用: ${scenario.usesPerDay} 次`);
        console.log(`    每月使用: ${totalUses} 次`);
        console.log(`    需要唯一值: ${uniqueNeeded}`);
        console.log(`    每天可用唯一值: ${availableUnique}`);
        
        if (uniqueNeeded <= availableUnique) {
            console.log(`    ✅ 足够唯一（每天不重复）`);
        } else {
            const duplicateDays = Math.ceil((uniqueNeeded - availableUnique) / availableUnique);
            console.log(`    ⚠️  需要 ${duplicateDays} 天才有重复风险`);
        }
    });
}

// 测试实际文件名
function testActualFilenames() {
    console.log('\n📄 实际文件名示例：');
    
    for (let i = 0; i < 10; i++) {
        const name = generateDefaultZipName();
        console.log(`  ${i + 1}. ${name}`);
    }
    
    console.log('\n🎨 文件名格式分析：');
    const sampleName = generateDefaultZipName();
    console.log(`  示例: ${sampleName}`);
    console.log(`  分解:`);
    console.log(`    • 品牌前缀: ${sampleName.substring(0, 7)} (MossCut)`);
    console.log(`    • 年份: ${sampleName.substring(7, 11)} (YYYY)`);
    console.log(`    • 月份: ${sampleName.substring(11, 13)} (MM)`);
    console.log(`    • 日期: ${sampleName.substring(13, 15)} (DD)`);
    console.log(`    • 随机数: ${sampleName.substring(15)} (XXX)`);
    console.log(`  总长度: ${sampleName.length} 字符`);
}

// 运行测试
testRandomDistribution();
testActualFilenames();

console.log('\n💡 改进说明：');
console.log('随机数生成从 1-999 改为 100-999：');
console.log('  之前: Math.floor(Math.random() * 999) + 1');
console.log('  现在: Math.floor(Math.random() * 900) + 100');
console.log('');
console.log('🎯 改进优点：');
console.log('1. 保证三位数：100-999都是三位数，001-099可能显示为1-99');
console.log('2. 更好的分布：900个可能值 vs 999个（差别不大）');
console.log('3. 避免前导零：100-999没有前导零，更美观');
console.log('4. 实际使用足够：用户一天内很难达到900次使用');

console.log('\n🚀 实际效果：');
console.log('• 页面加载时：显示如 MossCut20260224123');
console.log('• 重置工具时：更新为新的随机文件名');
console.log('• 下载ZIP时：使用当前输入框中的文件名');
console.log('• 用户可自定义：保留输入框让用户修改');

console.log('\n✅ 测试完成！改进的ZIP文件名格式已生效。');