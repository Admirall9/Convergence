import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Translation resources
const resources = {
    en: {
        translation: {
            // Navigation
            dashboard: 'Dashboard',
            institutions: 'Government Institutions',
            legal: 'Legal Repository',
            ai: 'AI Legal Q&A',
            reviews: 'Citizen Reviews',
            budget: 'Budget Transparency',
            moderator: 'Moderator Console',
            admin: 'Admin Panel',
            login: 'Login',
            register: 'Register',
            logout: 'Logout',
            // Dashboard
            welcome: 'Welcome to Convergence Platform',
            quickAccess: 'Quick Access',
            statistics: 'Statistics',
            // Common
            search: 'Search',
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            cancel: 'Cancel',
            save: 'Save',
            edit: 'Edit',
            delete: 'Delete',
            back: 'Back',
            // Auth
            email: 'Email',
            password: 'Password',
            fullName: 'Full Name',
            confirmPassword: 'Confirm Password',
            loginTitle: 'Login to Convergence Platform',
            registerTitle: 'Create Account',
            // Roles
            roles: {
                admin: 'Administrator',
                moderator: 'Moderator',
                citizen: 'Citizen',
                anonymous: 'Anonymous'
            }
        }
    },
    ar: {
        translation: {
            // Navigation
            dashboard: 'لوحة التحكم',
            institutions: 'المؤسسات الحكومية',
            legal: 'المستودع القانوني',
            ai: 'الذكاء الاصطناعي القانوني',
            reviews: 'مراجعات المواطنين',
            budget: 'شفافية الميزانية',
            moderator: 'لوحة المراقبة',
            admin: 'لوحة الإدارة',
            login: 'تسجيل الدخول',
            register: 'إنشاء حساب',
            logout: 'تسجيل الخروج',
            // Dashboard
            welcome: 'مرحباً بكم في منصة التقارب',
            quickAccess: 'الوصول السريع',
            statistics: 'الإحصائيات',
            // Common
            search: 'بحث',
            loading: 'جاري التحميل...',
            error: 'خطأ',
            success: 'نجح',
            cancel: 'إلغاء',
            save: 'حفظ',
            edit: 'تعديل',
            delete: 'حذف',
            back: 'رجوع',
            // Auth
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            fullName: 'الاسم الكامل',
            confirmPassword: 'تأكيد كلمة المرور',
            loginTitle: 'تسجيل الدخول إلى منصة التقارب',
            registerTitle: 'إنشاء حساب',
            // Roles
            roles: {
                admin: 'مدير',
                moderator: 'مراقب',
                citizen: 'مواطن',
                anonymous: 'مجهول'
            }
        }
    },
    fr: {
        translation: {
            // Navigation
            dashboard: 'Tableau de bord',
            institutions: 'Institutions gouvernementales',
            legal: 'Dépôt juridique',
            ai: 'IA juridique',
            reviews: 'Avis des citoyens',
            budget: 'Transparence budgétaire',
            moderator: 'Console de modération',
            admin: 'Panneau d\'administration',
            login: 'Connexion',
            register: 'S\'inscrire',
            logout: 'Déconnexion',
            // Dashboard
            welcome: 'Bienvenue sur la plateforme Convergence',
            quickAccess: 'Accès rapide',
            statistics: 'Statistiques',
            // Common
            search: 'Rechercher',
            loading: 'Chargement...',
            error: 'Erreur',
            success: 'Succès',
            cancel: 'Annuler',
            save: 'Enregistrer',
            edit: 'Modifier',
            delete: 'Supprimer',
            back: 'Retour',
            // Auth
            email: 'Email',
            password: 'Mot de passe',
            fullName: 'Nom complet',
            confirmPassword: 'Confirmer le mot de passe',
            loginTitle: 'Connexion à la plateforme Convergence',
            registerTitle: 'Créer un compte',
            // Roles
            roles: {
                admin: 'Administrateur',
                moderator: 'Modérateur',
                citizen: 'Citoyen',
                anonymous: 'Anonyme'
            }
        }
    }
};
i18n
    .use(initReactI18next)
    .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false
    }
});
export default i18n;
