import { PortfolioData } from './types';

export const portfolioData: PortfolioData = {
  personalInfo: {
    name: "DHANISH S",
    roles: ["Full Stack Developer", "MERN Stack Developer", "Frontend Developer"],
    introduction: "Full Stack Developer with hands-on experience building responsive web applications using React.js, Node.js, Express.js, and modern databases.",
    aboutText: "MCA graduate with hands-on experience in developing full-stack web applications using React.js, Node.js, Express.js, JavaScript, PHP, and MySQL/MongoDB. Experienced in building responsive user interfaces, RESTful APIs, authentication systems, and database-driven applications through academic projects and training. Strong understanding of software development principles, Git workflows, debugging, and problem-solving. Passionate about building scalable web applications and eager to contribute as a Full Stack Developer.",
    location: "Pathanathitta, Kerala",
    email: "sdhanish92@gmail.com",
    phone: "+91 7909122902",
    linkedin: "https://linkedin.com/in/dhanishs",
    github: "https://github.com/Sdhanish",
    instagram: "https://instagram.com/sdhanish_",
    avatar: "/src/assets/images/dhanish-side.jpeg",
    heroImageLight: "/src/assets/images/dhanish-light-theme.png",
    heroImageDark: "/src/assets/images/dhanish-light-theme.png",
    logo: "/src/assets/images/dhanish-logo-light.png",
    logoLight: "/src/assets/images/dhanish-logo-light.png",
    logoDark: "/src/assets/images/logo-dark.png"
  },
  timeline: [
    {
      id: 'exp-1',
      title: 'Computer Science Faculty',
      type: 'Experience',
      organization: 'Mentor Engineering College',
      location: 'Muvattupuzha, Kerala',
      period: 'Oct 2025 – April 2026',
      highlights: [
        'Taught MERN Stack, Python, DBMS and Web Development.',
        'Guided students in software development projects.',
        'Conducted practical sessions on programming and modern web technologies.'
      ]
    },
    {
      id: 'edu-1',
      title: 'Master of Computer Applications (MCA)',
      type: 'Education',
      organization: 'APJ Abdul Kalam Technological University',
      location: 'Kerala, India',
      period: 'Sept 2023 – May 2025',
      cgpa: '9.09',
      highlights: [
        'Graduated with CGPA: 9.09 / 10',
        'Specialized in advanced software development, DBMS, RESTful APIs, and full-stack web architecture.'
      ]
    },
    {
      id: 'trn-1',
      title: 'MERN Stack Training',
      type: 'Training',
      organization: 'Techmindz',
      location: 'Infopark Kochi, Kerala',
      period: 'Nov 2022 – Jan 2023',
      certificateUrl: 'https://acesse.one/1knhhwa',
      highlights: [
        'Completed intensive MERN Stack training covering React.js, Node.js, Express.js, and MongoDB.',
        'Built full-stack applications, developed REST APIs, and practiced Git-based development workflows.'
      ]
    },
    {
      id: 'edu-2',
      title: 'Bachelor of Computer Applications (BCA)',
      type: 'Education',
      organization: 'Mahatma Gandhi University',
      location: 'Kerala, India',
      period: 'Jun 2019 – Mar 2022',
      cgpa: '7.17',
      highlights: [
        'Acquired foundational computer science concepts, web technologies, and database systems with CGPA: 7.17.'
      ]
    }
  ],
  education: [
    {
      degree: "Master of Computer Applications (MCA)",
      cgpa: "9.09",
      institution: "APJ Abdul Kalam Technological University",
      period: "Sept 2023 – May 2025",
      description: "Completed MCA with CGPA 9.09/10. Specialized in full-stack web development, database systems, and software engineering."
    },
    {
      degree: "MERN Stack Training",
      institution: "Techmindz, Infopark Kochi",
      period: "Nov 2022 – Jan 2023",
      description: "Intensive training covering React.js, Node.js, Express.js, MongoDB, REST APIs, and Git workflows."
    },
    {
      degree: "Bachelor of Computer Applications (BCA)",
      cgpa: "7.17",
      institution: "Mahatma Gandhi University",
      period: "Jun 2019 – Mar 2022",
      description: "Acquired core computer science concepts, object-oriented design, web development, and database management."
    }
  ],
  skills: [
    // Programming Languages
    { name: "Java", category: "Languages" },
    { name: "JavaScript", category: "Languages" },
    { name: "Python", category: "Languages" },
    { name: "PHP", category: "Languages" },
    // Frontend Technologies
    { name: "React.js", category: "Frontend" },
    { name: "Next.js", category: "Frontend" },
    { name: "HTML5", category: "Frontend" },
    { name: "CSS3", category: "Frontend" },
    { name: "Tailwind CSS", category: "Frontend" },
    // Backend Technologies
    { name: "Node.js", category: "Backend" },
    { name: "Express.js", category: "Backend" },
    { name: "REST APIs", category: "Backend" },
    // Databases
    { name: "MySQL", category: "Database" },
    { name: "MongoDB", category: "Database" },
    { name: "Firebase", category: "Database" },
    { name: "PostgreSQL", category: "Database" },
    // Tools & Platforms
    { name: "Git", category: "Tools" },
    { name: "GitHub", category: "Tools" },
    { name: "Postman", category: "Tools" },
    { name: "VS Code", category: "Tools" }
  ],
  services: [
    {
      title: "Full Stack MERN Development",
      description: "Developing robust end-to-end web applications with React.js frontend, Node/Express backend REST APIs, and MongoDB/MySQL databases.",
      iconName: "Database",
      tags: ["React.js", "Node.js", "Express.js", "MongoDB", "MySQL"]
    },
    {
      title: "Frontend Development",
      description: "Designing responsive, user-friendly, and pixel-perfect web interfaces using React.js, Next.js, and Tailwind CSS.",
      iconName: "Layout",
      tags: ["React.js", "Next.js", "Tailwind CSS", "JavaScript"]
    },
    {
      title: "REST API Development",
      description: "Building secure, standard-compliant RESTful APIs with authentication systems, optimized database queries, and clear documentation.",
      iconName: "Cpu",
      tags: ["Express.js", "REST APIs", "Node.js", "Postman"]
    },
    {
      title: "Responsive Web Development",
      description: "Crafting fluid, touch-optimized user interfaces that perform seamlessly across desktop monitors, tablets, and mobile devices.",
      iconName: "Smartphone",
      tags: ["Responsive Design", "Tailwind CSS", "Cross-Browser"]
    }
  ],
  projects: [
    {
      title: "Smartfin AI - Personal Expense Tracker",
      category: "Next.js Full Stack",
      description: "Built a full-stack AI-powered expense tracking application using Next.js and Supabase. Implemented authentication, budgeting, expense analytics, and financial dashboards. Integrated Gemini AI for intelligent financial insights. Developed secure REST APIs and optimized database queries for improved performance.",
      stack: ["Next.js", "Supabase", "Clerk", "Arcjet", "Inngest", "Gemini AI"],
      github: "https://github.com/Sdhanish/SmartFin-AI",
      live: "https://smart-fin-ai.vercel.app/",
      image: "https://picsum.photos/seed/smartfin-ai-portfolio/800/600"
    },
    {
      title: "Yoga Connect - Wellness Courses",
      category: "Full Stack MERN",
      description: "Developed a full-stack web application using React.js, Node.js, Express.js, and MongoDB. Implemented secure role-based authentication for students, instructors, and administrators. Designed REST APIs for course management, enrollment, and user operations. Built responsive UI with reusable React components and optimized application performance.",
      stack: ["React.js", "Node.js", "Express.js", "MongoDB", "Firebase", "Tailwind CSS"],
      github: "https://github.com/Sdhanish/Yoga-Connect",
      live: "https://yoga-frontend-three.vercel.app/",
      image: "https://picsum.photos/seed/yoga-connect-portfolio/800/600"
    }
  ]
};
