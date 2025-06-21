// 音效管理工具
class SoundManager {
  constructor() {
    this.audioContext = null
    this.sounds = {}
    this.isMuted = false
    this.volume = 0.5
    
    // 初始化音频上下文
    this.initAudioContext()
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
    }
  }

  // 创建音效
  createBeep(frequency = 440, duration = 200, type = 'sine') {
    if (!this.audioContext || this.isMuted) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
    oscillator.type = type

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration / 1000)
  }

  // 播放击中音效
  playHitSound() {
    // 播放一个愉快的音效序列
    this.createBeep(523, 100, 'sine') // C5
    setTimeout(() => this.createBeep(659, 100, 'sine'), 50) // E5
    setTimeout(() => this.createBeep(784, 150, 'sine'), 100) // G5
  }

  // 播放错过音效
  playMissSound() {
    // 播放一个低沉的音效
    this.createBeep(220, 300, 'sawtooth') // A3
  }

  // 播放游戏开始音效
  playStartSound() {
    // 播放上升音阶
    const notes = [262, 294, 330, 349, 392, 440, 494, 523] // C大调音阶
    notes.forEach((freq, index) => {
      setTimeout(() => this.createBeep(freq, 150, 'triangle'), index * 100)
    })
  }

  // 播放游戏结束音效
  playEndSound() {
    // 播放下降音阶
    const notes = [523, 494, 440, 392, 349, 330, 294, 262] // C大调音阶（下降）
    notes.forEach((freq, index) => {
      setTimeout(() => this.createBeep(freq, 200, 'sine'), index * 150)
    })
  }

  // 播放按键音效
  playKeySound() {
    this.createBeep(800, 50, 'square')
  }

  // 播放地鼠出现音效
  playMoleAppearSound() {
    this.createBeep(400, 100, 'triangle')
    setTimeout(() => this.createBeep(500, 100, 'triangle'), 50)
  }

  // 设置音量
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  // 静音/取消静音
  toggleMute() {
    this.isMuted = !this.isMuted
    return this.isMuted
  }

  // 恢复音频上下文（用户交互后）
  resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }
}

// 创建全局音效管理器实例
export const soundManager = new SoundManager()

// 音效播放函数
export const playSound = {
  hit: () => soundManager.playHitSound(),
  miss: () => soundManager.playMissSound(),
  start: () => soundManager.playStartSound(),
  end: () => soundManager.playEndSound(),
  key: () => soundManager.playKeySound(),
  moleAppear: () => soundManager.playMoleAppearSound()
}

// 音效设置
export const soundSettings = {
  setVolume: (volume) => soundManager.setVolume(volume),
  toggleMute: () => soundManager.toggleMute(),
  resumeContext: () => soundManager.resumeAudioContext()
}
