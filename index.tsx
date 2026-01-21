/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Chat } from '@google/genai';
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';

// --- CUSTOM HOOK FOR SCROLL ANIMATION ---
import { portfolioData, aiSystemInstruction } from './data';

// --- CUSTOM HOOK FOR SCROLL ANIMATION ---
function useOnScreen(ref, options = { threshold: 0.1 }) {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIntersecting(true);
                observer.unobserve(entry.target);
            }
        }, options);

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, options]);

    return isIntersecting;
}

// --- AI CHAT COMPONENT ---
function AIChat() {
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatHistoryRef = useRef(null);

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chatInstance = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: aiSystemInstruction,
            }
        });
        setChat(chatInstance);
        setMessages([{ role: 'model', text: `Hi! I'm Tanvir's AI assistant. Ask me anything about his professional background.` }]);
    }, []);

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [messages, isLoading]);


    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chat) return;

        const userMessage = { role: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setUserInput('');

        let modelResponse = '';
        try {
            const responseStream = await chat.sendMessageStream({ message: userInput });
            let firstChunk = true;
            for await (const chunk of responseStream) {
                if (firstChunk) {
                    setIsLoading(false); // Hide typing indicator
                    modelResponse += chunk.text;
                    setMessages(prev => [...prev, { role: 'model', text: modelResponse }]);
                    firstChunk = false;
                } else {
                    modelResponse += chunk.text;
                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1].text = modelResponse;
                        return newMessages;
                    });
                }
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false); // Ensure loader is always turned off
        }
    };

    return (
        <div className="ai-chat-container">
            <h3>Ask My AI Assistant</h3>
            <div className="chat-history" ref={chatHistoryRef} role="log">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.role}`}>
                        <p>{msg.text}</p>
                    </div>
                ))}
                {isLoading && (
                    <div className="chat-message model">
                        <p className="typing-indicator">
                            <span></span><span></span><span></span>
                        </p>
                    </div>
                )}
            </div>
            <form className="chat-input" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={isLoading ? "Thinking..." : "e.g., What are his top skills?"}
                    disabled={isLoading}
                    aria-label="Ask a question about Tanvir"
                />
                <button type="submit" disabled={isLoading} aria-label="Send message">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                </button>
            </form>
        </div>
    );
}


// --- UI COMPONENTS ---

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        return () => document.body.classList.remove('no-scroll');
    }, [isOpen]);

    const navLinks = [
        { text: 'Home', href: '#home' },
        { text: 'Biography', href: '#about' },
        { text: 'Projects', href: '#projects' },
        { text: 'Books', href: '#' },
        { text: 'Blog', href: '#' },
        { text: 'Tweet', href: '#' },
        { text: 'Social Work', href: '#' },
        { text: 'Tanvir in AI', href: '#contact' },
        { text: 'Contact', href: '#contact' },
        { text: 'News', href: '#' }
    ];

    return (
        <header className={scrolled ? 'scrolled' : ''}>
            <nav className="container">
                <a href="#" className="logo">TA</a>
                <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                    <ul>
                        {navLinks.map(link => (
                            <li key={link.text}><a href={link.href} onClick={() => setIsOpen(false)}>{link.text}</a></li>
                        ))}
                    </ul>
                </div>
                <button className={`hamburger ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" aria-expanded={isOpen}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>
        </header>
    );
}

function Hero() {
    return (
        <section id="home" className="hero">
            <div className="stars"></div>
            <div className="small-star star1"></div>
            <div className="small-star star2"></div>
            <div className="small-star star3"></div>
            <div className="small-star star4"></div>
            <div className="moon"></div>
            <div className="mountains"></div>
            <div className="hero-content container">
                <h1>{portfolioData.name}</h1>
                <p>{portfolioData.title}</p>
                <div className="cta-group">
                    <a href="#" className="cta-button" target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zM5 8V6h14v2H5z"></path></svg>
                        Schedule a Meeting
                    </a>
                    <a href={`mailto:${portfolioData.contact.email}`} className="cta-button-outline">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></svg>
                        Send an Email
                    </a>
                </div>
            </div>
        </section>
    );
}

function Section({ id, title, children }) {
    const sectionRef = useRef(null);
    const isVisible = useOnScreen(sectionRef);
    return (
        <section id={id} ref={sectionRef} className={`content-section ${isVisible ? 'is-visible' : ''}`}>
            <div className="container">
                <h2>{title}</h2>
                <div className="content-body">
                    {children}
                </div>
            </div>
        </section>
    );
}

function About() {
    return (
        <Section id="about" title="About Me">
            <div className="about-layout">
                <img src={portfolioData.profileImage} alt="A portrait of Tanvir Ahsan" className="profile-image" />
                <p>{portfolioData.summary}</p>
            </div>
        </Section>
    );
}

function Experience() {
    return (
        <Section id="experience" title="Experience">
            <div className="timeline">
                {portfolioData.experience.map((job, index) => (
                    <div key={index} className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                            <h3>{job.role}</h3>
                            <span className="company">{job.company}</span>
                            <span className="period">{job.period}</span>
                            <p>{job.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
}

function Projects() {
    return (
        <Section id="projects" title="Project Contributions">
            <div className="projects-grid">
                {portfolioData.projects.map((project, index) => (
                    <div key={index} className="project-card">
                        <h3>{project.name}</h3>
                        <p>{project.description}</p>
                        <p className="project-result">{project.result}</p>
                        <div className="project-skills">
                            {project.skills.map((skill, skillIndex) => (
                                <span key={skillIndex} className="skill-tag">{skill}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
}

function Skills() {
    return (
        <Section id="skills" title="Top Skills">
            <div className="skills-grid">
                {portfolioData.skills.map((skill, index) => (
                    <div key={index} className="skill-card">{skill}</div>
                ))}
            </div>
        </Section>
    );
}

function Education() {
    return (
        <Section id="education" title="Education">
            <div className="education-list">
                {portfolioData.education.map((edu, index) => (
                    <div key={index} className="education-item">
                        <h3>{edu.institution}</h3>
                        <p>{edu.degree}{edu.period && ` | ${edu.period}`}</p>
                    </div>
                ))}
            </div>
        </Section>
    );
}

function Contact() {
    return (
        <Section id="contact" title="Contact">
            <div className="contact-container">
                <div className="contact-info">
                    <h3>Let's Connect</h3>
                    <p>I'm open to discussing new projects and opportunities. Feel free to send me an email or connect on LinkedIn.</p>
                    <a href={`mailto:${portfolioData.contact.email}`} className="contact-link">{portfolioData.contact.email}</a>
                    <a href={portfolioData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">LinkedIn Profile</a>
                </div>
                <AIChat />
            </div>
        </Section>
    );
}

function Footer() {
    return (
        <footer>
            <div className="container">
                <p>&copy; {new Date().getFullYear()} Tanvir Ahsan. All Rights Reserved.</p>
            </div>
        </footer>
    );
}

// --- MAIN APP ---
function App() {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <About />
                <Experience />
                <Projects />
                <Skills />
                <Education />
                <Contact />
            </main>
            <Footer />
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
