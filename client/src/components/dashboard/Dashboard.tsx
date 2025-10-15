import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  BuildingOffice2Icon,
  ScaleIcon,
  CpuChipIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../../store/auth'

export const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()

  const stats = [
    {
      name: t('institutions'),
      value: '6',
      change: '+2.1%',
      changeType: 'positive',
      icon: BuildingOffice2Icon,
      color: 'bg-blue-500'
    },
    {
      name: 'Legal Documents',
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: ScaleIcon,
      color: 'bg-red-500'
    },
    {
      name: t('reviews'),
      value: '1,234',
      change: '+8.2%',
      changeType: 'positive',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-green-500'
    },
    {
      name: 'AI Queries',
      value: '567',
      change: '+23.1%',
      changeType: 'positive',
      icon: CpuChipIcon,
      color: 'bg-purple-500'
    }
  ]

  const quickActions = [
    {
      name: t('institutions'),
      description: 'Browse government directory and officials',
      href: '/institutions',
      icon: BuildingOffice2Icon,
      color: 'bg-blue-500'
    },
    {
      name: t('legal'),
      description: 'Search laws and regulations',
      href: '/legal',
      icon: ScaleIcon,
      color: 'bg-red-500'
    },
    {
      name: t('ai'),
      description: 'Ask legal questions with AI assistance',
      href: '/ai',
      icon: CpuChipIcon,
      color: 'bg-purple-500'
    },
    {
      name: t('reviews'),
      description: 'Submit reviews and ratings',
      href: '/reviews',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-green-500'
    },
    {
      name: t('budget'),
      description: 'Explore budget transparency data',
      href: '/budget',
      icon: ChartBarIcon,
      color: 'bg-yellow-500'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'law_updated',
      description: 'Law 12-2024 updated in Legal Repository',
      time: '2 hours ago',
      icon: DocumentTextIcon
    },
    {
      id: 2,
      type: 'review_submitted',
      description: 'New citizen review for Ministry of Health',
      time: '4 hours ago',
      icon: ChatBubbleLeftRightIcon
    },
    {
      id: 3,
      type: 'institution_added',
      description: 'New government agency added to directory',
      time: '6 hours ago',
      icon: BuildingOffice2Icon
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow-sm">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-white">
            {t('welcome')}
          </h1>
          <p className="mt-2 text-primary-100 text-lg">
            Morocco's National Civic Intelligence Platform for Government Transparency and Citizen Engagement
          </p>
          {user && (
            <div className="mt-4 flex items-center">
              <UsersIcon className="h-4 w-4 text-primary-200 mr-2" />
              <span className="text-primary-100">
                Welcome back, {user.fullName} ({user.role})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('statistics')}</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.color} rounded-md p-3`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <ArrowTrendingUpIcon className="h-4 w-4 flex-shrink-0 self-center" />
                        <span className="sr-only">
                          {stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by
                        </span>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('quickAccess')}</h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.href}
                className="group relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center">
                  <div className={`${action.color} rounded-md p-2 mr-4`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                      {action.name}
                    </h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className="flex-shrink-0">
                  <activity.icon className="h-4 w-4 text-gray-400" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <div className="flex items-center mt-1">
                    <ClockIcon className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Information */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">About Convergence Platform</h2>
        <div className="prose prose-sm text-gray-600 max-w-none">
          <p>
            The Convergence Platform is Morocco's national civic intelligence system, designed to promote 
            transparency and accountability in public administration. Our platform provides citizens with 
            access to government data, legal documents, budget information, and tools for civic engagement.
          </p>
          <p className="mt-4">
            All data is sourced from official government publications and maintained with full audit trails 
            to ensure accuracy and reliability. The platform supports Arabic, French, and English languages 
            to serve all citizens of Morocco.
          </p>
        </div>
      </div>
    </div>
  )
}
