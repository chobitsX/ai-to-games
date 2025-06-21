import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MoleHole = ({ mole, index, isPaused }) => {
  const moleVariants = {
    hidden: {
      y: 100,
      scale: 0.8,
      opacity: 0
    },
    visible: {
      y: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hit: {
      scale: [1, 1.3, 0],
      rotate: [0, 10, -10, 0],
      opacity: [1, 1, 0],
      transition: {
        duration: 0.5
      }
    },
    exit: {
      y: 100,
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  }

  const letterVariants = {
    idle: {
      rotate: [-2, 2, -2],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    hit: {
      scale: [1, 1.5, 0],
      rotate: [0, 180, 360],
      transition: {
        duration: 0.5
      }
    }
  }

  const holeVariants = {
    idle: {
      scale: 1
    },
    active: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <motion.div
      className="relative aspect-square"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      {/* 地洞 */}
      <motion.div
        className="mole-hole w-full h-full relative"
        variants={holeVariants}
        animate={mole.isVisible ? "active" : "idle"}
      >
        {/* 地洞阴影效果 */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40 rounded-full" />
        
        {/* 地鼠 */}
        <AnimatePresence>
          {mole.isVisible && !isPaused && (
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-20 md:w-20 md:h-24"
              variants={moleVariants}
              initial="hidden"
              animate={mole.isHit ? "hit" : "visible"}
              exit="exit"
            >
              {/* 地鼠身体 */}
              <div className="relative w-full h-full">
                {/* 地鼠头部 */}
                <div className="absolute bottom-0 w-full h-3/4 bg-gradient-to-b from-amber-600 to-amber-800 rounded-t-full border-2 border-amber-900">
                  {/* 眼睛 */}
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-black rounded-full" />
                  <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-black rounded-full" />
                  
                  {/* 鼻子 */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-400 rounded-full" />
                  
                  {/* 嘴巴 */}
                  <div className="absolute top-3/5 left-1/2 transform -translate-x-1/2 w-3 h-1 border-b-2 border-black rounded-b-full" />
                </div>

                {/* 字母牌子 */}
                <motion.div
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-12 h-12 md:w-14 md:h-14 bg-white rounded-lg shadow-lg border-2 border-gray-300 flex items-center justify-center"
                  variants={letterVariants}
                  animate={mole.isHit ? "hit" : "idle"}
                >
                  <span className="text-2xl md:text-3xl font-bold text-gray-800">
                    {mole.letter}
                  </span>
                </motion.div>

                {/* 击中效果 */}
                {mole.isHit && (
                  <motion.div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-2xl"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
                    transition={{ duration: 0.6 }}
                  >
                    ⭐
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 洞口装饰 */}
        <div className="absolute top-0 left-0 w-full h-full border-4 border-amber-900 rounded-full opacity-30" />
        
        {/* 草地装饰 */}
        <div className="absolute -top-2 left-1/4 w-2 h-4 bg-green-500 rounded-t-full transform rotate-12" />
        <div className="absolute -top-1 right-1/3 w-1 h-3 bg-green-400 rounded-t-full transform -rotate-12" />
        <div className="absolute -top-2 right-1/4 w-2 h-3 bg-green-600 rounded-t-full transform rotate-45" />
      </motion.div>

      {/* 得分弹出效果 */}
      <AnimatePresence>
        {mole.showScore && (
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold text-xl pointer-events-none"
            initial={{ y: 0, opacity: 1, scale: 1 }}
            animate={{ y: -30, opacity: 0, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            +{mole.points}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default MoleHole
