import React from 'react'
import { motion } from 'framer-motion'

const GameStats = ({ score, timeLeft, lives }) => {
  return (
    <motion.div
      className="fixed top-20 right-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 min-w-[200px]"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-white/80">得分:</span>
          <motion.span 
            className="text-white font-bold text-lg"
            key={score}
            initial={{ scale: 1.2, color: '#fbbf24' }}
            animate={{ scale: 1, color: '#ffffff' }}
            transition={{ duration: 0.3 }}
          >
            {score}
          </motion.span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/80">时间:</span>
          <span className={`font-bold text-lg ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/80">生命:</span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-3 h-3 rounded-full ${i < lives ? 'bg-red-400' : 'bg-gray-400'}`}
                animate={i < lives ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5, repeat: i < lives ? Infinity : 0, repeatDelay: 1 }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default GameStats
