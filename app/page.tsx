'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TabMenu from '@/components/TabMenu'
import ConversionForm from '@/components/ConversionForm'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'youtube' | 'soundcloud'>('youtube')

  return (
    <div className="min-h-screen flex flex-col bg-[#202020]">
      <Header />
      
      <main className="flex-1 py-6 space-y-6">
        <TabMenu activeTab={activeTab} onTabChange={setActiveTab} />
        <ConversionForm platform={activeTab} key={activeTab} />
      </main>

      <Footer />
    </div>
  )
}
