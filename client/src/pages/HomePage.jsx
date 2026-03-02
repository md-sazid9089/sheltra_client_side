import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function HomePage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const stats = [
        { value: '1,200+', label: 'Refugees Helped', icon: '👥' },
        { value: '3,500+', label: 'Skills Verified', icon: '✓' },
        { value: '850+', label: 'Jobs Matched', icon: '💼' },
        { value: '60+', label: 'Partner NGOs', icon: '🤝' },
    ];

    const howItWorksSteps = [
        {
            step: '01',
            title: 'Create Profile',
            description: 'Register and build your professional profile with personal details and work history.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
        {
            step: '02',
            title: 'Add Skills',
            description: 'List your skills, expertise, and experience to showcase your capabilities.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
        },
        {
            step: '03',
            title: 'NGO Verification',
            description: 'Partner NGOs verify your skills through trusted assessment processes.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            step: '04',
            title: 'Get Matched',
            description: 'AI matches you with ethical employers seeking your verified skills.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
        },
    ];

    const features = [
        {
            title: 'Verified Skill Profiles',
            description: 'NGO-verified skills ensure credibility and trust for both refugees and employers.',
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ),
            gradient: 'from-primary-500 to-primary-600',
        },
        {
            title: 'NGO Partnership',
            description: 'Trusted NGOs conduct thorough skill assessments and provide ongoing support.',
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
            ),
            gradient: 'from-success-500 to-success-600',
        },
        {
            title: 'Ethical Employer Access',
            description: 'Connect with vetted employers committed to fair labor practices and integration.',
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                </svg>
            ),
            gradient: 'from-warning-500 to-warning-600',
        },
        {
            title: 'AI-Powered Matching',
            description: 'Advanced algorithms match skills with opportunities for optimal placement.',
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 7H7v6h6V7z" />
                    <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                </svg>
            ),
            gradient: 'from-purple-500 to-purple-600',
        },
        {
            title: 'Impact Analytics',
            description: 'Track progress with SDG-aligned metrics and transparent reporting.',
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
            ),
            gradient: 'from-pink-500 to-pink-600',
        },
        {
            title: 'Privacy & Security',
            description: 'GDPR-compliant with consent-based data sharing and secure storage.',
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ),
            gradient: 'from-indigo-500 to-indigo-600',
        },
    ];

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
            {/* Capsule Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 transition-all duration-500 ${scrolled ? 'py-2' : 'py-3 sm:py-4'}`}>
                <div className="max-w-7xl mx-auto">
                    <div className={`bg-white/95 backdrop-blur-2xl rounded-full shadow-xl shadow-black/5 border border-white/20 px-4 sm:px-6 transition-all duration-500 ${scrolled ? 'py-2' : 'py-2.5 sm:py-3'} flex items-center justify-between`}>
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-primary-600 via-primary-600 to-primary-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25 ring-2 ring-white/50 transition-transform hover:scale-105">
                                <span className="text-lg sm:text-xl font-bold text-white">S</span>
                            </div>
                            <span className="text-lg sm:text-xl font-bold bg-linear-to-r from-primary-600 via-primary-600 to-primary-700 bg-clip-text text-transparent">
                                Sheltra
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-4 lg:gap-8">
                            <a href="#about" className="text-sm lg:text-base font-semibold text-gray-700 hover:text-primary-600 transition-all duration-300 relative group whitespace-nowrap">
                                About
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-500 group-hover:w-full transition-all duration-300"></span>
                            </a>
                            <a href="#how-it-works" className="text-sm lg:text-base font-semibold text-gray-700 hover:text-primary-600 transition-all duration-300 relative group whitespace-nowrap">
                                How it Works
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-500 group-hover:w-full transition-all duration-300"></span>
                            </a>
                            <a href="#features" className="text-sm lg:text-base font-semibold text-gray-700 hover:text-primary-600 transition-all duration-300 relative group whitespace-nowrap">
                                Features
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-500 group-hover:w-full transition-all duration-300"></span>
                            </a>
                            <Link to="/login">
                                <Button variant="primary" size="sm" className="shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300">
                                    Sign In
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-3 bg-white/98 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/10 border border-white/20 p-6 animate-in slide-in-from-top duration-300">
                            <div className="flex flex-col gap-4">
                                <a href="#about" className="px-4 py-3 text-gray-700 font-medium hover:bg-gradient-to-r hover:from-primary-50 hover:to-blue-50 rounded-xl transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
                                    About
                                </a>
                                <a href="#how-it-works" className="px-4 py-3 text-gray-700 font-medium hover:bg-gradient-to-r hover:from-primary-50 hover:to-blue-50 rounded-xl transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
                                    How it Works
                                </a>
                                <a href="#features" className="px-4 py-3 text-gray-700 font-medium hover:bg-gradient-to-r hover:from-primary-50 hover:to-blue-50 rounded-xl transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
                                    Features
                                </a>
                                <Link to="/login" className="w-full mt-2" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="primary" size="md" fullWidth className="shadow-lg shadow-primary-500/25">
                                        Sign In
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section with Background */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image with Enhanced Overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-950/98 via-primary-900/95 to-indigo-950/97 z-10 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-transparent z-20"></div>
                    <img
                        src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2787&auto=format&fit=crop"
                        alt="Community background"
                        className="w-full h-full object-cover scale-105 animate-pulse-slow"
                        style={{ animationDuration: '8s' }}
                    />
                </div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 z-10 opacity-20">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 md:py-32 lg:py-36 xl:py-40 text-center">
                    <div className="animate-in fade-in slide-in-from-bottom duration-1000">
                        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white mb-4 sm:mb-6 leading-tight tracking-tight px-2">
                            <span className="inline-block">Beyond Shelter:</span><br className="hidden sm:block" />
                            <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent animate-gradient-x inline-block">
                                Mapping Skills to
                            </span>
                            <br className="hidden sm:block" />
                            <span className="inline-block">Sustainable Livelihoods</span>
                        </h1>
                    </div>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-blue-100/90 mb-12 sm:mb-16 lg:mb-20 max-w-4xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom duration-1000 delay-200 px-4">
                        Connecting refugee talent with ethical opportunities through verified skills and trusted partnerships
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-16 sm:mb-20 lg:mb-24 animate-in fade-in slide-in-from-bottom duration-1000 delay-300 px-4">
                        <Link to="/login" className="w-full sm:w-auto">
                            <Button
                                variant="primary"
                                size="lg"
                                className="bg-white text-primary-700 hover:bg-blue-50 shadow-2xl shadow-black/25 hover:shadow-3xl hover:scale-105 transition-all duration-300 border border-white/20 w-full sm:w-auto"
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                }
                                iconPosition="right"
                            >
                                Get Started
                            </Button>
                        </Link>
                        <a href="#about" className="w-full sm:w-auto">
                            <Button
                                variant="secondary"
                                size="lg"
                                className="bg-white/10 backdrop-blur-xl text-white border-2 border-white/40 hover:bg-white/20 hover:border-white/60 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                }
                                iconPosition="right"
                            >
                                Learn More
                            </Button>
                        </a>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="hidden sm:flex absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-white/70 text-xs sm:text-sm font-medium">Scroll to explore</span>
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative -mt-16 sm:-mt-20 md:-mt-24 z-30 px-3 sm:px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="group bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl shadow-black/5 border border-white/20 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-2 hover:scale-105 cursor-default"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-br from-primary-600 to-primary-700 bg-clip-text text-transparent mb-1 sm:mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-xs sm:text-sm md:text-base text-gray-600 font-semibold">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About / Mission Section */}
            <section id="about" className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 scroll-mt-16 sm:scroll-mt-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-20 items-center">
                        {/* Text Content */}
                        <div className="space-y-4 sm:space-y-6 order-2 md:order-1">
                            <div className="inline-block">
                                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-blue-100 text-primary-700 text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-primary-200">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                                    </svg>
                                    Our Mission
                                </span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                                Empowering Refugees Through
                                <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent"> Skills & Opportunities</span>
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                                Sheltra goes beyond providing shelter to refugees. We believe in empowering displaced individuals by mapping their skills to sustainable livelihoods.
                            </p>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                                Through our verified skill platform, we connect refugee talent with ethical employers, ensuring fair opportunities and economic integration. Our partnership with trusted NGOs guarantees skill authenticity while our AI-powered matching creates meaningful employment connections.
                            </p>
                            <div className="space-y-4 pt-4">
                                <div className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-success-500/25 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">Verified Skills</h3>
                                        <p className="text-gray-600">NGO-certified capabilities ensure credibility and trust</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/25 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">Ethical Employers</h3>
                                        <p className="text-gray-600">Vetted companies committed to fair labor practices</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">SDG-Aligned</h3>
                                        <p className="text-gray-600">Contributing to UN Sustainable Development Goals</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Image Placeholder */}
                        <div className="relative order-1 md:order-2 mb-8 md:mb-0">
                            <div className="aspect-square rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/10 border-4 sm:border-8 border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=2787&auto=format&fit=crop"
                                    alt="People working together"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            {/* Floating Card */}
                            <div className="absolute -bottom-4 sm:-bottom-6 md:-bottom-8 -right-4 sm:-right-6 md:-right-8 bg-white/98 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl shadow-primary-500/10 border border-white/20 max-w-[180px] sm:max-w-xs hover:scale-105 transition-transform duration-300">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-primary-500 via-primary-600 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl shadow-xl shadow-primary-500/30">
                                        🌍
                                    </div>
                                    <div>
                                        <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">15+</div>
                                        <div className="text-xs sm:text-sm font-semibold text-gray-600">Countries Supported</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80 scroll-mt-16 sm:scroll-mt-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16 md:mb-20">
                        <div className="inline-block mb-4">
                            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-purple-100 text-primary-700 text-sm font-bold px-4 py-2 rounded-full border border-primary-200">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                                </svg>
                                Simple Process
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Four simple steps to connect refugee talent with meaningful opportunities
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {howItWorksSteps.map((step, index) => (
                            <div key={index} className="relative group">
                                {/* Connection Line (desktop only) */}
                                {index < howItWorksSteps.length - 1 && (
                                    <div className="hidden lg:block absolute top-24 left-[60%] w-[80%] h-1 bg-gradient-to-r from-primary-400 via-blue-400 to-purple-400 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
                                    </div>
                                )}

                                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-3 border border-white/50 h-full">
                                    {/* Step Number Badge */}
                                    <div className="absolute -top-4 -left-4 w-14 h-14 bg-gradient-to-br from-primary-500 via-primary-600 to-blue-600 text-white text-xl font-black rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                                        {step.step}
                                    </div>

                                    {/* Icon */}
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary-100 via-blue-100 to-purple-100 rounded-3xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                                        {step.icon}
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-black text-gray-900 mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 scroll-mt-16 sm:scroll-mt-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16 md:mb-20">
                        <div className="inline-block mb-4">
                            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-indigo-100 text-primary-700 text-sm font-bold px-4 py-2 rounded-full border border-primary-200">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                                </svg>
                                Platform Features
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
                            Comprehensive Tools
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Designed to create sustainable impact through verified skills and ethical connections
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative bg-white/80 backdrop-blur-2xl rounded-3xl p-8 lg:p-10 shadow-xl shadow-black/5 border border-white/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                            >
                                {/* Animated Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                                
                                {/* Decorative Element */}
                                <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>

                                {/* Icon */}
                                <div className={`relative w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                    {feature.icon}
                                </div>

                                {/* Content */}
                                <h3 className="relative text-2xl font-black text-gray-900 mb-4 group-hover:text-primary-700 transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="relative text-gray-600 leading-relaxed text-lg">
                                    {feature.description}
                                </p>

                                {/* Arrow Icon */}
                                <div className="relative mt-6 flex items-center text-primary-600 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">
                                    <span className="text-sm">Learn more</span>
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '48px 48px'
                    }}></div>
                </div>

                {/* Animated Blobs */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-block mb-4 sm:mb-6">
                        <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/30">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
                            </svg>
                            Join Our Community
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 sm:mb-8 leading-tight px-4">
                        Ready to Make an Impact?
                    </h2>
                    <p className="text-lg sm:text-xl md:text-2xl text-blue-100/90 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
                        Join thousands of refugees, NGOs, and employers creating sustainable livelihoods and ethical opportunities together.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 px-4">
                        <Link to="/login">
                            <Button
                                variant="primary"
                                size="lg"
                                className="bg-white text-primary-700 hover:bg-blue-50 shadow-2xl shadow-black/30 hover:shadow-3xl hover:scale-105 transition-all duration-300"
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                }
                                iconPosition="right"
                            >
                                Get Started Today
                            </Button>
                        </Link>
                        <a href="mailto:contact@sheltra.org">
                            <Button
                                variant="secondary"
                                size="lg"
                                className="bg-white/10 backdrop-blur-xl text-white border-2 border-white/40 hover:bg-white/20 hover:border-white/60 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                }
                            >
                                Contact Us
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-linear-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-300 py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 mb-10 sm:mb-12">
                        {/* Brand Column */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-primary-600 via-primary-600 to-primary-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/20 ring-2 ring-white/10">
                                    <span className="text-xl sm:text-2xl font-bold text-white">S</span>
                                </div>
                                <span className="text-xl sm:text-2xl font-black text-white">Sheltra</span>
                            </div>
                            <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                                Beyond Shelter: Mapping Skills to Sustainable Livelihoods
                            </p>
                            {/* Social Icons */}
                            <div className="flex gap-2 sm:gap-3">
                                <button disabled className="w-11 h-11 bg-gray-800/80 rounded-xl flex items-center justify-center cursor-not-allowed opacity-50" title="Coming soon">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </button>
                                <button disabled className="w-11 h-11 bg-gray-800/80 rounded-xl flex items-center justify-center cursor-not-allowed opacity-50" title="Coming soon">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                </button>
                                <button disabled className="w-11 h-11 bg-gray-800/80 rounded-xl flex items-center justify-center cursor-not-allowed opacity-50" title="Coming soon">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Platform Column */}
                        <div>
                            <h3 className="text-white font-black text-base sm:text-lg mb-4 sm:mb-6">Platform</h3>
                            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                                <li><Link to="/login" className="text-gray-400 hover:text-primary-400 transition-colors duration-300 hover:translate-x-1 inline-block">For Refugees</Link></li>
                                <li><Link to="/login" className="text-gray-400 hover:text-primary-400 transition-colors duration-300 hover:translate-x-1 inline-block">For NGOs</Link></li>
                                <li><Link to="/login" className="text-gray-400 hover:text-primary-400 transition-colors duration-300 hover:translate-x-1 inline-block">For Employers</Link></li>
                                <li><a href="#how-it-works" className="text-gray-400 hover:text-primary-400 transition-colors duration-300 hover:translate-x-1 inline-block">How it Works</a></li>
                            </ul>
                        </div>

                        {/* Company Column */}
                        <div>
                            <h3 className="text-white font-black text-base sm:text-lg mb-4 sm:mb-6">Company</h3>
                            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                                <li><a href="#about" className="text-gray-400 hover:text-primary-400 transition-colors duration-300 hover:translate-x-1 inline-block">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-300 hover:translate-x-1 inline-block">Our Impact</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-300 hover:translate-x-1 inline-block">Partners</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-300 hover:translate-x-1 inline-block">Careers</a></li>
                            </ul>
                        </div>

                        {/* Support Column */}
                        <div>
                            <h3 className="text-white font-black text-base sm:text-lg mb-4 sm:mb-6">Support</h3>
                            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                                <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-300 hover:translate-x-1 inline-block">Help Center</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-300 hover:translate-x-1 inline-block">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-300 hover:translate-x-1 inline-block">Terms of Service</a></li>
                                <li><a href="mailto:contact@sheltra.org" className="text-gray-400 hover:text-primary-400 transition-colors duration-300 hover:translate-x-1 inline-block">Contact</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-6 sm:pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-center md:text-left">
                        <p className="text-gray-400 text-xs sm:text-sm">
                            © 2026 Sheltra. All rights reserved. Built with 💙 for a better world.
                        </p>
                        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400 flex-wrap justify-center">
                            <a href="#" className="hover:text-primary-400 transition-colors duration-300">Privacy</a>
                            <span className="text-gray-700">•</span>
                            <a href="#" className="hover:text-primary-400 transition-colors duration-300">Terms</a>
                            <span className="text-gray-700">•</span>
                            <a href="#" className="hover:text-primary-400 transition-colors duration-300">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
