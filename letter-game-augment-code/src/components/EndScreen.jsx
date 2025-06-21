import React from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Home, Trophy, Target, Clock, Zap } from 'lucide-react'

const EndScreen = ({ score, gameStats, onRestartGame, difficulty }) => {
  const getDifficultyInfo = () => {
    switch (difficulty) {
      case 'easy':
        return { name: '简单', color: 'text-green-400', emoji: '🐌' }
      case 'medium':
        return { name: '中等', color: 'text-yellow-400', emoji: '🐰' }
      case 'hard':
        return { name: '困难', color: 'text-red-400', emoji: '🚀' }
      default:
        return { name: '未知', color: 'text-white', emoji: '❓' }
    }
  }

  const getScoreRating = () => {
    if (score >= 1000) return { rating: '传奇大师', emoji: '👑', color: 'text-yellow-400' }
    if (score >= 800) return { rating: '超级高手', emoji: '🏆', color: 'text-purple-400' }
    if (score >= 600) return { rating: '键盘达人', emoji: '⭐', color: 'text-blue-400' }
    if (score >= 400) return { rating: '不错哦', emoji: '👍', color: 'text-green-400' }
    if (score >= 200) return { rating: '继续努力', emoji: '💪', color: 'text-orange-400' }
    return { rating: '加油练习', emoji: '🌱', color: 'text-gray-400' }
  }

  const difficultyInfo = getDifficultyInfo()
  const scoreRating = getScoreRating()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="text-center max-w-2xl mx-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* 游戏结束标题 */}
        <motion.div
          className="mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="game-title text-5xl md:text-6xl font-bold text-white mb-2">
            游戏结束
          </h1>
          <p className="text-xl text-white/80">
            你的键盘技能正在提升！
          </p>
        </motion.div>

        {/* 得分展示 */}
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="text-center mb-6">
            <div className="text-6xl mb-2">{scoreRating.emoji}</div>
            <div className={`text-2xl font-bold ${scoreRating.color} mb-2`}>
              {scoreRating.rating}
            </div>
            <div className="text-5xl font-bold text-white mb-2">{score}</div>
            <div className="text-white/80">最终得分</div>
          </div>

          {/* 游戏统计 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Target className="text-green-400" size={24} />
              </div>
              <div className="text-2xl font-bold text-white">{gameStats.hits}</div>
              <div className="text-white/80 text-sm">击中</div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Zap className="text-red-400" size={24} />
              </div>
              <div className="text-2xl font-bold text-white">{gameStats.misses}</div>
              <div className="text-white/80 text-sm">错过</div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="text-yellow-400" size={24} />
              </div>
              <div className="text-2xl font-bold text-white">
                {gameStats.hits > 0 ? Math.round((gameStats.hits / (gameStats.hits + gameStats.misses)) * 100) : 0}%
              </div>
              <div className="text-white/80 text-sm">准确率</div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <div className={`text-2xl ${difficultyInfo.color}`}>
                  {difficultyInfo.emoji}
                </div>
              </div>
              <div className={`text-lg font-bold ${difficultyInfo.color}`}>
                {difficultyInfo.name}
              </div>
              <div className="text-white/80 text-sm">难度</div>
            </div>
          </div>
        </motion.div>

        {/* 鼓励信息 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-white/20">
            <p className="text-white/90 text-lg">
              {score >= 800 ? "太棒了！你是真正的键盘大师！" :
               score >= 600 ? "很不错！继续练习会更棒！" :
               score >= 400 ? "不错的开始，多练习会进步很快！" :
               score >= 200 ? "继续努力，你一定可以做得更好！" :
               "别灰心，每次练习都是进步！"}
            </p>
          </div>
        </motion.div>

        {/* 按钮组 */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.button
            className="game-button flex items-center gap-2 text-xl px-8 py-4"
            onClick={onRestartGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={24} />
            再玩一次
          </motion.button>

          <motion.button
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white/90 border-2 border-white/30 hover:bg-white/10 transition-all duration-300"
            onClick={onRestartGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home size={20} />
            返回主页
          </motion.button>
        </motion.div>

        {/* 装饰性元素 */}
        <motion.div
          className="absolute top-20 left-20 text-4xl opacity-30"
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          🌟
        </motion.div>
        
        <motion.div
          className="absolute bottom-20 right-20 text-4xl opacity-30"
          animate={{ 
            rotate: -360,
            y: [0, -10, 0]
          }}
          transition={{ 
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          🎉
        </motion.div>
      </motion.div>
    </div>
  )
}

export default EndScreen
