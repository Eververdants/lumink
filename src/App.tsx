import { useState, useEffect } from 'react'
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Plus, 
  RotateCcw, 
  Smartphone,
  Zap,
  RefreshCw,
  Moon,
  Sun
} from 'lucide-react'
import './App.css'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

function App() {
  const [count, setCount] = useState(0)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    // 监听网络状态
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // 监听 PWA 安装事件
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as unknown as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('用户接受了安装')
    } else {
      console.log('用户拒绝了安装')
    }

    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  const features = [
    { icon: <Wifi className="w-6 h-6" />, title: '离线访问', desc: '无网络也能使用' },
    { icon: <Smartphone className="w-6 h-6" />, title: '可安装', desc: '添加到主屏幕' },
    { icon: <RefreshCw className="w-6 h-6" />, title: '自动更新', desc: '始终保持最新' },
    { icon: <Zap className="w-6 h-6" />, title: '快速响应', desc: '流畅的用户体验' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm animate-bounce-glow">
              <span className="text-xl font-bold">P</span>
            </div>
            <h1 className="text-xl font-bold">Lumink PWA</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* 网络状态指示器 */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm transition-all duration-300 ${
              isOnline 
                ? 'bg-green-400/30 text-white shadow-lg shadow-green-500/30' 
                : 'bg-red-500/30 text-white shadow-lg shadow-red-500/30'
            }`}>
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4" />
                  <span className="text-sm font-medium">在线</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  <span className="text-sm font-medium">离线</span>
                </>
              )}
            </div>
            
            {/* 深色模式指示 */}
            <div className="w-8 h-8 bg-white/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-xl border border-white/50 dark:border-gray-700/50 p-6 mb-6 animate-fade-in">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent mb-2">
            欢迎使用 PWA 应用
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            这是一个使用 React + TypeScript + Tailwind CSS 构建的渐进式 Web 应用
          </p>

          {/* Counter Section */}
          <div className="mt-6 p-6 bg-gradient-to-br from-orange-100 to-purple-100 dark:from-orange-900/30 dark:to-purple-900/30 rounded-xl">
            <div className="text-center">
              <p className="text-5xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
                {count}
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setCount(c => c + 1)}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 focus:ring-orange-500 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 gap-2"
                >
                  <Plus className="w-5 h-5" />
                  增加
                </button>
                <button
                  onClick={() => setCount(0)}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-gray-500 shadow-lg gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  重置
                </button>
              </div>
            </div>
          </div>

          {/* Install Section */}
          {isInstallable && (
            <div className="mt-6 p-6 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-xl text-white animate-slide-up shadow-xl shadow-pink-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">安装应用到设备</p>
                    <p className="text-sm text-white/80">获得更好的使用体验</p>
                  </div>
                </div>
                <button
                  onClick={handleInstallClick}
                  className="px-6 py-2.5 bg-white text-orange-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  安装
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-lg border border-white/50 dark:border-gray-700/50 p-5 flex items-start gap-4 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-purple-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent font-medium">Built with React + TypeScript + Tailwind CSS + Vite</p>
      </footer>
    </div>
  )
}

export default App
