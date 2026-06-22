export const ROUTE_PATHS = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    ONBOARDING: '/onboarding',
    DASHBOARD: '/dashboard',
    JOBS: '/jobs',
    PROFILE: '/profile',
    ID_CARD: '/id-card',
    ID_CARD_GENERATE: '/id-card/generate',
    ID_CARD_VIEW: '/id-card/view',
    ID_CARD_DOWNLOAD: '/id-card/download',
    CONTACTS: '/contact-us',
    ABOUT: '/about-us',
    ADMIN_PAYMENTS: '/admin/payments',

} as const;

export type RoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];
