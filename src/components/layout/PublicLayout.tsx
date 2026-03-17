import { Outlet, Link } from 'react-router';
import Navbar from '@/components/layout/Navbar';
import { ROUTE_PATHS } from '@/routes/routePaths';
import {
    FaXTwitter,
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
} from 'react-icons/fa6';
import {
    HiOutlineInformationCircle,
    HiOutlinePhone,
    HiOutlineBriefcase,
    HiOutlineIdentification,
    HiOutlineDocumentText,
    HiOutlineShieldCheck,
} from 'react-icons/hi';

const socialLinks = [
    { icon: FaXTwitter, href: 'https://twitter.com', label: 'Twitter / X' },
    { icon: FaFacebookF, href: 'https://facebook.com', label: 'Facebook' },
    { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: FaLinkedinIn, href: 'https://linkedin.com', label: 'LinkedIn' },
];

const quickLinks = [
    { label: 'About Us', to: ROUTE_PATHS.ABOUT, icon: HiOutlineInformationCircle },
    { label: 'Contact Us', to: ROUTE_PATHS.CONTACTS, icon: HiOutlinePhone },
    { label: 'Browse Jobs', to: ROUTE_PATHS.JOBS, icon: HiOutlineBriefcase },
    { label: 'Get Membership ID', to: ROUTE_PATHS.ID_CARD, icon: HiOutlineIdentification },
];

const legalLinks = [
    { label: 'Terms & Conditions', to: '#terms', icon: HiOutlineDocumentText },
    { label: 'Privacy Policy', to: '#privacy', icon: HiOutlineShieldCheck },
];

export default function PublicLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>

            {/* ── Professional Footer ── */}
            <footer className="bg-surface-900 text-surface-300">
                {/* Top grid */}
                <div className="mx-auto max-w-7xl px-4 pt-14 pb-10 sm:px-6 lg:px-8">
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

                        {/* Brand */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-md">
                                    <span className="text-sm font-extrabold text-white">KY</span>
                                </div>
                                <span className="text-lg font-bold text-white">
                                    KY<span className="text-accent-400">Chew</span>
                                </span>
                            </div>
                            <p className="mt-4 text-sm leading-relaxed text-surface-400">
                                A dedicated membership platform empowering Community Health Extension Workers (CHEW) and students across Katsina State with job opportunities, skill development, and SIWES support.
                            </p>

                            {/* Social icons */}
                            <div className="mt-6 flex items-center gap-3">
                                {socialLinks.map(({ icon: Icon, href, label }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-700 text-surface-400 transition-all duration-200 hover:border-accent-500 hover:bg-accent-500/10 hover:text-accent-400"
                                    >
                                        <Icon className="h-4 w-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-surface-500">
                                Quick Links
                            </h3>
                            <ul className="mt-4 space-y-3">
                                {quickLinks.map(({ label, to, icon: Icon }) => (
                                    <li key={label}>
                                        <Link
                                            to={to}
                                            className="group flex items-center gap-2 text-sm text-surface-400 transition-colors duration-150 hover:text-white"
                                        >
                                            <Icon className="h-4 w-4 text-surface-600 transition-colors group-hover:text-accent-400" />
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-surface-500">
                                Legal
                            </h3>
                            <ul className="mt-4 space-y-3">
                                {legalLinks.map(({ label, to, icon: Icon }) => (
                                    <li key={label}>
                                        <Link
                                            to={to}
                                            className="group flex items-center gap-2 text-sm text-surface-400 transition-colors duration-150 hover:text-white"
                                        >
                                            <Icon className="h-4 w-4 text-surface-600 transition-colors group-hover:text-accent-400" />
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact snippet */}
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-surface-500">
                                Get In Touch
                            </h3>
                            <ul className="mt-4 space-y-3 text-sm text-surface-400">
                                <li className="flex items-start gap-2">
                                    <HiOutlinePhone className="mt-0.5 h-4 w-4 shrink-0 text-surface-600" />
                                    <span>+234 800 000 0000</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <HiOutlineInformationCircle className="mt-0.5 h-4 w-4 shrink-0 text-surface-600" />
                                    <span>info@kychew.org</span>
                                </li>
                                <li className="mt-4">
                                    <Link
                                        to={ROUTE_PATHS.CONTACTS}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-surface-700 px-4 py-2 text-xs font-medium text-surface-300 transition-all duration-200 hover:border-accent-500 hover:text-white"
                                    >
                                        <HiOutlinePhone className="h-3.5 w-3.5" />
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Divider + bottom bar */}
                <div className="border-t border-surface-800">
                    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-between gap-3 text-xs text-surface-500 sm:flex-row">
                            <p>
                                &copy; {new Date().getFullYear()} Katsina State Young Community Health Workers Association. All rights reserved.
                            </p>
                            <div className="flex items-center gap-4">
                                <Link to="#terms" className="hover:text-surface-300 transition-colors">Terms</Link>
                                <span className="text-surface-700">·</span>
                                <Link to="#privacy" className="hover:text-surface-300 transition-colors">Privacy</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
