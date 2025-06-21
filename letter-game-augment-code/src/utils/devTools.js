// 开发工具和调试功能

import { runGameTests } from '../tests/gameLogic.test'
import { debugTools, gameTestScenarios, performanceMonitor } from './testUtils'
import { DEV_CONFIG } from '../config/gameConfig'

// 开发工具管理器
class DevToolsManager {
  constructor() {
    this.isEnabled = DEV_CONFIG.DEBUG_MODE
    this.tools = {}
    
    if (this.isEnabled) {
      this.initializeTools()
    }
  }

  // 初始化开发工具
  initializeTools() {
    // 添加全局调试函数
    if (typeof window !== 'undefined') {
      window.gameDebug = {
        // 运行测试
        runTests: runGameTests,
        runQuickTests: gameTestScenarios.runAllTests,
        
        // 性能监控
        startFPSMonitor: performanceMonitor.monitorFPS,
        checkMemory: performanceMonitor.monitorMemory,
        
        // 调试工具
        enableDebug: debugTools.enableDebugMode,
        logPerformance: debugTools.logPerformance,
        
        // 游戏控制
        simulateKeyPress: this.simulateKeyPress,
        simulateGameScenario: this.simulateGameScenario,
        
        // 数据管理
        clearGameData: this.clearGameData,
        exportGameData: this.exportGameData,
        importGameData: this.importGameData
      }
      
      console.log('🔧 开发工具已加载')
      console.log('💡 在控制台输入 gameDebug 查看可用命令')
    }
  }

  // 模拟按键
  simulateKeyPress = (key) => {
    const event = new KeyboardEvent('keydown', {
      key: key.toUpperCase(),
      code: `Key${key.toUpperCase()}`,
      bubbles: true,
      cancelable: true
    })
    
    window.dispatchEvent(event)
    console.log(`🎹 模拟按键: ${key}`)
  }

  // 模拟游戏场景
  simulateGameScenario = async (scenario = 'basic') => {
    console.log(`🎮 开始模拟游戏场景: ${scenario}`)
    
    switch (scenario) {
      case 'basic':
        await this.simulateBasicGameplay()
        break
      case 'highScore':
        await this.simulateHighScoreAttempt()
        break
      case 'stress':
        await this.simulateStressTest()
        break
      default:
        console.log('❓ 未知场景，可用场景: basic, highScore, stress')
    }
  }

  // 模拟基础游戏流程
  simulateBasicGameplay = async () => {
    const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    
    for (let i = 0; i < keys.length; i++) {
      this.simulateKeyPress(keys[i])
      await this.wait(500) // 等待500ms
    }
    
    console.log('✅ 基础游戏流程模拟完成')
  }

  // 模拟高分尝试
  simulateHighScoreAttempt = async () => {
    const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    
    console.log('🏆 开始高分挑战模拟...')
    
    for (let round = 0; round < 3; round++) {
      console.log(`🔄 第 ${round + 1} 轮`)
      
      for (const key of keys) {
        this.simulateKeyPress(key)
        await this.wait(100) // 快速按键
      }
      
      await this.wait(1000) // 轮次间隔
    }
    
    console.log('🎯 高分挑战模拟完成')
  }

  // 模拟压力测试
  simulateStressTest = async () => {
    console.log('⚡ 开始压力测试...')
    
    const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const startTime = performance.now()
    
    // 快速连续按键
    for (let i = 0; i < 100; i++) {
      const randomKey = keys[Math.floor(Math.random() * keys.length)]
      this.simulateKeyPress(randomKey)
      
      if (i % 10 === 0) {
        await this.wait(10) // 短暂间隔
      }
    }
    
    const endTime = performance.now()
    console.log(`⚡ 压力测试完成，耗时: ${(endTime - startTime).toFixed(2)}ms`)
  }

  // 等待函数
  wait = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // 清除游戏数据
  clearGameData = () => {
    const keys = ['highScore_easy', 'highScore_medium', 'highScore_hard', 'gameSettings', 'gameStats']
    
    keys.forEach(key => {
      localStorage.removeItem(key)
    })
    
    console.log('🗑️ 游戏数据已清除')
  }

