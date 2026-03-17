export const ROUTE_PATHS = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    ONBOARDING: '/onboarding',
    DASHBOARD: '/dashboard',
    JOBS: '/jobs',
    PROFILE: '/profile',
    ID_CARD: '/id-card',
    CONTACTS: '/contact-us',
    ABOUT: '/about-us',

} as const;

export type RoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];
