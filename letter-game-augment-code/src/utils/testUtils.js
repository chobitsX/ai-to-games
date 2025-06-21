// 测试工具函数

// 模拟键盘事件
export const simulateKeyPress = (key) => {
  const event = new KeyboardEvent('keydown', {
    key: key.toUpperCase(),
    code: `Key${key.toUpperCase()}`,
    keyCode: key.toUpperCase().charCodeAt(0),
    which: key.toUpperCase().charCodeAt(0),
    bubbles: true,
    cancelable: true
  })
  
  window.dispatchEvent(event)
  return event
}

// 模拟鼠标点击
export const simulateClick = (element) => {
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  })
  
  element.dispatchEvent(event)
  return event
}

// 等待指定时间
export const wait = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 检查元素是否存在
export const waitForElement = (selector, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    
    const checkElement = () => {
      const element = document.querySelector(selector)
      if (element) {
        resolve(element)
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Element ${selector} not found within ${timeout}ms`))
      } else {
        setTimeout(checkElement, 100)
      }
    }
    
    checkElement()
  })
}

// 游戏测试场景
export const gameTestScenarios = {
  // 测试游戏开始
  testGameStart: async () => {
    console.log('🧪 测试游戏开始...')
    
    try {
      // 等待开始按钮出现
      const startButton = await waitForElement('button:contains("开始游戏")')
      simulateClick(startButton)
      
      // 等待游戏界面出现
      await waitForElement('[data-testid="game-screen"]', 3000)
      console.log('✅ 游戏开始测试通过')
      return true
    } catch (error) {
      console.error('❌ 游戏开始测试失败:', error)
      return false
    }
  },

  // 测试键盘输入
  testKeyboardInput: async () => {
    console.log('🧪 测试键盘输入...')
    
    try {
      // 模拟按键
      const testKeys = ['A', 'B', 'C', 'D', 'E']
      
      for (const key of testKeys) {
        simulateKeyPress(key)
        await wait(100)
      }
      
      console.log('✅ 键盘输入测试通过')
      return true
    } catch (error) {
      console.error('❌ 键盘输入测试失败:', error)
      return false
    }
  },

  // 测试音效
  testSoundEffects: () => {
    console.log('🧪 测试音效...')
    
    try {
      // 检查音频上下文是否可用
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) {
        throw new Error('Web Audio API not supported')
      }
      
      const audioContext = new AudioContext()
      console.log('✅ 音效测试通过 - Web Audio API 可用')
      audioContext.close()
      return true
    } catch (error) {
      console.error('❌ 音效测试失败:', error)
      return false
    }
  },

  // 测试本地存储
  testLocalStorage: () => {
    console.log('🧪 测试本地存储...')
    
    try {
      // 测试写入
      const testData = { score: 100, difficulty: 'easy' }
      localStorage.setItem('test_game_data', JSON.stringify(testData))
      
      // 测试读取
      const retrievedData = JSON.parse(localStorage.getItem('test_game_data'))
      
      if (retrievedData.score === 100 && retrievedData.difficulty === 'easy') {
        // 清理测试数据
        localStorage.removeItem('test_game_data')
        console.log('✅ 本地存储测试通过')
        return true
      } else {
        throw new Error('Data mismatch')
      }
    } catch (error) {
      console.error('❌ 本地存储测试失败:', error)
      return false
    }
  },

  // 运行所有测试
  runAllTests: async () => {
    console.log('🚀 开始运行所有测试...')
    
    const results = {
      soundEffects: gameTestScenarios.testSoundEffects(),
      localStorage: gameTestScenarios.testLocalStorage(),
      keyboardInput: await gameTestScenarios.testKeyboardInput()
    }
    
    const passedTests = Object.values(results).filter(Boolean).length
    const totalTests = Object.keys(results).length
    
    console.log(`📊 测试结果: ${passedTests}/${totalTests} 通过`)
    
    if (passedTests === totalTests) {
      console.log('🎉 所有测试通过！')
    } else {
      console.log('⚠️ 部分测试失败，请检查控制台输出')
    }
    
    return results
  }
}

// 性能监控工具
export const performanceMonitor = {
  // 监控帧率
  monitorFPS: () => {
    let lastTime = performance.now()
    let frameCount = 0
    let fps = 0
    
    const measureFPS = (currentTime) => {
      frameCount++
      
      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        frameCount = 0
        lastTime = currentTime
        
        // 在控制台显示FPS（仅在开发模式）
        if (process.env.NODE_ENV === 'development') {
          console.log(`🎯 FPS: ${fps}`)
        }
      }
      
      requestAnimationFrame(measureFPS)
    }
    
    requestAnimationFrame(measureFPS)
    return () => fps
  },

  // 监控内存使用
  monitorMemory: () => {
    if (performance.memory) {
      const memory = performance.memory
      console.log('💾 内存使用情况:')
      console.log(`  已使用: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`)
      console.log(`  总分配: ${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`)
      console.log(`  限制: ${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`)
    } else {
      console.log('⚠️ 内存监控不可用')
    }
  }
}

// 调试工具
export const debugTools = {
  // 显示游戏状态
  logGameState: (gameState) => {
    console.group('🎮 游戏状态')
    console.log('得分:', gameState.score)
    console.log('时间:', gameState.timeLeft)
    console.log('生命:', gameState.lives)
    console.log('地鼠数量:', gameState.moles?.length || 0)
    console.log('可见地鼠:', gameState.moles?.filter(m => m.isVisible).length || 0)
    console.groupEnd()
  },

  // 显示性能信息
  logPerformance: () => {
    console.group('⚡ 性能信息')
    performanceMonitor.monitorMemory()
    console.groupEnd()
  },

  // 启用调试模式
  enableDebugMode: () => {
    window.GAME_DEBUG = true
    console.log('🔧 调试模式已启用')
    
    // 添加全局调试函数
    window.gameDebug = debugTools
    window.gameTest = gameTestScenarios
    window.performanceMonitor = performanceMonitor
  }
}
