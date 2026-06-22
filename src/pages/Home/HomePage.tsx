import { Link } from "react-router";
import { ROUTE_PATHS } from "@/routes/routePaths";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import heroBg from "@/assets/heroBg.png";
import {
  HiOutlineIdentification,
  HiOutlineBriefcase,
  HiOutlineUser,
  HiOutlineViewGrid,
  HiOutlineShieldCheck,
  HiOutlineAcademicCap,
  HiOutlineTrendingUp,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import charimanPng from "@/assets/chairman.png";
import treaturer from "@/assets/treasurer.jpeg";
import secretary from "@/assets/secretary.png";
import osecruty from "@/assets/osecre.png";

const platformFeatures = [
  {
    icon: HiOutlineIdentification,
    title: "Instant ID Generation",
    description:
      "Generate your official digital identity card with a unique QR code for immediate professional verification.",
  },
  {
    icon: HiOutlineBriefcase,
    title: "Smart Job Matching",
    description:
      "A tailored health-sector job board matching your L.G.A location and qualification tier to active vacancies.",
  },
  {
    icon: HiOutlineUser,
    title: "Verified Member Directory",
    description:
      "A public-facing lookup enabling healthcare boards and hospital managers to instantly verify member credentials.",
  },
  {
    icon: HiOutlineViewGrid,
    title: "L.G.A Chapter Network",
    description:
      "Dedicated portals for each of Katsina\u2019s 30 Local Government Areas to coordinate local health worker campaigns.",
  },
];

const stats = [
  { value: "2,500+", label: "Registered Members" },
  { value: "150+", label: "Partner Organizations" },
  { value: "30", label: "Local Government Areas" },
  { value: "98%", label: "ID Approval Rate" },
];

const team = [
  {
    img: charimanPng,
    name: "RCHP Haruna Usman",
    position: "Chairman",
    Town: "Baure L.G.A",
  },
  {
    img: secretary,
    name: "RCHP Saifullahi Usman",
    position: "Secretary",
    Town: "Jibia L.G.A",
  },
  {
    img: treaturer,
    name: "RCHP Shafiu Kasim Masanawa",
    position: "Treasurer",
    Town: "Katsina L.G.A",
  },
  {
    img: "https://via.placeholder.com/150",
    name: "RCHP Muhammad Abubakar",
    position: "Public Relation Officer (P.R.O)",
    Town: "Malumfashi L.G.A",
  },
  {
    img: osecruty,
    name: "RCHP Hassan Abdullahi",
    position: "Organising Security",
    Town: "Jibia L.G.A",
  },
  {
    img: "https://via.placeholder.com/150",
    name: "Fatima Muhammad",
    position: "Welfare Officer",
    Town: "Bakori L.G.A",
  },
];

function InitialAvatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizeClasses =
    size === "lg" ? "h-32 w-32 text-3xl" : "h-24 w-24 text-2xl";

  return (
    <div
      className={`flex ${sizeClasses} items-center justify-center rounded-full bg-gradient-to-tr from-accent-600 to-primary-500 font-bold text-white ring-4 ring-primary-100 shadow-inner mb-4 select-none`}
    >
      {initials}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat py-20 lg:py-32"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Dark rich overlay to make sure text is extremely legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-surface-950/95 via-surface-900/80 to-primary-950/40 z-0"></div>

        {/* SVG background grid/lines */}
        <div className="absolute inset-0 opacity-15 z-0">
          <svg
            className="h-full w-full"
            viewBox="0 0 800 600"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              cx="400"
              cy="300"
              r="250"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
            <circle
              cx="400"
              cy="300"
              r="180"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />
            <circle
              cx="400"
              cy="300"
              r="110"
              fill="none"
              stroke="white"
              strokeWidth="0.3"
            />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 max-w-2xl text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-accent-300 backdrop-blur-md ring-1 ring-white/20">
                🏥 Katsina Young Community Health Workers Association
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Shape the Future of <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-primary-400">
                  Community Healthcare
                </span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-surface-200">
                The official professional association connecting Community
                Health Extension Workers (CHEW) and students in Katsina State
                with exclusive jobs, verified credentials, and career growth.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to={ROUTE_PATHS.REGISTER}>
                  <Button
                    size="lg"
                    className="bg-accent-500 text-white hover:bg-accent-600 border-none transition-all duration-300 hover:shadow-lg hover:shadow-accent-500/30 transform hover:-translate-y-0.5 animate-bounce-short"
                  >
                    Join the Community
                  </Button>
                </Link>
                <Link to={ROUTE_PATHS.ID_CARD}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/40 text-white hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Get Your Membership ID
                  </Button>
                </Link>
              </div>
            </div>

            {/* Digital Card Mockup */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="relative mx-auto max-w-sm">
                {/* Glow Effects */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary-500 to-accent-400 opacity-30 blur-xl animate-pulse"></div>
                <div className="absolute -inset-3 rounded-2xl bg-gradient-to-tr from-accent-500 to-primary-400 opacity-10 blur-2xl"></div>

                {/* Card Body */}
                <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-b from-surface-900/95 to-surface-950/98 p-6 text-white shadow-2xl backdrop-blur-xl transition-all duration-500 hover:rotate-1 hover:scale-105">
                  {/* Hologram/Wave overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_50%,rgba(255,255,255,0.03)_100%)]"></div>

                  {/* Logo and Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 shadow-md">
                        <span className="text-xs font-extrabold text-white">
                          KY
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold tracking-wide">
                          KY<span className="text-accent-400">Chew</span>
                        </h3>
                        <p className="text-[9px] uppercase tracking-wider text-surface-400">
                          Katsina State Association
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      Verified Member
                    </span>
                  </div>

                  {/* Profile Info and Photo */}
                  <div className="mt-6 flex items-start gap-4">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-surface-800">
                      <div className="flex h-full w-full flex-col items-center justify-end bg-gradient-to-b from-surface-700 to-surface-800 pt-3">
                        <svg
                          className="h-20 w-20 text-surface-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-accent-500 flex items-center justify-center">
                        <svg
                          className="h-2 w-2 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs uppercase tracking-wider text-surface-400 font-medium">
                        Member Name
                      </p>
                      <h4 className="truncate text-base font-bold text-white">
                        Aisha Ibrahim Bello
                      </h4>

                      <p className="mt-2.5 text-[10px] uppercase tracking-wider text-surface-400 font-medium">
                        L.G.A Chapter
                      </p>
                      <p className="text-xs font-semibold text-primary-200">
                        Jibia L.G.A
                      </p>

                      <p className="mt-2.5 text-[10px] uppercase tracking-wider text-surface-400 font-medium">
                        Category
                      </p>
                      <p className="text-xs font-semibold text-accent-300">
                        Community Health Worker
                      </p>
                    </div>
                  </div>

                  {/* Bottom Bar */}
                  <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-surface-400 font-medium">
                        Registration ID
                      </p>
                      <p className="text-xs font-mono font-bold tracking-wider text-white">
                        KY-CHEW-2026-4890
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex gap-[2px] items-center h-6 bg-white/10 px-2 py-1 rounded">
                        <span className="w-[1px] h-full bg-white"></span>
                        <span className="w-[2px] h-full bg-white"></span>
                        <span className="w-[1px] h-full bg-white"></span>
                        <span className="w-[3px] h-full bg-white"></span>
                        <span className="w-[1px] h-full bg-white"></span>
                        <span className="w-[2px] h-full bg-white"></span>
                        <span className="w-[1px] h-full bg-white"></span>
                      </div>
                      <span className="text-[7px] text-surface-400 font-mono">
                        KYCHEW SECURE ID
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-10 z-20 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="text-center shadow-lg bg-white/95 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-t-2 border-t-accent-400"
            >
              <p className="text-3xl font-extrabold text-primary-800 sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-surface-500 sm:text-sm">
                {stat.label}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Services */}
      <section
        id="services"
        className="relative py-20 bg-white border-y border-surface-200/50"
      >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-800">
              Our Services
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-surface-900 sm:text-4xl">
              Tailored Services for Healthcare Career Growth
            </h2>
            <p className="mt-4 text-lg text-surface-500 font-medium">
              Comprehensive support systems designed to facilitate professional
              growth and credential integrity for community health workers.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: HiOutlineBriefcase,
                title: "Priority Job Placements",
                description:
                  "Access a curated database of openings at community clinics, government health facilities, and health agencies.",
              },
              {
                icon: HiOutlineShieldCheck,
                title: "Verifiable Digital Credentials",
                description:
                  "Generate high-security membership IDs that enable immediate background verification for clinical recruiters.",
              },
              {
                icon: HiOutlineAcademicCap,
                title: "SIWES Internship Support",
                description:
                  "Direct matching assistance for community health students looking to secure clinical internship hours.",
              },
              {
                icon: HiOutlineTrendingUp,
                title: "Continuing Professional Education",
                description:
                  "Regular workshops, health guides, and skill assessment programs to stay ahead of evolving medical practices.",
              },
            ].map((service) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.title}
                  hover
                  className="relative flex flex-col items-center p-8 text-center transition-all duration-300 hover:-translate-y-1.5 group"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 shadow-sm ring-1 ring-primary-100 transition-colors duration-300 group-hover:bg-primary-600 group-hover:text-white">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-surface-900 leading-snug">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-surface-500">
                    {service.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="relative py-20 bg-surface-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary-50/20 via-transparent to-transparent"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left Column */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-3 py-1 text-sm font-semibold text-accent-800">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-600"></span>
                Why Choose KYChew
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-surface-900 sm:text-4xl">
                Empowering Frontline Healthcare Across Katsina State
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-surface-600">
                The Katsina State Young Community Health Workers Association
                (KYChew) is the premier professional network dedicated to
                community health extension workers, practitioners, and students.
              </p>
              <p className="mt-4 text-base leading-relaxed text-surface-500">
                We bridge the gap between academic training, certification, and
                clinical employment, ensuring our members are equipped,
                verified, and prioritized for placement in healthcare
                institutions throughout the region.
              </p>
              <div className="mt-8">
                <Link to={ROUTE_PATHS.REGISTER}>
                  <Button
                    variant="primary"
                    size="lg"
                    className="shadow-md transition-transform hover:-translate-y-0.5"
                  >
                    Join Over 2,500+ Members
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column */}
            <div className="grid gap-6 sm:grid-cols-1">
              {[
                {
                  title: "Statewide L.G.A Coverage",
                  description:
                    "Active local government area chapters across all 30 LGAs in Katsina, facilitating local networking and support.",
                },
                {
                  title: "Direct Recruitment Pipelines",
                  description:
                    "Partnerships with state primary healthcare centers, clinics, and NGOs for exclusive, priority job opportunities.",
                },
                {
                  title: "Eliminating Credential Fraud",
                  description:
                    "Verifiable digital membership IDs containing a unique QR-code to instantly authenticate your qualifications.",
                },
                {
                  title: "Dedicated SIWES Student Placements",
                  description:
                    "Coordinated training coordination to ensure student members secure critical clinical experience hours.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 p-5 rounded-2xl bg-white border border-surface-200/60 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex-shrink-0">
                    <HiOutlineCheckCircle className="h-6 w-6 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-surface-900">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-surface-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section
        id="features"
        className="relative py-20 bg-white border-b border-surface-200/50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-3 py-1 text-sm font-semibold text-accent-800">
              Platform Features
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-surface-900 sm:text-4xl">
              Designed for Katsina's Healthcare Success
            </h2>
            <p className="mt-4 text-lg text-surface-500 font-medium">
              A highly optimized web portal to power the recruitment and
              management of health workers.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {platformFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  hover
                  className="relative flex flex-col items-center p-8 text-center transition-all duration-300 hover:-translate-y-1.5 group bg-white border border-surface-200"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 shadow-sm ring-1 ring-accent-100 transition-colors duration-300 group-hover:bg-accent-600 group-hover:text-white">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-surface-900 leading-snug">
                    {feature.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-surface-500">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section
        id="team"
        className="relative py-20 bg-gradient-to-br from-surface-50 to-primary-50/30"
      >
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-5">
          <svg
            className="h-full w-full"
            viewBox="0 0 800 600"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              cx="400"
              cy="300"
              r="250"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle
              cx="400"
              cy="300"
              r="180"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <circle
              cx="400"
              cy="300"
              r="110"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.3"
            />
          </svg>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-800">
              Executive Committee
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-surface-900 sm:text-4xl">
              Meet Our Leadership
            </h2>
            <p className="mt-4 text-lg text-surface-500 font-medium">
              A dedicated group powering KYChew behind the scenes to support our
              state-wide community.
            </p>
          </div>
          <div className="mt-16">
            {/* Chairman */}
            <div className="flex justify-center mb-12">
              <Card className="flex flex-col items-center p-8 text-center max-w-sm w-full shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-t-4 border-t-primary-600">
                {team[0].img &&
                team[0].img !== "https://via.placeholder.com/150" ? (
                  <img
                    src={team[0].img}
                    alt={team[0].name}
                    className="h-32 w-32 rounded-full object-cover mb-4 ring-4 ring-primary-100 shadow-md"
                  />
                ) : (
                  <InitialAvatar name={team[0].name} size="lg" />
                )}
                <h3 className="text-2xl font-bold text-surface-900">
                  {team[0].name}
                </h3>
                <p className="text-lg text-primary-600 font-semibold">
                  {team[0].position}
                </p>
                <p className="text-sm text-surface-500 font-medium mt-1">
                  {team[0].Town}
                </p>
              </Card>
            </div>
            {/* Secretary and Treasurer */}
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto mb-12">
              {team.slice(1, 3).map((member) => (
                <Card
                  key={member.name}
                  className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-t-4 border-t-accent-500"
                >
                  {member.img &&
                  member.img !== "https://via.placeholder.com/150" ? (
                    <img
                      src={member.img}
                      alt={member.name}
                      className="h-24 w-24 rounded-full object-cover mb-4 ring-4 ring-accent-100 shadow-md"
                    />
                  ) : (
                    <InitialAvatar name={member.name} size="md" />
                  )}
                  <h3 className="text-xl font-bold text-surface-900">
                    {member.name}
                  </h3>
                  <p className="text-base text-accent-700 font-semibold">
                    {member.position}
                  </p>
                  <p className="text-xs text-surface-500 mt-1 font-medium">
                    {member.Town}
                  </p>
                </Card>
              ))}
            </div>
            {/* Rest of the Team */}
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {team.slice(3).map((member) => (
                <Card
                  key={member.name}
                  className="flex flex-col items-center p-6 text-center hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-t-2 border-t-surface-200"
                >
                  {member.img &&
                  member.img !== "https://via.placeholder.com/150" ? (
                    <img
                      src={member.img}
                      alt={member.name}
                      className="h-24 w-24 rounded-full object-cover mb-4 ring-2 ring-surface-200 shadow-sm"
                    />
                  ) : (
                    <InitialAvatar name={member.name} size="md" />
                  )}
                  <h3 className="text-lg font-bold text-surface-900">
                    {member.name}
                  </h3>
                  <p className="text-sm text-surface-600 font-semibold">
                    {member.position}
                  </p>
                  <p className="text-xs text-surface-400 mt-1 font-medium">
                    {member.Town}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-100/50"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-800 via-primary-900 to-accent-950 shadow-2xl relative">
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl"></div>
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-400/20 blur-3xl"></div>

            <div className="relative px-6 py-16 sm:px-16 sm:py-20 text-center lg:px-24">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Join the CHEW Community Today
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-100 leading-relaxed">
                Get access to job opportunities, professional guidance, and a
                supportive community. Take the next step in your health career.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <Link to={ROUTE_PATHS.REGISTER}>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-accent-500 text-white hover:bg-accent-600 border-none shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Create Your Membership Today
                  </Button>
                </Link>
                <Link to={ROUTE_PATHS.JOBS}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-white text-white hover:bg-white/10 focus:ring-white backdrop-blur-sm shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Explore Jobs First
                  </Button>
                </Link>
              </div>
              <p className="mt-8 text-sm font-semibold text-accent-300">
                Over 2,500 CHEW professionals and students have already joined.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
