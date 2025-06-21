// 游戏逻辑测试文件
// 注意：这是一个简化的测试文件，实际项目中建议使用Jest等测试框架

import { storage, calculateAccuracy, getScoreRating, formatTime } from '../utils/gameUtils'
import { GAME_CONFIG, DIFFICULTY_CONFIG } from '../config/gameConfig'

// 简单的测试框架
class SimpleTest {
  constructor() {
    this.tests = []
    this.passed = 0
    this.failed = 0
  }

  test(name, testFn) {
    this.tests.push({ name, testFn })
  }

  async run() {
    console.log('🧪 开始运行游戏逻辑测试...\n')
    
    for (const { name, testFn } of this.tests) {
      try {
        await testFn()
        console.log(`✅ ${name}`)
        this.passed++
      } catch (error) {
        console.error(`❌ ${name}: ${error.message}`)
        this.failed++
      }
    }
    
    console.log(`\n📊 测试结果: ${this.passed} 通过, ${this.failed} 失败`)
    
    if (this.failed === 0) {
      console.log('🎉 所有测试通过！')
    }
    
    return { passed: this.passed, failed: this.failed }
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message || '断言失败')
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `期望 ${expected}, 实际 ${actual}`)
    }
  }

  assertNotEqual(actual, expected, message) {
    if (actual === expected) {
      throw new Error(message || `不应该等于 ${expected}`)
    }
  }

  assertGreaterThan(actual, expected, message) {
    if (actual <= expected) {
      throw new Error(message || `${actual} 应该大于 ${expected}`)
    }
  }

  assertLessThan(actual, expected, message) {
    if (actual >= expected) {
      throw new Error(message || `${actual} 应该小于 ${expected}`)
    }
  }
}

// 创建测试实例
const test = new SimpleTest()

// 配置测试
test.test('游戏配置应该正确', () => {
  test.assert(GAME_CONFIG.GAME_DURATION > 0, '游戏时长应该大于0')
  test.assert(GAME_CONFIG.MAX_LIVES > 0, '最大生命值应该大于0')
  test.assert(GAME_CONFIG.MOLE_COUNT > 0, '地鼠洞数量应该大于0')
  test.assert(Array.isArray(GAME_CONFIG.LETTERS), '字母表应该是数组')
  test.assertEqual(GAME_CONFIG.LETTERS.length, 26, '字母表应该有26个字母')
})

test.test('难度配置应该正确', () => {
  const difficulties = ['easy', 'medium', 'hard']
  
  difficulties.forEach(difficulty => {
    const config = DIFFICULTY_CONFIG[difficulty]
    test.assert(config, `${difficulty} 难度配置应该存在`)
    test.assert(config.spawnInterval > 0, `${difficulty} 生成间隔应该大于0`)
    test.assert(config.moleLifetime > 0, `${difficulty} 地鼠生存时间应该大于0`)
    test.assert(config.pointsPerHit > 0, `${difficulty} 击中得分应该大于0`)
    test.assert(config.speedIncrease > 0 && config.speedIncrease < 1, `${difficulty} 速度递增应该在0-1之间`)
  })
  
  // 验证难度递增
  test.assertGreaterThan(DIFFICULTY_CONFIG.easy.spawnInterval, DIFFICULTY_CONFIG.medium.spawnInterval, '简单模式生成间隔应该大于中等模式')
  test.assertGreaterThan(DIFFICULTY_CONFIG.medium.spawnInterval, DIFFICULTY_CONFIG.hard.spawnInterval, '中等模式生成间隔应该大于困难模式')
})

// 工具函数测试
test.test('时间格式化应该正确', () => {
  test.assertEqual(formatTime(0), '0:00', '0秒应该格式化为0:00')
  test.assertEqual(formatTime(30), '0:30', '30秒应该格式化为0:30')
  test.assertEqual(formatTime(60), '1:00', '60秒应该格式化为1:00')
  test.assertEqual(formatTime(90), '1:30', '90秒应该格式化为1:30')
  test.assertEqual(formatTime(3661), '61:01', '3661秒应该格式化为61:01')
})

test.test('准确率计算应该正确', () => {
  test.assertEqual(calculateAccuracy(0, 0), 0, '0击中0错过应该是0%')
  test.assertEqual(calculateAccuracy(10, 0), 100, '10击中0错过应该是100%')
  test.assertEqual(calculateAccuracy(0, 10), 0, '0击中10错过应该是0%')
  test.assertEqual(calculateAccuracy(7, 3), 70, '7击中3错过应该是70%')
  test.assertEqual(calculateAccuracy(1, 2), 33, '1击中2错过应该是33%')
})

