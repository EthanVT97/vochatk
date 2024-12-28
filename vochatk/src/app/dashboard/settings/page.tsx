'use client'

import { FC, useState } from 'react'
import { 
  Save,
  Image as ImageIcon,
  Link,
  Globe,
  Layout,
  Type,
  FileText,
  CheckCircle
} from 'lucide-react'

interface LandingPageData {
  hero: {
    title: string
    subtitle: string
    image: string
  }
  features: {
    id: string
    title: string
    description: string
    icon: string
  }[]
  about: {
    title: string
    content: string
    image: string
  }
  contact: {
    email: string
    phone: string
    address: string
  }
  social: {
    facebook: string
    twitter: string
    linkedin: string
  }
}

const SettingsPage: FC = () => {
  const [activeTab, setActiveTab] = useState('landing')
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [landingPageData, setLandingPageData] = useState<LandingPageData>({
    hero: {
      title: 'Welcome to LiveChatBot',
      subtitle: 'Enhance your customer support with AI-powered chat solutions',
      image: '/hero-image.jpg'
    },
    features: [
      {
        id: '1',
        title: 'AI-Powered Responses',
        description: 'Smart automated responses powered by advanced AI technology',
        icon: 'bot'
      },
      {
        id: '2',
        title: 'Multi-Channel Support',
        description: 'Connect with customers across various platforms seamlessly',
        icon: 'messages'
      }
    ],
    about: {
      title: 'About LiveChatBot',
      content: 'We provide cutting-edge chat solutions for modern businesses',
      image: '/about-image.jpg'
    },
    contact: {
      email: 'contact@livechatbot.com',
      phone: '+1 234 567 8900',
      address: '123 Tech Street, Silicon Valley, CA'
    },
    social: {
      facebook: 'https://facebook.com/livechatbot',
      twitter: 'https://twitter.com/livechatbot',
      linkedin: 'https://linkedin.com/company/livechatbot'
    }
  })

  const handleSave = () => {
    // Here you would typically save to your backend
    setShowSaveSuccess(true)
    setTimeout(() => setShowSaveSuccess(false), 3000)
  }

  const updateHero = (field: keyof typeof landingPageData.hero, value: string) => {
    setLandingPageData(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }))
  }

  const updateFeature = (id: string, field: keyof (typeof landingPageData.features)[0], value: string) => {
    setLandingPageData(prev => ({
      ...prev,
      features: prev.features.map(feature =>
        feature.id === id ? { ...feature, [field]: value } : feature
      )
    }))
  }

  const updateAbout = (field: keyof typeof landingPageData.about, value: string) => {
    setLandingPageData(prev => ({
      ...prev,
      about: { ...prev.about, [field]: value }
    }))
  }

  const updateContact = (field: keyof typeof landingPageData.contact, value: string) => {
    setLandingPageData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }))
  }

  const updateSocial = (field: keyof typeof landingPageData.social, value: string) => {
    setLandingPageData(prev => ({
      ...prev,
      social: { ...prev.social, [field]: value }
    }))
  }

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Settings</h1>
        <button
          onClick={handleSave}
          className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2'
        >
          <Save className='w-5 h-5' />
          Save Changes
        </button>
      </div>

      {/* Save Success Message */}
      {showSaveSuccess && (
        <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800'>
          <CheckCircle className='w-5 h-5' />
          Changes saved successfully!
        </div>
      )}

      <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
        <div className='border-b border-gray-200'>
          <div className='flex'>
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'landing'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Landing Page
            </button>
          </div>
        </div>

        <div className='p-6'>
          {activeTab === 'landing' && (
            <div className='space-y-8'>
              {/* Hero Section */}
              <div>
                <h2 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                  <Layout className='w-5 h-5 text-gray-500' />
                  Hero Section
                </h2>
                <div className='grid gap-6 max-w-2xl'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
                    <input
                      type='text'
                      value={landingPageData.hero.title}
                      onChange={(e) => updateHero('title', e.target.value)}
                      className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Subtitle</label>
                    <input
                      type='text'
                      value={landingPageData.hero.subtitle}
                      onChange={(e) => updateHero('subtitle', e.target.value)}
                      className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Hero Image URL</label>
                    <div className='flex gap-2'>
                      <input
                        type='text'
                        value={landingPageData.hero.image}
                        onChange={(e) => updateHero('image', e.target.value)}
                        className='flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <button className='p-2 border border-gray-200 rounded-lg hover:bg-gray-50'>
                        <ImageIcon className='w-5 h-5 text-gray-500' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div>
                <h2 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                  <Type className='w-5 h-5 text-gray-500' />
                  Features
                </h2>
                <div className='space-y-6'>
                  {landingPageData.features.map((feature) => (
                    <div key={feature.id} className='border border-gray-200 rounded-lg p-4'>
                      <div className='grid gap-4'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
                          <input
                            type='text'
                            value={feature.title}
                            onChange={(e) => updateFeature(feature.id, 'title', e.target.value)}
                            className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                          <textarea
                            value={feature.description}
                            onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                            rows={2}
                            className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* About Section */}
              <div>
                <h2 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                  <FileText className='w-5 h-5 text-gray-500' />
                  About Section
                </h2>
                <div className='grid gap-6 max-w-2xl'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
                    <input
                      type='text'
                      value={landingPageData.about.title}
                      onChange={(e) => updateAbout('title', e.target.value)}
                      className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Content</label>
                    <textarea
                      value={landingPageData.about.content}
                      onChange={(e) => updateAbout('content', e.target.value)}
                      rows={4}
                      className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Image URL</label>
                    <div className='flex gap-2'>
                      <input
                        type='text'
                        value={landingPageData.about.image}
                        onChange={(e) => updateAbout('image', e.target.value)}
                        className='flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <button className='p-2 border border-gray-200 rounded-lg hover:bg-gray-50'>
                        <ImageIcon className='w-5 h-5 text-gray-500' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                  <Globe className='w-5 h-5 text-gray-500' />
                  Contact Information
                </h2>
                <div className='grid gap-6 max-w-2xl'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                    <input
                      type='email'
                      value={landingPageData.contact.email}
                      onChange={(e) => updateContact('email', e.target.value)}
                      className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Phone</label>
                    <input
                      type='tel'
                      value={landingPageData.contact.phone}
                      onChange={(e) => updateContact('phone', e.target.value)}
                      className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
                    <textarea
                      value={landingPageData.contact.address}
                      onChange={(e) => updateContact('address', e.target.value)}
                      rows={2}
                      className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h2 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                  <Link className='w-5 h-5 text-gray-500' />
                  Social Links
                </h2>
                <div className='grid gap-6 max-w-2xl'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Facebook</label>
                    <input
                      type='url'
                      value={landingPageData.social.facebook}
                      onChange={(e) => updateSocial('facebook', e.target.value)}
                      className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Twitter</label>
                    <input
                      type='url'
                      value={landingPageData.social.twitter}
                      onChange={(e) => updateSocial('twitter', e.target.value)}
                      className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>LinkedIn</label>
                    <input
                      type='url'
                      value={landingPageData.social.linkedin}
                      onChange={(e) => updateSocial('linkedin', e.target.value)}
                      className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage 