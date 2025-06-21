import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import EndScreen from './components/EndScreen'
import PerformanceMonitor from './components/PerformanceMonitor'
import { useGameLogic } from './hooks/useGameLogic'
import { useKeyboardHandler } from './hooks/useKeyboardHandler'
import { playSound, soundSettings } from './utils/soundEffects'
import { storage } from './utils/gameUtils'
import { GAME_CONFIG } from './config/gameConfig'

const { GAME_STATES } = GAME_CONFIG

function App() {
  const [gameState, setGameState] = useState(GAME_STATES.START)
  const [difficulty, setDifficulty] = useState('easy')
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  
  const {
    score,
    timeLeft,
    lives,
    moles,
    gameStats,
    startGame,
    endGame,
    resetGame,
    hitMole,
    missedMole,
    showMole
  } = useGameLogic(difficulty)

  // 键盘事件处理
  useKeyboardHandler((key) => {
    if (gameState === GAME_STATES.PLAYING) {
      // 恢复音频上下文（用户交互后）
      soundSettings.resumeContext()

      const hitMoleData = moles.find(mole =>
        mole.letter.toLowerCase() === key.toLowerCase() && mole.isVisible
      )

      if (hitMoleData) {
        hitMole(hitMoleData.id)
        playSound.hit()
      } else {
        // 按错键的音效
        playSound.key()
      }
    }
  })

  // 游戏开始
  const handleStartGame = useCallback((selectedDifficulty) => {
    setDifficulty(selectedDifficulty)
    setGameState(GAME_STATES.PLAYING)
    startGame()
    playSound.start()
    soundSettings.resumeContext()
  }, [startGame])

  // 游戏结束
  const handleEndGame = useCallback(() => {
    setGameState(GAME_STATES.END)
    endGame()
    playSound.end()

    // 保存游戏统计
    storage.saveStats({ score, hits: gameStats.hits, misses: gameStats.misses })

    // 检查是否创造新纪录
    const isNewRecord = storage.saveHighScore(score, difficulty)
    if (isNewRecord) {
      // 可以在这里添加新纪录的特殊效果
      console.log('新纪录！')
    }
  }, [endGame, score, gameStats, difficulty])

  // 重新开始游戏
  const handleRestartGame = useCallback(() => {
    resetGame()
    setGameState(GAME_STATES.START)
  }, [resetGame])

  // 暂停/继续游戏
  const handlePauseGame = useCallback(() => {
    setGameState(gameState === GAME_STATES.PAUSED ? GAME_STATES.PLAYING : GAME_STATES.PAUSED)
  }, [gameState])

  // 测试生成地鼠
  const handleTestSpawn = useCallback(() => {
    console.log('🧪 手动测试生成地鼠')
    showMole()
  }, [showMole])

  // 切换调试模式
  const toggleDebugMode = useCallback(() => {
    setDebugMode(prev => !prev)
    console.log(`🔧 调试模式: ${!debugMode ? '开启' : '关闭'}`)
  }, [debugMode])

  // 监听游戏结束条件
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING && (timeLeft <= 0 || lives <= 0)) {
      handleEndGame()
    }
  }, [timeLeft, lives, gameState, handleEndGame])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 overflow-hidden">
      <AnimatePresence mode="wait">
        {gameState === GAME_STATES.START && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <StartScreen
              onStartGame={handleStartGame}
              debugMode={debugMode}
              onToggleDebug={toggleDebugMode}
            />
          </motion.div>
        )}

        {(gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.PAUSED) && (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <GameScreen
              score={score}
              timeLeft={timeLeft}
              lives={lives}
              moles={moles}
              isPaused={gameState === GAME_STATES.PAUSED}
              onPause={handlePauseGame}
              onEndGame={handleEndGame}
              difficulty={difficulty}
              onTestSpawn={handleTestSpawn}
              debugMode={debugMode}
              onToggleDebug={toggleDebugMode}
            />
          </motion.div>
        )}

        {gameState === GAME_STATES.END && (
          <motion.div
            key="end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <EndScreen
              score={score}
              gameStats={gameStats}
              onRestartGame={handleRestartGame}
              difficulty={difficulty}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 性能监控 */}
      {debugMode && (
        <PerformanceMonitor
          isVisible={showPerformanceMonitor}
          onToggle={() => setShowPerformanceMonitor(!showPerformanceMonitor)}
        />
      )}
    </div>
  )
}

export default App
