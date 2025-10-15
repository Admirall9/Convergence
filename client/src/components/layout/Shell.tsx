import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  BuildingOffice2Icon,
  ScaleIcon,
  CpuChipIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  LanguageIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../../store/auth'

interface ShellProps {
  children: React.ReactNode
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setLanguageMenuOpen(false)
    
    // Set RTL for Arabic
    if (lng === 'ar') {
      document.documentElement.dir = 'rtl'
      document.documentElement.lang = 'ar'
    } else {
      document.documentElement.dir = 'ltr'
      document.documentElement.lang = lng
    }
  }

  const navigation = [
    { name: t('dashboard'), href: '/', icon: HomeIcon, roles: ['Admin', 'Moderator', 'Citizen', 'Anonymous'] },
    { name: t('institutions'), href: '/institutions', icon: BuildingOffice2Icon, roles: ['Admin', 'Moderator', 'Citizen', 'Anonymous'] },
    { name: t('legal'), href: '/legal', icon: ScaleIcon, roles: ['Admin', 'Moderator', 'Citizen', 'Anonymous'] },
    { name: t('ai'), href: '/ai', icon: CpuChipIcon, roles: ['Admin', 'Moderator', 'Citizen', 'Anonymous'] },
    { name: t('reviews'), href: '/reviews', icon: ChatBubbleLeftRightIcon, roles: ['Admin', 'Moderator', 'Citizen'] },
    { name: t('budget'), href: '/budget', icon: ChartBarIcon, roles: ['Admin', 'Moderator', 'Citizen', 'Anonymous'] },
    { name: t('moderator'), href: '/moderator', icon: CogIcon, roles: ['Admin', 'Moderator'] },
    { name: t('admin'), href: '/admin', icon: ShieldCheckIcon, roles: ['Admin'] },
  ]

  const filteredNavigation = navigation.filter(item => 
    !user || item.roles.includes(user.role) || item.roles.includes('Anonymous')
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="text-xl font-bold text-primary-600">Convergence</span>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <span className="text-xl font-bold text-primary-600">Convergence Platform</span>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-5 w-5" />
            </button>

          {/* Search */}
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-0 h-full w-4 text-gray-400 pl-3" />
              <input
                type="search"
                placeholder={t('search')}
                className="block h-full w-full border-0 py-0 pl-10 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Language selector */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              >
                <LanguageIcon className="h-4 w-4" />
                {i18n.language.toUpperCase()}
              </button>
              {languageMenuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <button
                    onClick={() => changeLanguage('en')}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage('ar')}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => changeLanguage('fr')}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Français
                  </button>
                </div>
              )}
            </div>

            {/* Notifications */}
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
            >
              <BellIcon className="h-5 w-5" />
            </button>

            {/* User menu */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-x-4">
                <span className="inline-flex items-center rounded-full bg-secondary-100 px-2.5 py-0.5 text-xs font-medium text-secondary-800">
                  {t(`roles.${user.role.toLowerCase()}`)}
                </span>
                <div className="flex items-center gap-x-2">
                  <UserCircleIcon className="h-6 w-6 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{user.fullName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-x-4">
                <Link
                  to="/login"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
