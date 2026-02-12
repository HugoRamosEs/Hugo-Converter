interface TabMenuProps {
  activeTab: 'youtube' | 'soundcloud'
  onTabChange: (tab: 'youtube' | 'soundcloud') => void
}

export default function TabMenu({ activeTab, onTabChange }: TabMenuProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="bg-[#2b2b2b] rounded-xl p-2 border border-[#3f3f3f]">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onTabChange('youtube')}
            className={`
              py-4 px-5 rounded-lg font-semibold text-base
              transition-all duration-200
              ${activeTab === 'youtube' 
                ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md' 
                : 'text-gray-400 hover:bg-[#333333] hover:text-gray-200'
              }
            `}
            aria-selected={activeTab === 'youtube'}
            role="tab"
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="truncate">YouTube</span>
            </div>
          </button>
          
          <button
            onClick={() => onTabChange('soundcloud')}
            className={`
              py-4 px-5 rounded-lg font-semibold text-base
              transition-all duration-200
              ${activeTab === 'soundcloud' 
                ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md' 
                : 'text-gray-400 hover:bg-[#333333] hover:text-gray-200'
              }
            `}
            aria-selected={activeTab === 'soundcloud'}
            role="tab"
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
              <span className="truncate">SoundCloud</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
