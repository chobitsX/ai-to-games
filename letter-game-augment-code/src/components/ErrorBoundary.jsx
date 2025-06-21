import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
          <motion.div
            className="text-center max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* 错误图标 */}
            <motion.div
              className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            >
              <AlertTriangle className="text-red-400" size={40} />
            </motion.div>

            {/* 错误标题 */}
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              哎呀！出错了
            </motion.h1>

            {/* 错误描述 */}
            <motion.p
              className="text-white/80 text-lg mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              游戏遇到了一个意外错误，请尝试刷新页面或重新开始。
            </motion.p>

            {/* 错误详情（开发模式） */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <motion.div
                className="bg-black/20 rounded-lg p-4 mb-6 text-left"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <h3 className="text-red-400 font-semibold mb-2">错误详情：</h3>
                <pre className="text-white/70 text-sm overflow-auto max-h-32">
                  {this.state.error.toString()}
                </pre>
              </motion.div>
            )}

            {/* 操作按钮 */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.button
                className="game-button flex items-center gap-2"
                onClick={() => window.location.reload()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw size={20} />
                刷新页面
              </motion.button>

              <motion.button
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white/90 border-2 border-white/30 hover:bg-white/10 transition-all duration-300"
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null })
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home size={20} />
                重新开始
              </motion.button>
            </motion.div>

            {/* 装饰元素 */}
            <motion.div
              className="absolute top-10 left-10 text-4xl opacity-20"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              🔧
            </motion.div>
            
            <motion.div
              className="absolute bottom-10 right-10 text-4xl opacity-20"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              ⚠️
            </motion.div>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
