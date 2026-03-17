import { useState } from 'react';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className="flex min-h-screen flex-col bg-surface-50">
            {/* Header / Hero */}
            <section className="relative overflow-hidden bg-primary-900 py-20 lg:py-28">
                {/* Decorative Background */}
                <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-primary-700/40 blur-3xl" aria-hidden="true" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl" aria-hidden="true" />
                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-primary-600/20 blur-2xl" aria-hidden="true" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-primary-50 backdrop-blur-md ring-1 ring-blue/20">
                            Support & Inquiries
                        </span>
                        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-primary-50 sm:text-5xl lg:text-6xl">
                            How can we help you?
                        </h1>
                        <p className="mt-6 text-lg text-primary-100 sm:text-xl leading-relaxed">
                            Whether you're a registered health worker facing an issue, or a partner seeking collaboration, our team is ready to provide the support you need.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="relative -mt-16 z-10 mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-12">

                    {/* Left Panel: Contact Information */}
                    <div className="lg:col-span-5 space-y-6">
                        <Card className="h-full bg-white shadow-xl shadow-surface-200/50 border-0 p-8 sm:p-10 rounded-2xl relative overflow-hidden">
                            {/* Subtle Background Pattern in Card */}
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-primary-50 opacity-50 blur-2xl pointer-events-none" />

                            <h2 className="text-2xl font-bold text-surface-900">Get in Touch</h2>
                            <p className="mt-3 text-surface-500 leading-relaxed mb-10">
                                Reach out to us through any of our official channels. We strive to respond to all inquiries within 24 hours.
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-4 items-start group">
                                    <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white shadow-sm ring-1 ring-primary-100 group-hover:ring-primary-600">
                                        <HiOutlineLocationMarker className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-surface-900">Head Office</h3>
                                        <p className="mt-2 text-surface-600 leading-relaxed">
                                            Ministry of Health Complex<br />
                                            Katsina State Secretariat<br />
                                            Katsina, Nigeria
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-start group">
                                    <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600 transition-colors group-hover:bg-accent-600 group-hover:text-white shadow-sm ring-1 ring-accent-100 group-hover:ring-accent-600">
                                        <HiOutlinePhone className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-surface-900">Phone</h3>
                                        <p className="mt-2 text-surface-600">
                                            <a href="tel:+2348000000000" className="hover:text-primary-600 transition-colors font-medium">+234 800 000 0000</a>
                                            <span className="block mt-1 text-sm text-surface-400">Mon-Fri 8am to 5pm</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-start group">
                                    <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white shadow-sm ring-1 ring-emerald-100 group-hover:ring-emerald-600">
                                        <HiOutlineMail className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-surface-900">Email Support</h3>
                                        <p className="mt-2 text-surface-600">
                                            <a href="mailto:support@kychew.org" className="hover:text-primary-600 transition-colors font-medium">support@kychew.org</a>
                                            <span className="block mt-1 text-sm text-surface-400">Online support 24/7</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Panel: Contact Form */}
                    <div className="lg:col-span-7">
                        <Card className="h-full bg-white shadow-xl shadow-surface-200/50 border-0 p-8 sm:p-12 rounded-2xl">
                            {isSubmitted ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-12 min-h-[400px]">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-6 shadow-sm ring-1 ring-emerald-200">
                                        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-surface-900 tracking-tight">Message Sent Successfully!</h3>
                                    <p className="mt-4 text-surface-600 max-w-md mx-auto leading-relaxed">
                                        Thank you for reaching out. We have received your message and a member of our team will get back to you shortly.
                                    </p>
                                    <Button
                                        onClick={() => setIsSubmitted(false)}
                                        variant="outline"
                                        size="lg"
                                        className="mt-10"
                                    >
                                        Send Another Message
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-2xl font-bold text-surface-900 mb-8">Send us a Message</h2>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="first-name" className="block text-sm font-semibold text-surface-700">
                                                    First Name
                                                </label>
                                                <div className="mt-2 text-surface-900">
                                                    <input
                                                        type="text"
                                                        name="first-name"
                                                        id="first-name"
                                                        autoComplete="given-name"
                                                        required
                                                        className="block w-full rounded-xl border-surface-200 bg-surface-50 py-3 px-4 shadow-sm transition-colors focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-200 sm:text-sm"
                                                        placeholder="Jane"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="last-name" className="block text-sm font-semibold text-surface-700">
                                                    Last Name
                                                </label>
                                                <div className="mt-2 text-surface-900">
                                                    <input
                                                        type="text"
                                                        name="last-name"
                                                        id="last-name"
                                                        autoComplete="family-name"
                                                        required
                                                        className="block w-full rounded-xl border-surface-200 bg-surface-50 py-3 px-4 shadow-sm transition-colors focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-200 sm:text-sm"
                                                        placeholder="Doe"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-semibold text-surface-700">
                                                Email Address
                                            </label>
                                            <div className="mt-2 text-surface-900">
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    autoComplete="email"
                                                    required
                                                    className="block w-full rounded-xl border-surface-200 bg-surface-50 py-3 px-4 shadow-sm transition-colors focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-200 sm:text-sm"
                                                    placeholder="jane@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-semibold text-surface-700">
                                                Subject
                                            </label>
                                            <div className="mt-2 text-surface-900">
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    id="subject"
                                                    required
                                                    className="block w-full rounded-xl border-surface-200 bg-surface-50 py-3 px-4 shadow-sm transition-colors focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-200 sm:text-sm"
                                                    placeholder="How can we help you?"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-semibold text-surface-700">
                                                Message
                                            </label>
                                            <div className="mt-2 text-surface-900">
                                                <textarea
                                                    id="message"
                                                    name="message"
                                                    rows={5}
                                                    required
                                                    className="block w-full rounded-xl border-surface-200 bg-surface-50 py-3 px-4 shadow-sm transition-colors focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-200 sm:text-sm resize-y"
                                                    placeholder="Please provide as much detail as possible..."
                                                    defaultValue={''}
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <Button
                                                type="submit"
                                                className="w-full py-3.5 text-base font-semibold shadow-md transition-transform hover:-translate-y-0.5"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <span className="flex items-center gap-2 justify-center">
                                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Sending Message...
                                                    </span>
                                                ) : 'Send Message'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </Card>
                    </div>

                </div>
            </section>
        </div>
    );
}
