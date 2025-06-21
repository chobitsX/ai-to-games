import { useState, useEffect, useCallback, useRef } from 'react'
import { playSound } from '../utils/soundEffects'
import { GAME_CONFIG, DIFFICULTY_CONFIG } from '../config/gameConfig'

const { LETTERS, GAME_DURATION, MAX_LIVES, MOLE_COUNT } = GAME_CONFIG

export const useGameLogic = (difficulty = 'easy') => {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [lives, setLives] = useState(MAX_LIVES)
  const [moles, setMoles] = useState([])
  const [gameStats, setGameStats] = useState({ hits: 0, misses: 0 })
  const [isGameActive, setIsGameActive] = useState(false)
  
  const gameTimerRef = useRef(null)
  const spawnTimerRef = useRef(null)
  const moleTimersRef = useRef({})
  const currentSpeedRef = useRef(1)
  const speedTimerRef = useRef(null)

  const settings = DIFFICULTY_CONFIG[difficulty]

  // 初始化地鼠洞
  const initializeMoles = useCallback(() => {
    console.log(`🕳️ 初始化 ${MOLE_COUNT} 个地鼠洞`)
    const initialMoles = Array.from({ length: MOLE_COUNT }, (_, index) => ({
      id: index,
      letter: '',
      isVisible: false,
      isHit: false,
      showScore: false,
      points: 0
    }))
    setMoles(initialMoles)
    console.log('✅ 地鼠洞初始化完成')
  }, [])

  // 生成随机字母
  const getRandomLetter = () => {
    return LETTERS[Math.floor(Math.random() * LETTERS.length)]
  }

  // 显示地鼠
  const showMole = useCallback(() => {
    console.log(`🔍 showMole被调用，isGameActive: ${isGameActive}`)
    if (!isGameActive) {
      console.log('❌ 游戏未激活，跳过生成地鼠')
      return
    }

    setMoles(prevMoles => {
      const availableHoles = prevMoles.filter(mole => !mole.isVisible)
      console.log(`🕳️ 可用洞穴数量: ${availableHoles.length}`)

      if (availableHoles.length === 0) {
        console.log('⚠️ 没有可用的洞穴')
        return prevMoles
      }

      const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)]
      const letter = getRandomLetter()
      console.log(`🎯 在洞穴 ${randomHole.id} 生成字母 ${letter}`)

      // 播放地鼠出现音效
      playSound.moleAppear()

      const newMoles = prevMoles.map(mole =>
        mole.id === randomHole.id
          ? { ...mole, letter, isVisible: true, isHit: false, showScore: false }
          : mole
      )

      console.log(`✅ 地鼠已生成，可见地鼠数量: ${newMoles.filter(m => m.isVisible).length}`)
      return newMoles
    })
  }, [isGameActive])

  // 隐藏地鼠
  const hideMole = useCallback((moleId, isTimeout = false) => {
    setMoles(prevMoles => 
      prevMoles.map(mole => 
        mole.id === moleId 
          ? { ...mole, isVisible: false, isHit: false, showScore: false }
          : mole
      )
    )

    // 清除定时器
    if (moleTimersRef.current[moleId]) {
      clearTimeout(moleTimersRef.current[moleId])
      delete moleTimersRef.current[moleId]
    }

    // 如果是超时消失，扣除生命值
    if (isTimeout && isGameActive) {
      setLives(prevLives => Math.max(0, prevLives - 1))
      setGameStats(prevStats => ({ ...prevStats, misses: prevStats.misses + 1 }))
      playSound.miss()
    }
  }, [isGameActive])

  // 击中地鼠
  const hitMole = useCallback((moleId) => {
    const mole = moles.find(m => m.id === moleId && m.isVisible && !m.isHit)
    if (!mole) return

    const points = settings.pointsPerHit
    
    setMoles(prevMoles => 
      prevMoles.map(m => 
        m.id === moleId 
          ? { ...m, isHit: true, showScore: true, points }
          : m
      )
    )

    setScore(prevScore => prevScore + points)
    setGameStats(prevStats => ({ ...prevStats, hits: prevStats.hits + 1 }))

    // 延迟隐藏地鼠
    setTimeout(() => {
      hideMole(moleId)
    }, 500)
  }, [moles, settings.pointsPerHit, hideMole])

  // 错过地鼠
  const missedMole = useCallback(() => {
    setLives(prevLives => Math.max(0, prevLives - 1))
    setGameStats(prevStats => ({ ...prevStats, misses: prevStats.misses + 1 }))
  }, [])

  // 开始游戏
  const startGame = useCallback(() => {
    console.log('🎮 开始游戏')
    setIsGameActive(true)
    setScore(0)
    setTimeLeft(GAME_DURATION)
    setLives(MAX_LIVES)
    setGameStats({ hits: 0, misses: 0 })
    currentSpeedRef.current = 1
    initializeMoles()

    // 游戏计时器
    gameTimerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    // 内部地鼠生成函数
    const spawnMole = () => {
      console.log(`🐹 尝试生成地鼠`)

      // 直接在这里生成地鼠，不依赖外部的showMole函数
      setMoles(prevMoles => {
        const availableHoles = prevMoles.filter(mole => !mole.isVisible)
        console.log(`🕳️ 可用洞穴数量: ${availableHoles.length}`)

        if (availableHoles.length === 0) {
          console.log('⚠️ 没有可用的洞穴')
          return prevMoles
        }

        const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)]
        const letter = getRandomLetter()
        console.log(`🎯 在洞穴 ${randomHole.id} 生成字母 ${letter}`)

        // 播放地鼠出现音效
        playSound.moleAppear()

        // 设置地鼠消失定时器
        const lifetime = settings.moleLifetime / currentSpeedRef.current
        console.log(`⏱️ 地鼠 ${randomHole.id} 将在 ${lifetime}ms 后消失`)
        moleTimersRef.current[randomHole.id] = setTimeout(() => {
          hideMole(randomHole.id, true)
        }, lifetime)

        const newMoles = prevMoles.map(mole =>
          mole.id === randomHole.id
            ? { ...mole, letter, isVisible: true, isHit: false, showScore: false }
            : mole
        )

        console.log(`✅ 地鼠已生成，可见地鼠数量: ${newMoles.filter(m => m.isVisible).length}`)
        return newMoles
      })
    }

    // 地鼠生成定时器
    const startSpawning = () => {
      spawnMole()
      const nextSpawnTime = settings.spawnInterval / currentSpeedRef.current
      console.log(`⏰ 下次生成时间: ${nextSpawnTime}ms`)
      spawnTimerRef.current = setTimeout(startSpawning, nextSpawnTime)
    }

    // 延迟开始生成地鼠
    console.log('⏳ 1秒后开始生成地鼠')
    setTimeout(startSpawning, 1000)

    // 难度递增定时器
    speedTimerRef.current = setInterval(() => {
      currentSpeedRef.current = Math.min(currentSpeedRef.current / settings.speedIncrease, 3)
      console.log(`⚡ 速度增加到: ${currentSpeedRef.current}`)
    }, 10000) // 每10秒增加难度
  }, [initializeMoles, settings, hideMole])

  // 结束游戏
  const endGame = useCallback(() => {
    setIsGameActive(false)
    
    // 清除所有定时器
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current)
      gameTimerRef.current = null
    }
    
    if (spawnTimerRef.current) {
      clearTimeout(spawnTimerRef.current)
      spawnTimerRef.current = null
    }

    if (speedTimerRef.current) {
      clearInterval(speedTimerRef.current)
      speedTimerRef.current = null
    }
    
    // 清除所有地鼠定时器
    Object.values(moleTimersRef.current).forEach(timer => clearTimeout(timer))
    moleTimersRef.current = {}

    // 隐藏所有地鼠
    setMoles(prevMoles => 
      prevMoles.map(mole => ({ ...mole, isVisible: false, isHit: false, showScore: false }))
    )
  }, [])

  // 重置游戏
  const resetGame = useCallback(() => {
    endGame()
    setScore(0)
    setTimeLeft(GAME_DURATION)
    setLives(MAX_LIVES)
    setGameStats({ hits: 0, misses: 0 })
    currentSpeedRef.current = 1
    initializeMoles()
  }, [endGame, initializeMoles])

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      endGame()
    }
  }, [endGame])

  // 初始化
  useEffect(() => {
    initializeMoles()
  }, [initializeMoles])

  return {
    score,
    timeLeft,
    lives,
    moles,
    gameStats,
    isGameActive,
    startGame,
    endGame,
    resetGame,
    hitMole,
    missedMole,
    showMole
  }
}
