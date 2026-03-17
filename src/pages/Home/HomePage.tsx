import { Link } from 'react-router';
import { ROUTE_PATHS } from '@/routes/routePaths';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import heroBg from '@/assets/heroBg.png';
import { HiOutlineIdentification, HiOutlineBriefcase, HiOutlineUser, HiOutlineViewGrid } from 'react-icons/hi';
import charimanPng from '@/assets/chairman.png'
import treaturer from '@/assets/treasurer.jpeg'
import secretary from '@/assets/secretary.png'
import osecruty from '@/assets/osecre.png'

const features = [
    {
        icon: HiOutlineBriefcase,
        title: 'Health Job Opportunities',
        description: 'Receive recommendations for available health-related jobs and career opportunities.',
    },
    {
        icon: HiOutlineIdentification,
        title: 'Exclusive Job Access',
        description: 'Members with a verified ID gain access to exclusive job opportunities not available to the public.',
    },
    {
        icon: HiOutlineUser,
        title: 'Professional Community',
        description: 'Connect and interact with other CHEW professionals and students.',
    },
    {
        icon: HiOutlineViewGrid,
        title: 'Skill Development',
        description: 'Learn and improve practical health skills needed in the field.',
    },
];

const stats = [
    { value: '2,500+', label: 'Registered Members' },
    { value: '150+', label: 'Partner Organizations' },
    { value: '30', label: 'Local Government Areas' },
    { value: '98%', label: 'ID Approval Rate' },
];

