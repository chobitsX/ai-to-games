// 游戏工具函数

// 格式化时间显示
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 计算准确率
export const calculateAccuracy = (hits, misses) => {
  const total = hits + misses
  if (total === 0) return 0
  return Math.round((hits / total) * 100)
}

// 获取得分等级
export const getScoreRating = (score) => {
  if (score >= 1000) return { rating: '传奇大师', emoji: '👑', color: 'text-yellow-400' }
  if (score >= 800) return { rating: '超级高手', emoji: '🏆', color: 'text-purple-400' }
  if (score >= 600) return { rating: '键盘达人', emoji: '⭐', color: 'text-blue-400' }
  if (score >= 400) return { rating: '不错哦', emoji: '👍', color: 'text-green-400' }
  if (score >= 200) return { rating: '继续努力', emoji: '💪', color: 'text-orange-400' }
  return { rating: '加油练习', emoji: '🌱', color: 'text-gray-400' }
}

// 获取难度信息
export const getDifficultyInfo = (difficulty) => {
  switch (difficulty) {
    case 'easy':
      return { name: '简单', color: 'text-green-400', emoji: '🐌', bgColor: 'from-green-400 to-green-600' }
    case 'medium':
      return { name: '中等', color: 'text-yellow-400', emoji: '🐰', bgColor: 'from-yellow-400 to-orange-500' }
    case 'hard':
      return { name: '困难', color: 'text-red-400', emoji: '🚀', bgColor: 'from-red-400 to-red-600' }
    default:
      return { name: '未知', color: 'text-white', emoji: '❓', bgColor: 'from-gray-400 to-gray-600' }
  }
}

// 生成随机字母
export const getRandomLetter = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return letters[Math.floor(Math.random() * letters.length)]
}

// 生成随机位置
export const getRandomPosition = (maxX, maxY) => {
  return {
    x: Math.random() * maxX,
    y: Math.random() * maxY
  }
}

// 防抖函数
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 节流函数
export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 本地存储工具
export const storage = {
  // 保存最高分
  saveHighScore: (score, difficulty) => {
    const key = `highScore_${difficulty}`
    const currentHigh = localStorage.getItem(key)
    if (!currentHigh || score > parseInt(currentHigh)) {
      localStorage.setItem(key, score.toString())
      return true // 新纪录
    }
    return false
  },

  // 获取最高分
  getHighScore: (difficulty) => {
    const key = `highScore_${difficulty}`
    return parseInt(localStorage.getItem(key)) || 0
  },

  // 保存游戏设置
  saveSettings: (settings) => {
    localStorage.setItem('gameSettings', JSON.stringify(settings))
  },

  // 获取游戏设置
  getSettings: () => {
    const settings = localStorage.getItem('gameSettings')
    return settings ? JSON.parse(settings) : {
      soundEnabled: true,
      volume: 0.5,
      difficulty: 'easy'
    }
  },

  // 保存游戏统计
  saveStats: (stats) => {
    const currentStats = storage.getStats()
    const updatedStats = {
      totalGames: currentStats.totalGames + 1,
      totalScore: currentStats.totalScore + stats.score,
      totalHits: currentStats.totalHits + stats.hits,
      totalMisses: currentStats.totalMisses + stats.misses,
      bestAccuracy: Math.max(currentStats.bestAccuracy, calculateAccuracy(stats.hits, stats.misses))
    }
    localStorage.setItem('gameStats', JSON.stringify(updatedStats))
  },

  // 获取游戏统计
  getStats: () => {
    const stats = localStorage.getItem('gameStats')
    return stats ? JSON.parse(stats) : {
      totalGames: 0,
      totalScore: 0,
      totalHits: 0,
      totalMisses: 0,
      bestAccuracy: 0
    }
  }
}

// 动画缓动函数
export const easing = {
  easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOut: (t) => t * (2 - t),
  easeIn: (t) => t * t,
  bounce: (t) => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375
    }
  }
}

// 颜色工具
export const colors = {
  // 根据分数获取颜色
  getScoreColor: (score) => {
    if (score >= 1000) return '#fbbf24' // yellow-400
    if (score >= 800) return '#a855f7' // purple-500
    if (score >= 600) return '#3b82f6' // blue-500
    if (score >= 400) return '#10b981' // emerald-500
    if (score >= 200) return '#f97316' // orange-500
    return '#6b7280' // gray-500
  },

  // 根据时间获取颜色
  getTimeColor: (timeLeft, totalTime) => {
    const ratio = timeLeft / totalTime
    if (ratio > 0.5) return '#10b981' // green
    if (ratio > 0.25) return '#f59e0b' // yellow
    return '#ef4444' // red
  }
}
