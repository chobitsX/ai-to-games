import { useEffect, useCallback, useState } from 'react'

export const useKeyboardHandler = (onKeyPress) => {
  const handleKeyDown = useCallback((event) => {
    // 防止默认行为
    event.preventDefault()
    
    // 只处理字母键
    const key = event.key.toUpperCase()
    if (key.length === 1 && key >= 'A' && key <= 'Z') {
      onKeyPress(key)
    }
  }, [onKeyPress])

  useEffect(() => {
    // 添加键盘事件监听器
    window.addEventListener('keydown', handleKeyDown)
    
    // 清理函数
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}

// 键盘按键可视化Hook
export const useKeyboardVisualizer = () => {
  const [pressedKeys, setPressedKeys] = useState(new Set())

  const handleKeyDown = useCallback((event) => {
    const key = event.key.toUpperCase()
    if (key.length === 1 && key >= 'A' && key <= 'Z') {
      setPressedKeys(prev => new Set([...prev, key]))
    }
  }, [])

  const handleKeyUp = useCallback((event) => {
    const key = event.key.toUpperCase()
    if (key.length === 1 && key >= 'A' && key <= 'Z') {
      setPressedKeys(prev => {
        const newSet = new Set(prev)
        newSet.delete(key)
        return newSet
      })
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  return pressedKeys
}
