import React, { useState, useEffect, useRef } from 'react';
import {
    Sun,
    Camera,
    Car,
    Cpu,
    FerrisWheel as Ferris,
    Code,
    Phone,
    Mail,
    MapPin,
    ChevronRight,
    Star,
    CheckCircle,
    Award,
    Clock,
    Users,
    Building,
    X,
    Menu,
    ArrowUp,
    Loader2,
    Shield,
    Zap,
    Hexagon
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { supabase } from './lib/supabase';

// Icon mapping for dynamic icon rendering
const IconMap = {
    Users,
    CheckCircle,
    Award,
    Building,
    Shield,
    Zap
};

const services = [
    {
        icon: Sun,
        title: "Solar/Inverter Solutions",
        description: "Professional installation and repair of solar systems and inverters for homes and businesses",
        details: [
            "Complete solar system design and installation",
            "Inverter maintenance and repairs",
            "Battery backup solutions",
            "Energy consumption analysis",
            "Grid-tie and off-grid systems",
            "24/7 emergency support",
            "System monitoring setup",
            "Energy efficiency consulting"
        ]
    },
    {
        icon: Camera,
        title: "CCTV Systems",
        description: "Advanced surveillance solutions for homes and offices with 24/7 monitoring capabilities",
        details: [
            "HD and 4K camera installations",
            "Remote viewing setup",
            "Motion detection systems",
            "Night vision capabilities",
            "Cloud storage solutions",
            "Mobile app integration",
            "Regular maintenance service",
            "Security assessment"
        ]
    },
    {
        icon: Car,
        title: "Vehicle Security",
        description: "State-of-the-art vehicle security systems and tracking solutions",
        details: [
            "GPS tracking installation",
            "Remote immobilization systems",
            "Anti-theft alarm setup",
            "Mobile app monitoring",
            "Real-time location tracking",
            "Geofencing setup",
            "Engine diagnostics integration",
            "24/7 vehicle monitoring"
        ]
    },
    {
        icon: Cpu,
        title: "Embedded Systems",
        description: "Custom embedded solutions for automation and control systems",
        details: [
            "Custom hardware design",
            "Firmware development",
            "IoT device integration",
            "Industrial automation",
            "Sensor networks",
            "Real-time systems",
            "Performance optimization",
            "System maintenance"
        ]
    },
    {
        icon: Ferris,
        title: "Amusement Park Technology",
        description: "Expert maintenance and repair of amusement park ride systems",
        details: [
            "Ride control systems",
            "Safety mechanism testing",
            "PLC programming",
            "Preventive maintenance",
            "Emergency response service",
            "System upgrades",
            "Operator training",
            "Safety compliance checks"
        ]
    },
    {
        icon: Code,
        title: "Custom Software",
        description: "Tailored software solutions for homes and businesses",
        details: [
            "Business automation software",
            "Mobile app development",
            "Web applications",
            "Database solutions",
            "Cloud integration",
            "API development",
            "Software maintenance",
            "Technical support"
        ]
    }
];

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Business Owner",
        content: "The solar installation service was exceptional. Our energy bills have decreased significantly while maintaining the sophisticated aesthetic of our property.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "Michael Chen",
        role: "Property Manager",
        content: "Their CCTV installation has greatly improved our building security with a system that integrates beautifully with our modern architecture. Highly recommended!",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
        name: "David Smith",
        role: "Theme Park Director",
        content: "Outstanding maintenance service for our rides. They ensure everything runs smoothly and safely while understanding the aesthetic requirements of our premium attractions.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    }
];

const features = [
    {
        icon: Shield,
        title: "Premium Protection",
        description: "Industry-leading warranty and service guarantees"
    },
    {
        icon: CheckCircle,
        title: "Certified Experts",
        description: "Elite technicians with advanced certifications"
    },
    {
        icon: Zap,
        title: "Rapid Response",
        description: "24/7 priority service for all clients"
    }
];

