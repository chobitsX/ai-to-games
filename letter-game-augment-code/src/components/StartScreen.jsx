import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Settings, Trophy, Keyboard, Bug } from 'lucide-react'
import SettingsModal from './SettingsModal'

const DIFFICULTIES = {
  easy: {
    name: '简单',
    description: '慢速度，适合初学者',
    color: 'from-green-400 to-green-600',
    icon: '🐌'
  },
  medium: {
    name: '中等',
    description: '中等速度，有一定挑战',
    color: 'from-yellow-400 to-orange-500',
    icon: '🐰'
  },
  hard: {
    name: '困难',
    description: '快速度，挑战你的极限',
    color: 'from-red-400 to-red-600',
    icon: '🚀'
  }
}

const StartScreen = ({ onStartGame, debugMode, onToggleDebug }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy')
  const [showInstructions, setShowInstructions] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const handleStartGame = () => {
    onStartGame(selectedDifficulty)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-2xl mx-auto"
      >
        {/* 游戏标题 */}
        <motion.h1
          className="game-title text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-lg"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, type: "spring", bounce: 0.4 }}
        >
          字母打地鼠
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-white/90 mb-8 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          练习字母输入，提升键盘技能！
        </motion.p>

        {/* 难度选择 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">选择难度</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(DIFFICULTIES).map(([key, difficulty]) => (
              <motion.button
                key={key}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedDifficulty === key
                    ? 'border-white bg-white/20 scale-105'
                    : 'border-white/30 bg-white/10 hover:bg-white/20'
                }`}
                onClick={() => setSelectedDifficulty(key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-3xl mb-2">{difficulty.icon}</div>
                <div className="text-white font-bold text-lg">{difficulty.name}</div>
                <div className="text-white/80 text-sm">{difficulty.description}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* 按钮组 */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <motion.button
            className="game-button flex items-center gap-2 text-xl px-8 py-4"
            onClick={handleStartGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-testid="start-game-button"
          >
            <Play size={24} />
            开始游戏
          </motion.button>

          <motion.button
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white/90 border-2 border-white/30 hover:bg-white/10 transition-all duration-300"
            onClick={() => setShowInstructions(!showInstructions)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Keyboard size={20} />
            游戏说明
          </motion.button>

          <motion.button
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white/90 border-2 border-white/30 hover:bg-white/10 transition-all duration-300"
            onClick={() => setShowSettings(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings size={20} />
            设置
          </motion.button>

          {process.env.NODE_ENV === 'development' && (
            <motion.button
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                debugMode
                  ? 'bg-green-500/80 text-white border-2 border-green-400'
                  : 'text-white/90 border-2 border-white/30 hover:bg-white/10'
              }`}
              onClick={onToggleDebug}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bug size={20} />
              调试模式
            </motion.button>
          )}
        </motion.div>

        {/* 游戏说明 */}
        {showInstructions && (
          <motion.div
            className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-xl font-bold text-white mb-4">游戏规则</h4>
            <div className="text-white/90 text-left space-y-2">
              <p>• 地鼠会随机从洞中探出头，举着字母牌子</p>
              <p>• 快速按下键盘上对应的字母键来"打击"地鼠</p>
              <p>• 正确击中得分，错过或按错会扣生命值</p>
              <p>• 在时间结束前获得尽可能高的分数</p>
              <p>• 随着游戏进行，地鼠出现速度会越来越快</p>
            </div>
          </motion.div>
        )}

        {/* 装饰性元素 */}
        <motion.div
          className="absolute top-10 left-10 text-6xl opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          🎯
        </motion.div>
        <motion.div
          className="absolute bottom-10 right-10 text-6xl opacity-20"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          ⚡
        </motion.div>

        {/* 设置模态框 */}
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </motion.div>
    </div>
  )
}

export default StartScreen
