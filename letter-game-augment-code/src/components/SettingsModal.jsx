import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Volume2, VolumeX, Settings } from 'lucide-react'
import { soundSettings } from '../utils/soundEffects'
import { storage } from '../utils/gameUtils'

const SettingsModal = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    soundEnabled: true,
    volume: 0.5
  })

  // 加载设置
  useEffect(() => {
    const savedSettings = storage.getSettings()
    setSettings(savedSettings)
    soundSettings.setVolume(savedSettings.volume)
  }, [])

  // 保存设置
  const saveSettings = (newSettings) => {
    setSettings(newSettings)
    storage.saveSettings(newSettings)
    soundSettings.setVolume(newSettings.volume)
  }

  // 切换音效
  const toggleSound = () => {
    const newSettings = { ...settings, soundEnabled: !settings.soundEnabled }
    saveSettings(newSettings)
    soundSettings.toggleMute()
  }

  // 调整音量
  const handleVolumeChange = (e) => {
    const volume = parseFloat(e.target.value)
    const newSettings = { ...settings, volume }
    saveSettings(newSettings)
  }

  // 获取游戏统计
  const gameStats = storage.getStats()
  const highScores = {
    easy: storage.getHighScore('easy'),
    medium: storage.getHighScore('medium'),
    hard: storage.getHighScore('hard')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-white/20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 标题栏 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Settings className="text-white" size={24} />
                <h2 className="text-2xl font-bold text-white">游戏设置</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="text-white" size={20} />
              </button>
            </div>

            {/* 音效设置 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">音效设置</h3>
              
              <div className="space-y-4">
                {/* 音效开关 */}
                <div className="flex items-center justify-between">
                  <span className="text-white/90">音效</span>
                  <button
                    onClick={toggleSound}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      settings.soundEnabled 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    {settings.soundEnabled ? '开启' : '关闭'}
                  </button>
                </div>

                {/* 音量调节 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/90">音量</span>
                    <span className="text-white/70">{Math.round(settings.volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.volume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    disabled={!settings.soundEnabled}
                  />
                </div>
              </div>
            </div>

            {/* 最高分记录 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">最高分记录</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-500/20 rounded-lg p-3 text-center">
                  <div className="text-green-400 font-bold text-lg">{highScores.easy}</div>
                  <div className="text-white/70 text-sm">简单</div>
                </div>
                <div className="bg-yellow-500/20 rounded-lg p-3 text-center">
                  <div className="text-yellow-400 font-bold text-lg">{highScores.medium}</div>
                  <div className="text-white/70 text-sm">中等</div>
                </div>
                <div className="bg-red-500/20 rounded-lg p-3 text-center">
                  <div className="text-red-400 font-bold text-lg">{highScores.hard}</div>
                  <div className="text-white/70 text-sm">困难</div>
                </div>
              </div>
            </div>

            {/* 游戏统计 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">游戏统计</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white font-bold text-lg">{gameStats.totalGames}</div>
                  <div className="text-white/70">总游戏次数</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white font-bold text-lg">{gameStats.totalScore}</div>
                  <div className="text-white/70">总得分</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white font-bold text-lg">{gameStats.totalHits}</div>
                  <div className="text-white/70">总击中数</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white font-bold text-lg">{gameStats.bestAccuracy}%</div>
                  <div className="text-white/70">最佳准确率</div>
                </div>
              </div>
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="w-full game-button"
            >
              确定
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SettingsModal
