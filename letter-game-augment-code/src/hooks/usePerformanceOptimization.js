import { useEffect, useCallback, useRef, useMemo, useState } from 'react'

// 性能优化Hook
export const usePerformanceOptimization = () => {
  const frameRef = useRef()
  const fpsRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const frameCountRef = useRef(0)

  // FPS监控
  const monitorFPS = useCallback(() => {
    const measureFPS = (currentTime) => {
      frameCountRef.current++
      
      if (currentTime - lastTimeRef.current >= 1000) {
        fpsRef.current = Math.round((frameCountRef.current * 1000) / (currentTime - lastTimeRef.current))
        frameCountRef.current = 0
        lastTimeRef.current = currentTime
        
        // 在开发模式下显示FPS警告
        if (process.env.NODE_ENV === 'development' && fpsRef.current < 30) {
          console.warn(`⚠️ 低FPS警告: ${fpsRef.current}fps`)
        }
      }
      
      frameRef.current = requestAnimationFrame(measureFPS)
    }
    
    frameRef.current = requestAnimationFrame(measureFPS)
  }, [])

  // 停止FPS监控
  const stopFPSMonitoring = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
    }
  }, [])

  // 获取当前FPS
  const getCurrentFPS = useCallback(() => fpsRef.current, [])

  // 内存监控
  const checkMemoryUsage = useCallback(() => {
    if (performance.memory) {
      const memory = performance.memory
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)
      const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024)
      const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      
      // 内存使用超过80%时发出警告
      if (usedMB / limitMB > 0.8) {
        console.warn(`⚠️ 内存使用过高: ${usedMB}MB / ${limitMB}MB`)
      }
      
      return { used: usedMB, total: totalMB, limit: limitMB }
    }
    return null
  }, [])

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      stopFPSMonitoring()
    }
  }, [stopFPSMonitoring])

  return {
    monitorFPS,
    stopFPSMonitoring,
    getCurrentFPS,
    checkMemoryUsage
  }
}

// 防抖Hook
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// 节流Hook
export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now())

  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args)
      lastRun.current = Date.now()
    }
  }, [callback, delay])
}

// 懒加载Hook
export const useLazyLoad = (ref, options = {}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
        }
      },
      {
        threshold: 0.1,
        ...options
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [ref, hasLoaded, options])

  return isVisible
}

// 预加载资源Hook
export const usePreloadResources = (resources = []) => {
  const [loadedResources, setLoadedResources] = useState(new Set())
  const [isLoading, setIsLoading] = useState(false)

  const preloadResource = useCallback((url, type = 'image') => {
    return new Promise((resolve, reject) => {
      if (type === 'image') {
        const img = new Image()
        img.onload = () => resolve(url)
        img.onerror = reject
        img.src = url
      } else if (type === 'audio') {
        const audio = new Audio()
        audio.oncanplaythrough = () => resolve(url)
        audio.onerror = reject
        audio.src = url
      } else {
        // 其他资源类型的预加载
        fetch(url)
          .then(() => resolve(url))
          .catch(reject)
      }
    })
  }, [])

  const preloadAll = useCallback(async () => {
    if (resources.length === 0) return

    setIsLoading(true)
    
    try {
      const promises = resources.map(resource => {
        if (typeof resource === 'string') {
          return preloadResource(resource)
        } else {
          return preloadResource(resource.url, resource.type)
        }
      })

      const loaded = await Promise.allSettled(promises)
      const successful = loaded
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value)

      setLoadedResources(new Set(successful))
    } catch (error) {
      console.error('资源预加载失败:', error)
    } finally {
      setIsLoading(false)
    }
  }, [resources, preloadResource])

  useEffect(() => {
    preloadAll()
  }, [preloadAll])

  return { loadedResources, isLoading, preloadAll }
}

// 游戏优化Hook
export const useGameOptimization = () => {
  const performanceRef = useRef({
    frameDrops: 0,
    lastFrameTime: performance.now(),
    averageFrameTime: 16.67 // 60fps = 16.67ms per frame
  })

  // 检测帧率下降
  const checkFrameDrop = useCallback(() => {
    const now = performance.now()
    const frameTime = now - performanceRef.current.lastFrameTime
    
    // 如果帧时间超过33ms（低于30fps），记录为帧率下降
    if (frameTime > 33) {
      performanceRef.current.frameDrops++
      
      if (process.env.NODE_ENV === 'development') {
        console.warn(`帧率下降: ${Math.round(1000 / frameTime)}fps`)
      }
    }
    
    // 更新平均帧时间（简单移动平均）
    performanceRef.current.averageFrameTime = 
      (performanceRef.current.averageFrameTime * 0.9) + (frameTime * 0.1)
    
    performanceRef.current.lastFrameTime = now
  }, [])

  // 获取性能统计
  const getPerformanceStats = useCallback(() => {
    return {
      frameDrops: performanceRef.current.frameDrops,
      averageFPS: Math.round(1000 / performanceRef.current.averageFrameTime),
      averageFrameTime: performanceRef.current.averageFrameTime
    }
  }, [])

  // 重置性能统计
  const resetPerformanceStats = useCallback(() => {
    performanceRef.current = {
      frameDrops: 0,
      lastFrameTime: performance.now(),
      averageFrameTime: 16.67
    }
  }, [])

  return {
    checkFrameDrop,
    getPerformanceStats,
    resetPerformanceStats
  }
}