  // 导出游戏数据
  exportGameData = () => {
    const data = {
      highScores: {
        easy: localStorage.getItem('highScore_easy'),
        medium: localStorage.getItem('highScore_medium'),
        hard: localStorage.getItem('highScore_hard')
      },
      settings: localStorage.getItem('gameSettings'),
      stats: localStorage.getItem('gameStats'),
      exportTime: new Date().toISOString()
    }
    
    const jsonData = JSON.stringify(data, null, 2)
    
    // 创建下载链接
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `game-data-${Date.now()}.json`
    a.click()
    
    URL.revokeObjectURL(url)
    console.log('📤 游戏数据已导出')
  }

  // 导入游戏数据
  importGameData = (jsonData) => {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData
      
      // 导入最高分
      if (data.highScores) {
        Object.entries(data.highScores).forEach(([difficulty, score]) => {
          if (score) {
            localStorage.setItem(`highScore_${difficulty}`, score)
          }
        })
      }
      
      // 导入设置
      if (data.settings) {
        localStorage.setItem('gameSettings', data.settings)
      }
      
      // 导入统计
      if (data.stats) {
        localStorage.setItem('gameStats', data.stats)
      }
      
      console.log('📥 游戏数据已导入')
    } catch (error) {
      console.error('❌ 导入失败:', error)
    }
  }
}

// 创建开发工具实例
export const devTools = new DevToolsManager()

// 游戏调试助手
export const gameDebugHelper = {
  // 显示游戏状态
  showGameState: () => {
    const gameElement = document.querySelector('[data-testid="game-screen"]')
    if (gameElement) {
      console.log('🎮 游戏正在运行')
    } else {
      console.log('🏠 游戏在主菜单')
    }
  },

  // 显示性能信息
  showPerformanceInfo: () => {
    if (performance.memory) {
      const memory = performance.memory
      console.group('⚡ 性能信息')
      console.log(`内存使用: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`)
      console.log(`内存总量: ${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`)
      console.log(`内存限制: ${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`)
      console.groupEnd()
    }
  },

  // 显示本地存储信息
  showStorageInfo: () => {
    console.group('💾 本地存储')
    
    const keys = ['highScore_easy', 'highScore_medium', 'highScore_hard', 'gameSettings', 'gameStats']
    keys.forEach(key => {
      const value = localStorage.getItem(key)
      if (value) {
        console.log(`${key}:`, JSON.parse(value))
      } else {
        console.log(`${key}: 未设置`)
      }
    })
    
    console.groupEnd()
  },

  // 快速测试
  quickTest: async () => {
    console.log('🚀 开始快速测试...')
    
    try {
      // 测试本地存储
      localStorage.setItem('test_key', 'test_value')
      const testValue = localStorage.getItem('test_key')
      console.log(testValue === 'test_value' ? '✅ 本地存储正常' : '❌ 本地存储异常')
      localStorage.removeItem('test_key')
      
      // 测试Web Audio API
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (AudioContext) {
        const audioContext = new AudioContext()
        console.log('✅ Web Audio API 可用')
        audioContext.close()
      } else {
        console.log('❌ Web Audio API 不可用')
      }
      
      // 测试键盘事件
      let keyEventWorking = false
      const testHandler = () => { keyEventWorking = true }
      
      window.addEventListener('keydown', testHandler)
      
      const testEvent = new KeyboardEvent('keydown', { key: 'A' })
      window.dispatchEvent(testEvent)
      
      setTimeout(() => {
        console.log(keyEventWorking ? '✅ 键盘事件正常' : '❌ 键盘事件异常')
        window.removeEventListener('keydown', testHandler)
      }, 100)
      
      console.log('✅ 快速测试完成')
    } catch (error) {
      console.error('❌ 测试过程中出现错误:', error)
    }
  }
}

// 在开发模式下自动初始化
if (DEV_CONFIG.DEBUG_MODE && typeof window !== 'undefined') {
  // 添加快捷键
  window.addEventListener('keydown', (event) => {
    // Ctrl + Shift + D 打开调试面板
    if (event.ctrlKey && event.shiftKey && event.key === 'D') {
      event.preventDefault()
      console.clear()
      console.log('🔧 游戏调试工具')
      console.log('================')
      console.log('gameDebug - 主要调试工具')
      console.log('gameDebugHelper - 调试助手')
      console.log('================')
      gameDebugHelper.quickTest()
    }
  })
  
  console.log('💡 按 Ctrl+Shift+D 打开调试面板')
}

export default devTools
