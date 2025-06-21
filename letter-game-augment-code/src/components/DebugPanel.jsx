import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const DebugPanel = ({ moles, isGameActive, onTestSpawn }) => {
  // 只在开发模式下显示
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const visibleMoles = moles.filter(m => m.isVisible)
  const hiddenMoles = moles.filter(m => !m.isVisible)

  return (
    <motion.div
      className="fixed top-32 left-4 z-40 bg-black/90 text-white p-4 rounded-lg text-xs max-w-xs"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <h3 className="font-bold mb-2">游戏调试信息</h3>

      <div className="space-y-2">
        <div>游戏状态: {isGameActive ? '进行中' : '未开始'}</div>
        <div>地鼠总数: {moles.length}</div>
        <div>可见地鼠: {visibleMoles.length}</div>
        <div>隐藏地鼠: {hiddenMoles.length}</div>

        {visibleMoles.length > 0 && (
          <div>
            <div className="font-semibold">可见地鼠:</div>
            {visibleMoles.map(mole => (
              <div key={mole.id} className="ml-2">
                ID:{mole.id} 字母:{mole.letter} 击中:{mole.isHit ? '是' : '否'}
              </div>
            ))}
          </div>
        )}

        <button
          className="mt-2 px-2 py-1 bg-blue-500 rounded text-xs"
          onClick={onTestSpawn}
          disabled={!isGameActive}
        >
          测试生成地鼠
        </button>
      </div>
    </motion.div>
  )
}

export default DebugPanel
