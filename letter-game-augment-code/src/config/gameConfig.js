// 游戏配置文件

// 游戏基础设置
export const GAME_CONFIG = {
  // 游戏时长（秒）
  GAME_DURATION: 60,
  
  // 最大生命值
  MAX_LIVES: 3,
  
  // 地鼠洞数量
  MOLE_COUNT: 12,
  
  // 字母表
  LETTERS: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  
  // 游戏状态
  GAME_STATES: {
    START: 'start',
    PLAYING: 'playing',
    PAUSED: 'paused',
    END: 'end'
  }
}

// 难度设置
export const DIFFICULTY_CONFIG = {
  easy: {
    name: '简单',
    description: '慢速度，适合初学者',
    color: 'from-green-400 to-green-600',
    textColor: 'text-green-400',
    icon: '🐌',
    spawnInterval: 2000,      // 地鼠出现间隔（毫秒）
    moleLifetime: 3000,       // 地鼠停留时间（毫秒）
    pointsPerHit: 10,         // 每次击中得分
    speedIncrease: 0.95,      // 速度递增系数
    maxConcurrentMoles: 3     // 最大同时出现的地鼠数
  },
  medium: {
    name: '中等',
    description: '中等速度，有一定挑战',
    color: 'from-yellow-400 to-orange-500',
    textColor: 'text-yellow-400',
    icon: '🐰',
    spawnInterval: 1500,
    moleLifetime: 2500,
    pointsPerHit: 15,
    speedIncrease: 0.9,
    maxConcurrentMoles: 4
  },
  hard: {
    name: '困难',
    description: '快速度，挑战你的极限',
    color: 'from-red-400 to-red-600',
    textColor: 'text-red-400',
    icon: '🚀',
    spawnInterval: 1000,
    moleLifetime: 2000,
    pointsPerHit: 20,
    speedIncrease: 0.85,
    maxConcurrentMoles: 5
  }
}

// 音效配置
export const SOUND_CONFIG = {
  // 音效类型和频率
  SOUNDS: {
    hit: {
      frequencies: [523, 659, 784], // C5, E5, G5
      durations: [100, 100, 150],
      delays: [0, 50, 100],
      type: 'sine'
    },
    miss: {
      frequencies: [220],
      durations: [300],
      delays: [0],
      type: 'sawtooth'
    },
    start: {
      frequencies: [262, 294, 330, 349, 392, 440, 494, 523],
      durations: [150, 150, 150, 150, 150, 150, 150, 150],
      delays: [0, 100, 200, 300, 400, 500, 600, 700],
      type: 'triangle'
    },
    end: {
      frequencies: [523, 494, 440, 392, 349, 330, 294, 262],
      durations: [200, 200, 200, 200, 200, 200, 200, 200],
      delays: [0, 150, 300, 450, 600, 750, 900, 1050],
      type: 'sine'
    },
    key: {
      frequencies: [800],
      durations: [50],
      delays: [0],
      type: 'square'
    },
    moleAppear: {
      frequencies: [400, 500],
      durations: [100, 100],
      delays: [0, 50],
      type: 'triangle'
    }
  },
  
  // 默认音量
  DEFAULT_VOLUME: 0.5,
  
  // 音效开关
  DEFAULT_SOUND_ENABLED: true
}

// 动画配置
export const ANIMATION_CONFIG = {
  // 页面切换动画
  PAGE_TRANSITION: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.5 }
  },
  
  // 地鼠动画
  MOLE_ANIMATION: {
    hidden: { y: 100, scale: 0.8, opacity: 0 },
    visible: { 
      y: 0, 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    hit: {
      scale: [1, 1.3, 0],
      rotate: [0, 10, -10, 0],
      opacity: [1, 1, 0],
      transition: { duration: 0.5 }
    },
    exit: {
      y: 100,
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.3 }
    }
  },
  
  // 按钮动画
  BUTTON_ANIMATION: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.2 }
  },
  
  // 得分弹出动画
  SCORE_POPUP: {
    initial: { y: 0, opacity: 1, scale: 1 },
    animate: { y: -30, opacity: 0, scale: 1.2 },
    transition: { duration: 1 }
  }
}

// UI配置
export const UI_CONFIG = {
  // 颜色主题
  COLORS: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    game: {
      bg: '#1a1a2e',
      surface: '#16213e',
      accent: '#e94560',
      success: '#0f3460',
      warning: '#f39c12',
    }
  },
  
  // 断点
  BREAKPOINTS: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  
  // Z-index层级
  Z_INDEX: {
    modal: 50,
    overlay: 40,
    dropdown: 30,
    header: 20,
    default: 1
  }
}

// 性能配置
export const PERFORMANCE_CONFIG = {
  // FPS监控
  FPS_MONITORING: {
    enabled: process.env.NODE_ENV === 'development',
    warningThreshold: 30,
    updateInterval: 1000
  },
  
  // 内存监控
  MEMORY_MONITORING: {
    enabled: process.env.NODE_ENV === 'development',
    warningThreshold: 0.8, // 80%
    checkInterval: 5000
  },
  
  // 动画优化
  ANIMATION_OPTIMIZATION: {
    reduceMotion: false,
    maxConcurrentAnimations: 10,
    useGPUAcceleration: true
  }
}

// 存储配置
export const STORAGE_CONFIG = {
  // 本地存储键名
  KEYS: {
    HIGH_SCORE: 'highScore',
    GAME_SETTINGS: 'gameSettings',
    GAME_STATS: 'gameStats',
    USER_PREFERENCES: 'userPreferences'
  },
  
  // 默认设置
  DEFAULT_SETTINGS: {
    soundEnabled: SOUND_CONFIG.DEFAULT_SOUND_ENABLED,
    volume: SOUND_CONFIG.DEFAULT_VOLUME,
    difficulty: 'easy',
    showFPS: false,
    reduceMotion: false
  },
  
  // 默认统计
  DEFAULT_STATS: {
    totalGames: 0,
    totalScore: 0,
    totalHits: 0,
    totalMisses: 0,
    bestAccuracy: 0,
    playTime: 0
  }
}

// 开发配置
export const DEV_CONFIG = {
  // 调试模式
  DEBUG_MODE: process.env.NODE_ENV === 'development',
  
  // 控制台日志
  CONSOLE_LOGGING: {
    enabled: process.env.NODE_ENV === 'development',
    levels: ['error', 'warn', 'info', 'debug']
  },
  
  // 测试模式
  TEST_MODE: {
    enabled: false,
    autoPlay: false,
    skipAnimations: false
  }
}

// 导出所有配置
export default {
  GAME_CONFIG,
  DIFFICULTY_CONFIG,
  SOUND_CONFIG,
  ANIMATION_CONFIG,
  UI_CONFIG,
  PERFORMANCE_CONFIG,
  STORAGE_CONFIG,
  DEV_CONFIG
}