test.test('得分等级应该正确', () => {
  const testCases = [
    { score: 0, expectedRating: '加油练习' },
    { score: 150, expectedRating: '加油练习' },
    { score: 250, expectedRating: '继续努力' },
    { score: 450, expectedRating: '不错哦' },
    { score: 650, expectedRating: '键盘达人' },
    { score: 850, expectedRating: '超级高手' },
    { score: 1200, expectedRating: '传奇大师' }
  ]
  
  testCases.forEach(({ score, expectedRating }) => {
    const result = getScoreRating(score)
    test.assertEqual(result.rating, expectedRating, `得分${score}应该是${expectedRating}等级`)
    test.assert(result.emoji, '应该有emoji')
    test.assert(result.color, '应该有颜色')
  })
})

// 本地存储测试
test.test('本地存储应该正常工作', () => {
  // 清理测试数据
  const testKey = 'test_storage_key'
  localStorage.removeItem(testKey)
  
  // 测试保存和读取
  const testData = { score: 100, difficulty: 'easy' }
  localStorage.setItem(testKey, JSON.stringify(testData))
  
  const retrieved = JSON.parse(localStorage.getItem(testKey))
  test.assertEqual(retrieved.score, 100, '应该能正确保存和读取分数')
  test.assertEqual(retrieved.difficulty, 'easy', '应该能正确保存和读取难度')
  
  // 清理
  localStorage.removeItem(testKey)
})

test.test('最高分保存应该正确', () => {
  // 清理测试数据
  const difficulty = 'test'
  const key = `highScore_${difficulty}`
  localStorage.removeItem(key)
  
  // 测试首次保存
  const isNewRecord1 = storage.saveHighScore(100, difficulty)
  test.assert(isNewRecord1, '首次保存应该是新纪录')
  test.assertEqual(storage.getHighScore(difficulty), 100, '应该能读取保存的最高分')
  
  // 测试更高分数
  const isNewRecord2 = storage.saveHighScore(200, difficulty)
  test.assert(isNewRecord2, '更高分数应该是新纪录')
  test.assertEqual(storage.getHighScore(difficulty), 200, '应该更新最高分')
  
  // 测试较低分数
  const isNewRecord3 = storage.saveHighScore(150, difficulty)
  test.assert(!isNewRecord3, '较低分数不应该是新纪录')
  test.assertEqual(storage.getHighScore(difficulty), 200, '最高分不应该被较低分数覆盖')
  
  // 清理
  localStorage.removeItem(key)
})

// Web Audio API测试
test.test('Web Audio API应该可用', () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext
  test.assert(AudioContext, 'Web Audio API应该可用')
  
  // 测试创建音频上下文
  const audioContext = new AudioContext()
  test.assert(audioContext, '应该能创建音频上下文')
  
  // 测试创建振荡器
  const oscillator = audioContext.createOscillator()
  test.assert(oscillator, '应该能创建振荡器')
  
  // 测试创建增益节点
  const gainNode = audioContext.createGain()
  test.assert(gainNode, '应该能创建增益节点')
  
  // 清理
  audioContext.close()
})

// 键盘事件测试
test.test('键盘事件应该正常工作', () => {
  let keyPressed = null
  
  const handleKeyDown = (event) => {
    keyPressed = event.key
  }
  
  // 添加事件监听器
  window.addEventListener('keydown', handleKeyDown)
  
  // 模拟按键事件
  const event = new KeyboardEvent('keydown', {
    key: 'A',
    code: 'KeyA',
    bubbles: true
  })
  
  window.dispatchEvent(event)
  
  test.assertEqual(keyPressed, 'A', '应该能正确捕获键盘事件')
  
  // 清理
  window.removeEventListener('keydown', handleKeyDown)
})

// 导出测试运行器
export const runGameTests = () => {
  return test.run()
}

// 如果直接运行此文件，执行测试
if (typeof window !== 'undefined' && window.location) {
  // 在浏览器环境中，可以通过控制台运行测试
  window.runGameTests = runGameTests
  
  // 开发模式下自动运行测试
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 开发模式：可以在控制台运行 runGameTests() 来执行测试')
  }
}
