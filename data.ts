export const portfolioData = {
    name: "Tanvir Ahsan",
    profileImage: "https://media.licdn.com/dms/image/v2/D5603AQGs3oYidDwGbw/profile-displayphoto-scale_200_200/B56ZhYsfBnH0AY-/0/1753834714955?e=2147483647&v=beta&t=fiHTn5BaRDx1gEUmXzZq2eec5rzzYpUgmvLVgTsa614",
    title: "Enterprise SEO Strategist | Generative AI for Organic Growth | Automation Architect | 5+ Years",
    location: "Dhaka, Bangladesh",
    contact: {
        email: "tanvirreason@gmail.com",
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
    ],
    projects: [
        {
            name: "AI-Powered SEO Transformation for Zager Guitar",
            description: "Led a comprehensive SEO initiative for Zager Guitar during my tenure at MonsterClaw LLC, with the primary goal of significantly boosting organic search traffic and online visibility. I designed and implemented intelligent AI systems, leveraging powerful Large Language Models (LLMs) for advanced content optimization and custom Model Context Protocol (MCP) integrations to automate complex SEO workflows. This involved: Intelligent Keyword Strategy, Automated On-Page & Technical SEO, and Real-time Performance Optimization.",
            result: "Achieved a remarkable 25,000 monthly organic traffic increase for Zager Guitar within one year, demonstrating the power of AI-driven SEO transformation and delivering substantial organic growth.",
            skills: ["SEO", "Artificial Intelligence (AI)", "Generative AI", "Large Language Models (LLMs)", "Model Context Protocol (MCP)", "Python", "Selenium", "Content Strategy", "Technical SEO", "Keyword Research", "Data Analysis", "Marketing Automation", "Digital Marketing"]
        },
        {
            name: "AI-Driven Organic Growth for Treta Noodle",
            description: "Orchestrated an advanced SEO strategy for Treta Noodle while at MonsterClaw LLC, focusing on leveraging cutting-edge AI to enhance brand visibility and capture significant organic market share. My approach involved deploying intelligent AI systems, including Generative AI for scalable content production and Model Context Protocol (MCP) for seamless data integration and automated optimization. Key initiatives included: AI-Powered Content Scaling, Automated Competitive Intelligence, and Technical SEO Automation.",
            result: "Drove a significant organic traffic increase for Treta Noodle, showcasing the efficiency and impact of AI-powered SEO solutions.",
            skills: ["SEO", "Artificial Intelligence (AI)", "Generative AI", "Large Language Models (LLMs)", "Model Context Protocol (MCP)", "Python", "Automation", "Content Marketing", "Competitive Analysis", "Technical SEO", "Digital Strategy", "Data-Driven Marketing"]
        }
    ]
};

export const aiSystemInstruction = `You are a professional AI assistant for Tanvir Ahsan's portfolio website. Answer questions based ONLY on the following information:
    Name: ${portfolioData.name}
    Title: ${portfolioData.title}
    Location: ${portfolioData.location}
    Summary: ${portfolioData.summary}
    Skills: ${portfolioData.skills.join(', ')}
    Experience: ${portfolioData.experience.map(e => `${e.role} at ${e.company} (${e.period}): ${e.description}`).join('; ')}
    Education: ${portfolioData.education.map(e => `${e.degree} from ${e.institution} (${e.period})`).join('; ')}
    Projects: ${portfolioData.projects.map(p => `${p.name}: ${p.result}`).join('; ')}
Be friendly and concise. If a question is outside this scope, politely decline to answer.`;
