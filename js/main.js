document.addEventListener('DOMContentLoaded', function () {

    // --- HEADER & MOBILE NAVIGATION ---
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Scrolled header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navLinks.classList.remove('open');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // --- SCROLL ANIMATIONS ---
    const sections = document.querySelectorAll('.content-section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
    
    // --- AI CHAT ---
    const chatContainer = document.querySelector('.ai-chat-container');
    if(chatContainer) {
        const chatForm = chatContainer.querySelector('.chat-input');
        const chatInput = chatContainer.querySelector('input[type="text"]');
        const chatHistory = chatContainer.querySelector('.chat-history');
        const submitButton = chatContainer.querySelector('button[type="submit"]');

        let messages = [{ role: 'model', text: `Hi! I'm Tanvir's AI assistant. Ask me anything about his professional background.` }];
        
        const renderMessages = () => {
             chatHistory.innerHTML = '';
             messages.forEach(msg => {
                const messageEl = document.createElement('div');
                messageEl.classList.add('chat-message', msg.role);
                const p = document.createElement('p');
                p.textContent = msg.text;
                messageEl.appendChild(p);
                chatHistory.appendChild(messageEl);
             });
             chatHistory.scrollTop = chatHistory.scrollHeight;
        }
        
        const showTypingIndicator = () => {
             const typingEl = document.createElement('div');
             typingEl.classList.add('chat-message', 'model');
             typingEl.innerHTML = `<p class="typing-indicator"><span></span><span></span><span></span></p>`;
             chatHistory.appendChild(typingEl);
             chatHistory.scrollTop = chatHistory.scrollHeight;
        }

        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userInput = chatInput.value.trim();
            if(!userInput) return;
            
            // Add user message to state and render
            messages.push({ role: 'user', text: userInput });
            renderMessages();
            showTypingIndicator();

            chatInput.value = '';
            chatInput.disabled = true;
            submitButton.disabled = true;

            try {
                // Pass history to the backend
                const historyForApi = messages.slice(0, -1).map(msg => ({role: msg.role, text: msg.text}));

                const response = await fetch(wpApiSettings.root + 'tanvir-ahsan-portfolio/v1/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-WP-Nonce': wpApiSettings.nonce
                    },
                    body: JSON.stringify({ message: userInput, history: historyForApi })
                });

                if(!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                
                const data = await response.json();
                
                messages.push({ role: 'model', text: data.text });
                renderMessages();

            } catch (error) {
                 messages.push({ role: 'model', text: 'Sorry, I encountered an error. Please try again.' });
                 renderMessages();
                 console.error('Error:', error);
            } finally {
                chatInput.disabled = false;
                submitButton.disabled = false;
                chatInput.focus();
            }
        });
        
        renderMessages(); // Initial render
    }
});