export default function App() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stats, setStats] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        service: 'Solar/Inverter Solutions',
        message: ''
    });

    const [isIntersecting, setIsIntersecting] = useState({
        services: false,
        features: false,
        testimonials: false
    });

    // Refs for scroll animations
    const servicesRef = useRef(null);
    const featuresRef = useRef(null);
    const testimonialsRef = useRef(null);

    useEffect(() => {
        fetchStats();

        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll);

        // Setup intersection observers for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.target === servicesRef.current) {
                    setIsIntersecting(prev => ({ ...prev, services: entry.isIntersecting }));
                } else if (entry.target === featuresRef.current) {
                    setIsIntersecting(prev => ({ ...prev, features: entry.isIntersecting }));

                } else if (entry.target === testimonialsRef.current) {
                    setIsIntersecting(prev => ({ ...prev, testimonials: entry.isIntersecting }));
                }
            });
        }, observerOptions);

        [servicesRef, featuresRef, testimonialsRef].forEach(ref => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            [servicesRef, featuresRef, testimonialsRef].forEach(ref => {
                if (ref.current) observer.unobserve(ref.current);
            });
        };
    }, []);

    const fetchStats = async () => {
        try {
            const { data, error } = await supabase
                .from('stats')
                .select('*')
                .order('id');

            if (error) throw error;
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast.error('Failed to load statistics');
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80; // Height of the fixed navbar
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        setIsNavOpen(false);
    };

    const handleGetStarted = () => {
        scrollToSection('contact');
    };

    const handleLearnMore = () => {
        scrollToSection('services');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('contact_messages')
                .insert([
                    {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        email: formData.email,
                        service: formData.service,
                        message: formData.message
                    }
                ]);

            if (error) throw error;

            toast.success('Thank you for your message! We will get back to you soon.');

            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                service: 'Solar/Inverter Solutions',
                message: ''
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Something went wrong. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const ServiceModal = () => {
        if (selectedService === null) return null;

        const service = services[selectedService];
        const ServiceIcon = service.icon;

        return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                    <div className="relative">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-4 shadow-lg">
                            <ServiceIcon className="w-7 h-7 text-white" />
                        </div>
                    </div>
                    <div className="p-8 pt-14 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-gray-800">
                                {service.title}
                            </h3>
                            <button
                                onClick={() => setSelectedService(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                    <div className="p-8">
                        <p className="text-gray-600 leading-relaxed mb-8">
                            {service.description}
                        </p>
                        <h4 className="font-semibold text-gray-800 mb-6 flex items-center">
                            <span className="bg-blue-100 w-1 h-6 mr-3"></span>
                            Premium Services
                        </h4>
                        <ul className="space-y-4">
                            {service.details.map((detail, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-600">
                                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                                    <span className="leading-relaxed">{detail}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-10 flex justify-end">
                            <button
                                onClick={handleGetStarted}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg shadow-lg transition-all duration-300 mr-4"
                            >
                                Request Quote
                            </button>
                            <button
                                onClick={() => setSelectedService(null)}
                                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 5000,
                    style: {
                        background: '#F9FAFB',
                        color: '#1F2937',
                        border: '1px solid #E5E7EB',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    },
                    success: {
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#ECFDF5'
                        }
                    },
                    error: {
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#FEF2F2'
                        }
                    }
                }}
            />

            {/* Navigation */}
            <nav className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-md">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Hexagon className="w-10 h-10 text-blue-600 fill-blue-50" />
                                <Cpu className="w-5 h-5 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                TechServices
                            </span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium tracking-wide">Home</button>
                            <button onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium tracking-wide">Services</button>

                            <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium tracking-wide">About</button>
                            <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium tracking-wide">Contact</button>
                            <button
                                onClick={() => scrollToSection('contact')}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-300 text-sm font-medium"
                            >
                                Get Quote
                            </button>
                        </div>
                        <button
                            className="md:hidden text-gray-700 hover:text-blue-600"
                            onClick={() => setIsNavOpen(!isNavOpen)}
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <div className={`md:hidden absolute top-full left-0 w-full bg-white shadow-xl transition-all duration-300 ease-in-out ${isNavOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                        <div className="container mx-auto px-6 py-6 space-y-5">
                            <button onClick={() => scrollToSection('home')} className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 font-medium">Home</button>
                            <button onClick={() => scrollToSection('services')} className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 font-medium">Services</button>

                            <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 font-medium">About</button>
                            <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 font-medium">Contact</button>
                            <button
                                onClick={() => scrollToSection('contact')}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors font-medium"
                            >
                                Get Quote
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div
                id="home"
                className="relative min-h-screen flex items-center pt-20"
                style={{
                    backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.65)), url("https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Accent elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-1/3 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/3 w-40 h-40 md:w-80 md:h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-6 z-10">
                    <div className="max-w-3xl">
                        <div className="inline-block mb-6 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-md rounded-full px-4 py-1">
                            <span className="text-white text-sm font-medium">Innovative Technical Solutions</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                            Advanced Technology <br className="hidden md:block" /> for Modern Excellence
                        </h1>
                        <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-2xl font-light">
                            From sophisticated solar integration to enterprise-level security systems, we deliver premium technical services with unparalleled expertise and elegant execution.
                        </p>
                        <div className="flex flex-wrap gap-5">
                            <button
                                onClick={handleGetStarted}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 group"
                            >
                                Get Started
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={handleLearnMore}
                                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300 backdrop-blur-sm border border-white/20"
                            >
                                Explore Services
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom wave effect */}
                <div className="absolute bottom-0 left-0 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
                        <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,170.7C384,181,480,171,576,144C672,117,768,75,864,80C960,85,1056,139,1152,149.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </div>

            {/* Stats Section */}
            <div id="about" className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-40 -left-40 w-80 h-80 border border-white/30 rounded-full"></div>
                    <div className="absolute top-20 right-20 w-60 h-60 border border-white/30 rounded-full"></div>
                    <div className="absolute -bottom-40 left-1/3 w-80 h-80 border border-white/30 rounded-full"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat) => {
                            const IconComponent = IconMap[stat.icon];
                            return (
                                <div key={stat.id} className="text-center text-white group">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-white/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 transform scale-75 group-hover:scale-125 opacity-50"></div>
                                        {IconComponent && <IconComponent className="w-8 h-8 mx-auto mb-4 relative" />}
                                    </div>
                                    <div className="text-4xl font-bold mb-2 tracking-tight">{stat.value}</div>
                                    <div className="text-blue-100 font-medium">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div
                ref={featuresRef}
                className="py-24 bg-gray-50"
            >
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-2 inline-block">Why Choose Us</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Premium Excellence Guarantee</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            We blend sophisticated technical expertise with personalized service
                            to deliver unparalleled solutions for discerning clients.
                        </p>
                    </div>
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`bg-white p-10 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden
                ${isIntersecting.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                style={{ transitionDelay: `${index * 150}ms` }}
                            >
                                {/* Accent corner design */}
                                <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-50 rounded-full"></div>

                                <div className="relative">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 w-16 h-16 flex items-center justify-center mb-8">
                                        <feature.icon className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div id="services" ref={servicesRef} className="py-24 bg-white relative">
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50 opacity-70 rounded-bl-full pointer-events-none"></div>

                <div className="container mx-auto px-6 relative">
                    <div className="text-center mb-20">
                        <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-2 inline-block">Our Expertise</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Premium Technical Services</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            Comprehensive technical solutions tailored with precision,
                            delivered by industry experts for exceptional results.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <div
                                    key={index}
                                    className={`group p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative border border-gray-100
                  ${isIntersecting.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="bg-blue-50 rounded-2xl p-4 w-16 h-16 flex items-center justify-center mb-8 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                                        <Icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4 text-gray-900">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 mb-8 leading-relaxed">
                                        {service.description}
                                    </p>
                                    <button
                                        onClick={() => setSelectedService(index)}
                                        className="text-blue-600 font-semibold flex items-center gap-2 group-hover:text-indigo-600 relative"
                                    >
                                        <span className="relative">
                                            Explore Service
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300 group-hover:bg-indigo-600"></span>
                                        </span>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>



            {/* Testimonials Section */}
            <div ref={testimonialsRef} className="py-24 bg-white relative">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-2 inline-block">Client Success</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            Our clients trust us to deliver sophisticated solutions that combine technical excellence with refined aesthetics.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className={`bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 relative
                  ${isIntersecting.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                style={{ transitionDelay: `${index * 150}ms` }}
                            >
                                {/* Decorative quote mark */}
                                <div className="absolute text-9xl font-serif text-blue-100 -top-4 -left-2 pointer-events-none select-none">"</div>

                                <div className="relative">
                                    <div className="mb-8">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="inline-block w-5 h-5 text-amber-400" fill="#FBBf24" />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 mb-8 italic leading-relaxed relative z-10">"{testimonial.content}"</p>
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                            <p className="text-gray-500 text-sm">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div id="contact" className="py-24 bg-gradient-to-br from-gray-900 to-blue-900 text-white relative overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                    <div className="absolute -top-60 -left-60 w-96 h-96 rounded-full border border-white/30 animate-pulse"></div>
                    <div className="absolute top-40 right-20 w-80 h-80 rounded-full border border-white/20"></div>
                    <div className="absolute -bottom-40 right-40 w-96 h-96 rounded-full border border-white/10"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-blue-300 font-semibold text-sm tracking-wider uppercase mb-2 inline-block">Contact Us</span>
                            <h2 className="text-4xl font-bold mb-6 text-white leading-tight">Ready to Experience Premium Technical Service?</h2>
                            <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                                Contact our team of experts to discuss your project needs. We provide personalized solutions that combine technical excellence with sophisticated execution.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 rounded-full p-3">
                                        <Phone className="w-5 h-5 text-blue-300" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-medium text-white mb-1">Call Us</h4>
                                        <p className="text-blue-200">+1 (800) 555-0123</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 rounded-full p-3">
                                        <Mail className="w-5 h-5 text-blue-300" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-medium text-white mb-1">Email Us</h4>
                                        <p className="text-blue-200">contact@techservices.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 rounded-full p-3">
                                        <MapPin className="w-5 h-5 text-blue-300" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-medium text-white mb-1">Visit Us</h4>
                                        <p className="text-blue-200">1234 Tech Avenue, Suite 500<br />San Francisco, CA 94107</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm border border-white/20">
                            <h3 className="text-2xl font-semibold mb-6 text-white">Get a Custom Quote</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-blue-200 mb-2 text-sm" htmlFor="firstName">First Name</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-white/20 border border-blue-300/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-200/70 backdrop-blur-sm"
                                            placeholder="Your first name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-blue-200 mb-2 text-sm" htmlFor="lastName">Last Name</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-white/20 border border-blue-300/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-200/70 backdrop-blur-sm"
                                            placeholder="Your last name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-blue-200 mb-2 text-sm" htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-white/20 border border-blue-300/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-200/70 backdrop-blur-sm"
                                        placeholder="Your email address"
                                    />
                                </div>

                                <div>
                                    <label className="block text-blue-200 mb-2 text-sm" htmlFor="service">Select Service</label>
                                    <select
                                        id="service"
                                        name="service"
                                        value={formData.service}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/20 border border-blue-300/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white backdrop-blur-sm"
                                    >
                                        {services.map((service, index) => (
                                            <option key={index} value={service.title} className="bg-blue-900 text-white">
                                                {service.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-blue-200 mb-2 text-sm" htmlFor="message">Your Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full bg-white/20 border border-blue-300/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-200/70 backdrop-blur-sm resize-none"
                                        placeholder="Tell us about your project or requirements"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg py-4 font-medium transition-all duration-300 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Request
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white pt-20 pb-8">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="relative">
                                    <Hexagon className="w-10 h-10 text-blue-500 fill-blue-900" />
                                    <Cpu className="w-5 h-5 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                                    TechServices
                                </span>
                            </div>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                Delivering premium technical solutions with sophisticated execution and uncompromising quality since 2005.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 hover:bg-blue-800 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 hover:bg-blue-800 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 hover:bg-blue-800 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 hover:bg-blue-800 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
                            <ul className="space-y-4">
                                <li>
                                    <button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-blue-400 transition-colors">Home</button>
                                </li>
                                <li>
                                    <button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-blue-400 transition-colors">Services</button>
                                </li>
                                <li>

                                </li>
                                <li>
                                    <button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-blue-400 transition-colors">About Us</button>
                                </li>
                                <li>
                                    <button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-blue-400 transition-colors">Contact</button>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-white">Services</h4>
                            <ul className="space-y-4">
                                {services.slice(0, 5).map((service, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => setSelectedService(index)}
                                            className="text-gray-400 hover:text-blue-400 transition-colors"
                                        >
                                            {service.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-white">Contact</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-400">+1 (800) 555-0123</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-400">contact@techservices.com</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-400">1234 Tech Avenue, Suite 500<br />San Francisco, CA 94107</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-400">Mon-Fri: 8AM - 6PM<br />Sat: 10AM - 3PM</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 mt-12">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-500 text-sm mb-4 md:mb-0">
                                &copy; {new Date().getFullYear()} TechServices. All rights reserved.
                            </p>
                            <div className="flex items-center gap-6">
                                <a href="#" className="text-gray-500 hover:text-blue-400 text-sm">Privacy Policy</a>
                                <a href="#" className="text-gray-500 hover:text-blue-400 text-sm">Terms of Service</a>
                                <a href="#" className="text-gray-500 hover:text-blue-400 text-sm">Sitemap</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Back to top button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 z-30 ${showScrollTop ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                aria-label="Back to top"
            >
                <ArrowUp className="w-5 h-5" />
            </button>

            {/* Service Details Modal */}
            {ServiceModal()}
        </div>
    );
}