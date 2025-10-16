import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BuildingOffice2Icon, ScaleIcon, CpuChipIcon, ChatBubbleLeftRightIcon, ChartBarIcon, ArrowTrendingUpIcon, UsersIcon, DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/auth';
export const Dashboard = () => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
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
    ];
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
    ];
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
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow-sm", children: _jsxs("div", { className: "px-6 py-8", children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: t('welcome') }), _jsx("p", { className: "mt-2 text-primary-100 text-lg", children: "Morocco's National Civic Intelligence Platform for Government Transparency and Citizen Engagement" }), user && (_jsxs("div", { className: "mt-4 flex items-center", children: [_jsx(UsersIcon, { className: "h-4 w-4 text-primary-200 mr-2" }), _jsxs("span", { className: "text-primary-100", children: ["Welcome back, ", user.fullName, " (", user.role, ")"] })] }))] }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-medium text-gray-900 mb-4", children: t('statistics') }), _jsx("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4", children: stats.map((stat) => (_jsx("div", { className: "card", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: `${stat.color} rounded-md p-3`, children: _jsx(stat.icon, { className: "h-5 w-5 text-white" }) }) }), _jsx("div", { className: "ml-4 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: stat.name }), _jsxs("dd", { className: "flex items-baseline", children: [_jsx("div", { className: "text-2xl font-semibold text-gray-900", children: stat.value }), _jsxs("div", { className: `ml-2 flex items-baseline text-sm font-semibold ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`, children: [_jsx(ArrowTrendingUpIcon, { className: "h-4 w-4 flex-shrink-0 self-center" }), _jsxs("span", { className: "sr-only", children: [stat.changeType === 'positive' ? 'Increased' : 'Decreased', " by"] }), stat.change] })] })] }) })] }) }, stat.name))) })] }), _jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2", children: [_jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-lg font-medium text-gray-900 mb-4", children: t('quickAccess') }), _jsx("div", { className: "space-y-3", children: quickActions.map((action) => (_jsx(Link, { to: action.href, className: "group relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm hover:shadow-md transition-shadow duration-200", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `${action.color} rounded-md p-2 mr-4`, children: _jsx(action.icon, { className: "h-4 w-4 text-white" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-sm font-medium text-gray-900 group-hover:text-primary-600", children: action.name }), _jsx("p", { className: "text-sm text-gray-500", children: action.description })] })] }) }, action.name))) })] }), _jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-lg font-medium text-gray-900 mb-4", children: "Recent Activity" }), _jsx("div", { className: "space-y-4", children: recentActivity.map((activity) => (_jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(activity.icon, { className: "h-4 w-4 text-gray-400" }) }), _jsxs("div", { className: "ml-3 flex-1", children: [_jsx("p", { className: "text-sm text-gray-900", children: activity.description }), _jsxs("div", { className: "flex items-center mt-1", children: [_jsx(ClockIcon, { className: "h-3 w-3 text-gray-400 mr-1" }), _jsx("span", { className: "text-xs text-gray-500", children: activity.time })] })] })] }, activity.id))) })] })] }), _jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-lg font-medium text-gray-900 mb-4", children: "About Convergence Platform" }), _jsxs("div", { className: "prose prose-sm text-gray-600 max-w-none", children: [_jsx("p", { children: "The Convergence Platform is Morocco's national civic intelligence system, designed to promote transparency and accountability in public administration. Our platform provides citizens with access to government data, legal documents, budget information, and tools for civic engagement." }), _jsx("p", { className: "mt-4", children: "All data is sourced from official government publications and maintained with full audit trails to ensure accuracy and reliability. The platform supports Arabic, French, and English languages to serve all citizens of Morocco." })] })] })] }));
};
