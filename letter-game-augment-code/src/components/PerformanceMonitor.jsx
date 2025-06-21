import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Monitor, X, Activity, Zap, HardDrive } from 'lucide-react'
import { usePerformanceOptimization } from '../hooks/usePerformanceOptimization'
import { PERFORMANCE_CONFIG } from '../config/gameConfig'

const PerformanceMonitor = ({ isVisible, onToggle }) => {
  const [stats, setStats] = useState({
    fps: 0,
    memory: null,
    frameDrops: 0,
    averageFrameTime: 16.67
  })
  
  const { monitorFPS, getCurrentFPS, checkMemoryUsage } = usePerformanceOptimization()

  useEffect(() => {
    if (!PERFORMANCE_CONFIG.FPS_MONITORING.enabled) return

    // 开始FPS监控
    monitorFPS()

    // 定期更新统计信息
    const updateInterval = setInterval(() => {
      setStats(prevStats => ({
        ...prevStats,
        fps: getCurrentFPS(),
        memory: checkMemoryUsage()
      }))
    }, PERFORMANCE_CONFIG.FPS_MONITORING.updateInterval)

    return () => {
      clearInterval(updateInterval)
    }
  }, [monitorFPS, getCurrentFPS, checkMemoryUsage])

  // 获取FPS状态颜色
  const getFPSColor = (fps) => {
    if (fps >= 50) return 'text-green-400'
    if (fps >= 30) return 'text-yellow-400'
    return 'text-red-400'
  }

  // 获取内存使用状态颜色
  const getMemoryColor = (memory) => {
    if (!memory) return 'text-gray-400'
    const usage = memory.used / memory.limit
    if (usage < 0.5) return 'text-green-400'
    if (usage < 0.8) return 'text-yellow-400'
    return 'text-red-400'
  }

  if (!PERFORMANCE_CONFIG.FPS_MONITORING.enabled) {
    return null
  }

  return (
    <>
      {/* 切换按钮 */}
      <motion.button
        className="fixed top-4 left-4 z-50 p-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="性能监控"
      >
        <Monitor size={20} />
      </motion.button>

      {/* 性能监控面板 */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed top-16 left-4 z-40 bg-black/80 backdrop-blur-md rounded-xl p-4 border border-white/20 min-w-[250px]"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            {/* 标题栏 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="text-blue-400" size={20} />
                <h3 className="text-white font-semibold">性能监控</h3>
              </div>
              <button
                onClick={onToggle}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="text-white/70" size={16} />
              </button>
            </div>

            {/* 性能指标 */}
            <div className="space-y-3">
              {/* FPS */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-yellow-400" />
                  <span className="text-white/90 text-sm">FPS</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-sm ${getFPSColor(stats.fps)}`}>
                    {stats.fps}
                  </span>
                  <div className="w-12 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        stats.fps >= 50 ? 'bg-green-400' :
                        stats.fps >= 30 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${Math.min(stats.fps / 60 * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 内存使用 */}
              {stats.memory && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive size={16} className="text-purple-400" />
                    <span className="text-white/90 text-sm">内存</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-sm ${getMemoryColor(stats.memory)}`}>
                      {stats.memory.used}MB
                    </span>
                    <div className="w-12 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getMemoryColor(stats.memory).replace('text-', 'bg-')}`}
                        style={{ width: `${(stats.memory.used / stats.memory.limit) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 平均帧时间 */}
              <div className="flex items-center justify-between">
                <span className="text-white/90 text-sm">帧时间</span>
                <span className="text-white/70 font-mono text-sm">
                  {stats.averageFrameTime.toFixed(1)}ms
                </span>
              </div>

              {/* 性能警告 */}
              {stats.fps < PERFORMANCE_CONFIG.FPS_MONITORING.warningThreshold && (
                <motion.div
                  className="bg-red-500/20 border border-red-500/30 rounded-lg p-2 mt-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 text-xs">⚠️</span>
                    <span className="text-red-300 text-xs">
                      FPS过低，可能影响游戏体验
                    </span>
                  </div>
                </motion.div>
              )}

              {stats.memory && (stats.memory.used / stats.memory.limit) > PERFORMANCE_CONFIG.MEMORY_MONITORING.warningThreshold && (
                <motion.div
                  className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-2 mt-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-orange-400 text-xs">⚠️</span>
                    <span className="text-orange-300 text-xs">
                      内存使用过高
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* 性能建议 */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <h4 className="text-white/80 text-xs font-semibold mb-2">性能提示</h4>
              <div className="space-y-1 text-xs text-white/60">
                {stats.fps < 30 && (
                  <div>• 尝试关闭其他浏览器标签页</div>
                )}
                {stats.memory && (stats.memory.used / stats.memory.limit) > 0.8 && (
                  <div>• 考虑刷新页面释放内存</div>
                )}
                <div>• 建议使用Chrome或Firefox浏览器</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default PerformanceMonitor
