/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Chat } from '@google/genai';
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';

// --- DATA FROM CV ---
const portfolioData = {
  name: "Tanvir Ahsan",
  profileImage: "https://i.ibb.co/tDy501d/profile.jpg",
  title: "Enterprise SEO Strategist | AI & Generative AI for Organic Growth | Automation Architect | 5+ Years",
  location: "Dhaka, Bangladesh",
  contact: {
    email: "guitarinch@gmail.com",
    linkedin: "https://www.linkedin.com/in/tanvir-ahsan-reason",
  },
  summary: "I specialize in transforming enterprise SEO by building intelligent AI systems. Leveraging powerful Large Language Models (LLMs) and the innovative Model Context Protocol (MCP), I drive scalable organic growth and achieve breakthrough efficiency for businesses. My passion lies in harnessing advanced technology to optimize search strategies and deliver measurable results.",
  skills: ["Search Engine Technology", "Shopify", "Gutenberg"],
  experience: [
    {
      company: "MonsterClaw LLC",
      role: "Search Engine Optimization SR Executive",
      period: "September 2023 - July 2025",
      description: "MonsterClaw is a leading digital marketing agency that specializes in affiliate marketing, SEO, content marketing, and IT services."
    },
    {
      company: "SERP Cat",
      role: "Technical SEO Specialist",
      period: "April 2023 - February 2024",
      description: "SaaS SEO Agency Responsible For Massive Dents On The SERP."
    },
    {
      company: "REEA Digital Limited",
      role: "Search Engine Optimization Specialist",
      period: "August 2022 - August 2023",
      description: "A leading software development company that specializes in custom software solutions, AI-powered solutions, and user experience research."
    },
     {
      company: "Rotery Club of Dhaka",
      role: "General Member",
      period: "2019 - 2021",
      description: ""
    },
    {
      company: "RAPTURE ENTERTAINMENT LIMITED",
      role: "Intern",
      period: "January 2019 - June 2019",
      description: "Learned fundamentals and domain of Digital Marketing and components of the Internet."
    }
  ],
  education: [
    {
      institution: "East West University",
      degree: "Bachelor's Degree",
      period: "2014 - 2019"
    },
    {
      institution: "Willes Little Flower School & College",
      degree: "Science",
      period: "2000 - 2012"
    },
    {
      institution: "Dhaka Imperial College",
      degree: "Science",
      period: ""
    }
  ]
};

// --- AI CHAT COMPONENT ---
function AIChat() {
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatHistoryRef = useRef(null);

    const cvDataString = `
        Name: ${portfolioData.name}
        Title: ${portfolioData.title}
        Location: ${portfolioData.location}
        Summary: ${portfolioData.summary}
        Skills: ${portfolioData.skills.join(', ')}
        Experience: ${portfolioData.experience.map(e => `${e.role} at ${e.company} (${e.period}): ${e.description}`).join('; ')}
        Education: ${portfolioData.education.map(e => `${e.degree} from ${e.institution} (${e.period})`).join('; ')}
    `;

    useEffect(() => {
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const chatInstance = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are a professional AI assistant for Tanvir Ahsan's portfolio website. Answer questions based ONLY on the following information: ${cvDataString}. Be friendly and concise. If a question is outside this scope, politely decline to answer.`,
            }
        });
        setChat(chatInstance);
        setMessages([{ role: 'model', text: `Hi! I'm Tanvir's AI assistant. Ask me anything about his professional background.` }]);
    }, []);
    
    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [messages]);


    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chat) return;

        const userMessage = { role: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setUserInput('');
        
        let modelResponse = '';
        const tempModelMessageIndex = messages.length + 1;
        setMessages(prev => [...prev, { role: 'model', text: '...' }]);

        try {
            const responseStream = await chat.sendMessageStream({ message: userInput });
            for await (const chunk of responseStream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[tempModelMessageIndex] = { role: 'model', text: modelResponse };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[tempModelMessageIndex] = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="ai-chat-container">
            <h3>Ask My AI Assistant</h3>
            <div className="chat-history" ref={chatHistoryRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.role}`}>
                        <p>{msg.text}</p>
                    </div>
                ))}
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

    const navLinks = [
        { text: 'Home', href: '#home' },
        { text: 'Biography', href: '#about' },
        { text: 'Books', href: '#' },
        { text: 'Blog', href: '#' },
        { text: 'Tweet', href: '#' },
        { text: 'Social Work', href: '#' },
        { text: 'Tanvir in AI', href: '#contact' },
        { text: 'Video', href: '#' },
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
                <button className="hamburger" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" aria-expanded={isOpen}>
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
            <div className="moon"></div>
            <div className="mountains"></div>
            <div className="hero-content container">
                <h1>{portfolioData.name}</h1>
                <p>{portfolioData.title}</p>
                <a href="#contact" className="cta-button">Get In Touch</a>
            </div>
        </section>
    );
}

function Section({ id, title, children }) {
    return (
        <section id={id} className="content-section">
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