import React from 'react'
import { motion } from 'framer-motion'
import { Pause, Play, Home, Clock, Heart, Trophy, Bug } from 'lucide-react'
import MoleHole from './MoleHole'
import GameStats from './GameStats'
import DebugPanel from './DebugPanel'
import MoleDebugger from './MoleDebugger'

const GameScreen = ({
  score,
  timeLeft,
  lives,
  moles,
  isPaused,
  onPause,
  onEndGame,
  difficulty,
  onTestSpawn,
  debugMode,
  onToggleDebug
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'hard': return 'text-red-400'
      default: return 'text-white'
    }
  }

  return (
    <div className="min-h-screen p-4 relative" data-testid="game-screen">
      {/* 顶部状态栏 */}
      <motion.div
        className="flex justify-between items-center mb-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-400" size={24} />
            <span className="text-white font-bold text-xl">{score}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="text-blue-400" size={24} />
            <span className="text-white font-bold text-xl">{formatTime(timeLeft)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Heart className="text-red-400" size={24} />
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  size={20}
                  className={i < lives ? 'text-red-400 fill-current' : 'text-gray-400'}
                />
              ))}
            </div>
          </div>

          <div className={`font-bold ${getDifficultyColor()}`}>
            {difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难'}
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-colors"
            onClick={onPause}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
            {isPaused ? '继续' : '暂停'}
          </motion.button>

          {process.env.NODE_ENV === 'development' && (
            <motion.button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-colors ${
                debugMode
                  ? 'bg-green-500/80 hover:bg-green-500'
                  : 'bg-gray-500/80 hover:bg-gray-500'
              }`}
              onClick={onToggleDebug}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="切换调试模式"
            >
              <Bug size={20} />
              调试
            </motion.button>
          )}

          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white font-semibold transition-colors"
            onClick={onEndGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home size={20} />
            结束
          </motion.button>
        </div>
      </motion.div>

      {/* 游戏区域 */}
      <div className="relative">
        {/* 地鼠洞网格 */}
        <motion.div
          className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 max-w-6xl mx-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {moles.map((mole, index) => (
            <MoleHole
              key={mole.id}
              mole={mole}
              index={index}
              isPaused={isPaused}
            />
          ))}
        </motion.div>

        {/* 暂停遮罩 */}
        {isPaused && (
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <motion.div
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⏸️
              </motion.div>
              <h2 className="text-4xl font-bold text-white mb-2">游戏暂停</h2>
              <p className="text-white/80">点击继续按钮恢复游戏</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* 游戏统计 */}
      <GameStats score={score} timeLeft={timeLeft} lives={lives} />

      {/* 调试面板 */}
      {debugMode && (
        <DebugPanel
          moles={moles}
          isGameActive={!isPaused}
          onTestSpawn={onTestSpawn}
        />
      )}

      {/* 地鼠状态调试器 */}
      <MoleDebugger moles={moles} debugMode={debugMode} />

      {/* 调试信息 */}
      {process.env.NODE_ENV === 'development' && debugMode && (
        <div className="fixed bottom-20 left-4 bg-black/80 text-white p-4 rounded-lg text-xs">
          <div>地鼠总数: {moles.length}</div>
          <div>可见地鼠: {moles.filter(m => m.isVisible).length}</div>
          <div>可见地鼠ID: {moles.filter(m => m.isVisible).map(m => `${m.id}(${m.letter})`).join(', ')}</div>
        </div>
      )}

      {/* 键盘提示 */}
      <motion.div
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <p className="text-white/80 text-sm">
          💡 看到字母就快速按下对应的键盘按键！
        </p>
      </motion.div>
    </div>
  )
}

export default GameScreen
