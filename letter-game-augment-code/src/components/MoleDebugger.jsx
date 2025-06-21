import React from 'react'

const MoleDebugger = ({ moles, debugMode = false }) => {
  if (process.env.NODE_ENV !== 'development' || !debugMode) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">地鼠状态调试</h3>
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {moles.map(mole => (
          <div 
            key={mole.id} 
            className={`p-2 rounded ${mole.isVisible ? 'bg-green-800' : 'bg-gray-800'}`}
          >
            <div>ID: {mole.id}</div>
            <div>字母: {mole.letter || '无'}</div>
            <div>可见: {mole.isVisible ? '是' : '否'}</div>
            <div>击中: {mole.isHit ? '是' : '否'}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-gray-600">
        <div>总数: {moles.length}</div>
        <div>可见: {moles.filter(m => m.isVisible).length}</div>
        <div>隐藏: {moles.filter(m => !m.isVisible).length}</div>
      </div>
    </div>
  )
}

export default MoleDebugger
