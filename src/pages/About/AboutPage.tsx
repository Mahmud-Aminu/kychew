import { Link } from 'react-router';
import { ROUTE_PATHS } from '@/routes/routePaths';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { HiOutlineUserGroup, HiOutlineLightBulb, HiOutlineShieldCheck, HiOutlineTrendingUp } from 'react-icons/hi';

const stats = [
    { value: '2020', label: 'Founded' },
    { value: '2,500+', label: 'Registered Members' },
    { value: '34', label: 'Local Government Areas' },
    { value: '100%', label: 'Commitment to Health' },
];

const values = [
    {
        icon: HiOutlineUserGroup,
        title: 'Health Job Opportunities',
        description: 'We connect members with verified health job opportunities and exclusive offers available only to verified ID holders.',
    },
    {
        icon: HiOutlineShieldCheck,
        title: 'Verified Membership',
        description: 'Members receive a verified membership ID that opens doors to exclusive jobs and professional recognition.',
    },
    {
        icon: HiOutlineLightBulb,
        title: 'Skill Development',
        description: 'We support practical health skill development and guide CHEW students toward meaningful SIWES placements.',
    },
    {
        icon: HiOutlineTrendingUp,
        title: 'Professional Growth',
        description: 'A community space where CHEW professionals and students can connect, share knowledge, and grow together.',
    },
];

export default function AboutPage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-primary-900 py-24 sm:py-32">
                <div className="absolute inset-0 opacity-20">
                    <svg className="h-full w-full" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <circle cx="400" cy="300" r="250" fill="none" stroke="white" strokeWidth="1" />
                        <circle cx="400" cy="300" r="180" fill="none" stroke="white" strokeWidth="0.5" />
                    </svg>
                </div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md ring-1 ring-white/20">
                        About KYChew
                    </span>
                    <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Empowering <span className="text-accent-400">CHEW</span> Professionals &amp; Students
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-100 sm:text-xl">
                        A dedicated membership community for Community Health Extension Workers (CHEW) and CHEW students — connecting members with health jobs, professional networking, and career development resources.
                    </p>
                </div>
            </section>

            {/* Our Story / Mission */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold text-surface-900 tracking-tight sm:text-4xl">About Us</h2>
                        <p className="mt-4 text-lg text-surface-600 leading-relaxed">
                            This platform is a dedicated membership community for Community Health Extension Workers (CHEW) and CHEW students. Our goal is to support members by connecting them with verified health job opportunities, professional networking, and career development resources.
                        </p>
                        <p className="mt-4 text-lg text-surface-600 leading-relaxed">
                            Members can purchase a verified membership ID that provides access to exclusive job offers and opportunities within the health sector. The platform also serves as a community space where CHEW professionals and students can meet, share knowledge, and support each other.
                        </p>
                        <p className="mt-4 text-lg text-surface-600 leading-relaxed">
                            We are also committed to helping CHEW students gain practical experience by guiding them toward skill development opportunities and assisting them in securing SIWES placements.
                        </p>
                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl bg-primary-50 p-5 border border-primary-100">
                                <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 mb-2">Mission</p>
                                <p className="text-sm text-surface-600 leading-relaxed">
                                    To empower Community Health Extension Workers and students by providing access to job opportunities, professional networking, and practical skill development.
                                </p>
                            </div>
                            <div className="rounded-xl bg-accent-50 p-5 border border-accent-100">
                                <p className="text-sm font-semibold uppercase tracking-wider text-accent-600 mb-2">Vision</p>
                                <p className="text-sm text-surface-600 leading-relaxed">
                                    To build the largest digital community that supports the growth, employment, and professional development of Community Health Extension Workers.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                        {stats.map((stat) => (
                            <Card key={stat.label} className="text-center bg-primary-50/50 border-none shadow-sm">
                                <p className="text-3xl font-bold text-primary-700">{stat.value}</p>
                                <p className="mt-2 text-sm font-medium text-surface-600">{stat.label}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="bg-surface-50 py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl font-extrabold tracking-tight text-surface-900 sm:text-4xl">
                            What We Stand For
                        </h2>
                        <p className="mt-4 text-lg text-surface-600">
                            The principles guiding our platform and community.
                        </p>
                    </div>
                    <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((value) => {
                            const Icon = value.icon;
                            return (
                                <Card key={value.title} className="relative flex flex-col items-start p-8 transition-shadow hover:shadow-md">
                                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                                        <Icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-xl font-bold text-surface-900">{value.title}</h3>
                                    <p className="mt-3 text-base text-surface-600 leading-relaxed">{value.description}</p>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative py-16 sm:py-24">
                <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <div className="rounded-3xl bg-gradient-to-br from-primary-800 to-primary-900 px-6 py-16 sm:p-16 shadow-2xl">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            Join the CHEW Community Today
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-lg text-primary-100">
                            Join a growing community of CHEW professionals and students. Take the next step in your health career and get access to job opportunities, professional guidance, and a supportive community.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                            <Link to={ROUTE_PATHS.REGISTER}>
                                <Button size="lg" className="bg-primary-50 text-primary-800 hover:bg-primary-50">
                                    Create Your Membership Today
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