export default function HomePage() {
    const team = [
        {
            img: charimanPng,
            name: 'Haruna Usman',
            position: 'Chairman',
            Town: 'Baure L.G.A',
        },
        {
            img: secretary,
            name: 'Saifullahi Usman',
            position: 'Secretary',
                Town: 'Jibia L.G.A',
        },
        {
            img: treaturer,
            name: 'Shafiu Kasim Masanawa',
            position: 'Treasurer',
                Town: 'Katsina L.G.A',
        },
         {
            img: 'https://via.placeholder.com/150',
            name: 'Muhammad Abubakar',
            position: 'Public Realtion Officer (P.R.O)',
                Town: 'Malumfashi L.G.A',
        },
        {
            img: osecruty,
            name: 'Hassan Abdullahi',
            position: 'Organising Security',
                Town: 'Jibia L.G.A',
        },
       
          {
            img: 'https://via.placeholder.com/150',
            name: 'Fatima Muhammad',
            position: 'Welfare Officer',
                Town: 'Bakori L.G.A',
        },
    ];

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section
                className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${heroBg})` }}
            >
                {/* Gradient Overlay for Text Legibility */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <circle cx="400" cy="300" r="250" fill="none" stroke="white" strokeWidth="1" />
                        <circle cx="400" cy="300" r="180" fill="none" stroke="white" strokeWidth="0.5" />
                        <circle cx="400" cy="300" r="110" fill="none" stroke="white" strokeWidth="0.3" />
                    </svg>
                </div>
                <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                            🏥 Katsina State Health Initiative
                        </span>
                        <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Empowering Community{' '}
                            <span className="text-accent-300">Health Extension Workers</span>
                        </h1>
                        <p className="mt-4 text-base font-semibold text-accent-200 sm:text-lg">
                            A membership platform connecting CHEW professionals and students with health job opportunities, skill development, and SIWES placements.
                        </p>
                        <p className="mt-4 text-lg leading-relaxed text-primary-100 sm:text-xl">
                            Join a growing community of Community Health Extension Workers and students. Get recommended health job opportunities, access exclusive job offers with your membership ID, connect with fellow members, and receive guidance to build practical health skills and secure SIWES placements.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link to={ROUTE_PATHS.REGISTER}>
                                <Button size="lg" className="bg-primary-50 text-primary-700 hover:bg-primary-50 focus:ring-white">
                                    Join the Community
                                </Button>
                            </Link>
                            <Link to={ROUTE_PATHS.ID_CARD}>
                                <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10">
                                    Get Your Membership ID
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="relative -mt-8 z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    {stats.map((stat) => (
                        <Card key={stat.label} className="text-center">
                            <p className="text-2xl font-bold text-primary-700 sm:text-3xl">{stat.value}</p>
                            <p className="mt-1 text-xs text-surface-500 sm:text-sm">{stat.label}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-surface-900 sm:text-4xl">
                        What Members Get
                    </h2>
                    <p className="mt-4 text-lg text-surface-500">
                        Everything you need to grow your health career in one place.
                    </p>
                </div>
                <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <Card key={feature.title} hover className="relative flex flex-col items-center p-8 text-center transition-transform duration-300 hover:-translate-y-2 group">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 shadow-sm ring-1 ring-primary-100 transition-colors duration-300 group-hover:bg-primary-600 group-hover:text-white group-hover:ring-primary-600">
                                    <Icon className="h-8 w-8" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-bold text-surface-900">{feature.title}</h3>
                                <p className="mt-3 flex-1 text-base leading-relaxed text-surface-500">{feature.description}</p>
                            </Card>
                        );
                    })}
                </div>
                {/* SIWES support extra card */}
                <div className="mt-8 flex justify-center">
                    <Card hover className="flex flex-col items-center p-8 text-center max-w-sm w-full transition-transform duration-300 hover:-translate-y-2 group">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 shadow-sm ring-1 ring-primary-100 transition-colors duration-300 group-hover:bg-primary-600 group-hover:text-white group-hover:ring-primary-600">
                            <HiOutlineViewGrid className="h-8 w-8" aria-hidden="true" />
                        </div>
                        <h3 className="text-xl font-bold text-surface-900">SIWES Support</h3>
                        <p className="mt-3 flex-1 text-base leading-relaxed text-surface-500">Guidance and support to help CHEW students secure SIWES placements.</p>
                    </Card>
                </div>
            </section>

            {/* Team */}
            <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 bg-gradient-to-br from-surface-50 to-primary-50/30">
                {/* Background Decoration */}
                <div className="absolute inset-0 opacity-5">
                    <svg className="h-full w-full" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <circle cx="400" cy="300" r="250" fill="none" stroke="currentColor" strokeWidth="1" />
                        <circle cx="400" cy="300" r="180" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        <circle cx="400" cy="300" r="110" fill="none" stroke="currentColor" strokeWidth="0.3" />
                    </svg>
                </div>
                <div className="relative">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-extrabold tracking-tight text-surface-900 sm:text-4xl">
                            Meet the Team
                        </h2>
                        <p className="mt-4 text-lg text-surface-500">
                            A dedicated group powering KYChew behind the scenes.
                        </p>
                    </div>
                    <div className="mt-16">
                        {/* Chairman */}
                        <div className="flex justify-center mb-12">
                            <Card className="flex flex-col items-center p-8 text-center max-w-sm w-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                                <img
                                    src={team[0].img}
                                    alt={team[0].name}
                                    className="h-32 w-32 rounded-full object-cover mb-4 ring-4 ring-primary-100"
                                />
                                <h3 className="text-2xl font-semibold text-surface-900">{team[0].name}</h3>
                                <p className="text-lg text-primary-600 font-medium">{team[0].position}</p>
                                <p className="text-sm text-surface-500">{team[0].Town}</p>
                            </Card>
                        </div>
                        {/* Secretary and Treasurer */}
                        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 mb-12">
                            {team.slice(1, 3).map((member) => (
                                <Card key={member.name} className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        className="h-24 w-24 rounded-full object-cover mb-4 ring-2 ring-surface-200"
                                    />
                                    <h3 className="text-xl font-semibold text-surface-900">{member.name}</h3>
                                    <p className="text-sm text-surface-500">{member.position}</p>
                                    <p className="text-xs text-surface-400">{member.Town}</p>
                                </Card>
                            ))}
                        </div>
                        {/* Rest of the Team */}
                        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {team.slice(3).map((member) => (
                                <Card key={member.name} className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        className="h-24 w-24 rounded-full object-cover mb-4 ring-2 ring-surface-200"
                                    />
                                    <h3 className="text-xl font-semibold text-surface-900">{member.name}</h3>
                                    <p className="text-sm text-surface-500">{member.position}</p>
                                    <p className="text-xs text-surface-400">{member.Town}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative py-16 sm:py-24">
                <div aria-hidden="true" className="absolute inset-0 bg-primary-50/50" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-800 to-accent-900 shadow-2xl relative">
                        {/* Background Decoration */}
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent-500/30 blur-3xl"></div>
                        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-400/30 blur-3xl"></div>

                        <div className="relative px-6 py-16 sm:px-16 sm:py-24 text-center lg:px-24">
                            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                Join the CHEW Community Today
                            </h2>
                            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-50 leading-relaxed">
                                Get access to job opportunities, professional guidance, and a supportive community. Take the next step in your health career.
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                                <Link to={ROUTE_PATHS.REGISTER}>
                                    <Button size="lg" className="w-full sm:w-auto bg-primary-50 text-primary-800 hover:bg-primary-50 focus:ring-white shadow-xl transition-transform hover:-translate-y-1">
                                        Create Your Membership Today
                                    </Button>
                                </Link>
                                <Link to={ROUTE_PATHS.JOBS}>
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-50 text-primary-50 hover:bg-white/10 hover:border-white/50 focus:ring-white backdrop-blur-sm shadow-xl transition-transform hover:-translate-y-1">
                                        Explore Jobs First
                                    </Button>
                                </Link>
                            </div>
                            <p className="mt-6 text-sm text-primary-200">
                                Over 2,500 CHEW professionals and students have already joined.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
