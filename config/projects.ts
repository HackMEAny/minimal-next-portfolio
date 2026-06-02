import { ValidCategory, ValidExpType, ValidSkills } from "./constants";

interface PagesInfoInterface {
  title: string;
  imgArr: string[];
  description?: string;
}

interface DescriptionDetailsInterface {
  paragraphs: string[];
  bullets: string[];
}

export interface ProjectInterface {
  id: string;
  type: ValidExpType;
  companyName: string;
  category: ValidCategory[];
  shortDescription: string;
  websiteLink?: string;
  githubLink?: string;
  techStack: ValidSkills[];
  startDate: Date;
  endDate: Date;
  companyLogoImg: any;
  descriptionDetails: DescriptionDetailsInterface;
  pagesInfoArr: PagesInfoInterface[];
}

export const Projects: ProjectInterface[] = [
  {
    id: "hotel",
    companyName: "Hotel Sweet Home",
    type: "Professional",
    category: ["Web Dev", "Full Stack", "UI/UX"],
    shortDescription:
      "Website for Hotel Sweet Home International in Darjeeling, optimized for SEO/AEO and performance.",
    websiteLink: "https://hotelsweethomeinternational.com",
    // githubLink: "https://github.com/namanbarkiya/minimal-next-portfolio",
    techStack: [
      "Next.js",
      "React",
      "Typescript",
      "Tailwind CSS",
      "Framer Motion",
      "Vercel",
      "AWS",
      "Cloudflare",
      "Docker",
    ],
    startDate: new Date("2025-02-01"),
    endDate: new Date("2025-12-01"),
    companyLogoImg: "/projects/hotel/image.png",
    pagesInfoArr: [
      {
        title: "Landing & Sections",
        description:
          "A modern, high-performance travel website built with Next.js and Tailwind CSS for a fast, responsive, and SEO-optimized booking experience.",
        imgArr: ["/projects/hotel/rooms.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "The website for Hotel Sweet Home International (Darjeeling) is built with a modern, high-performance tech stack focused on speed and SEO. Based on its structure and characteristics, here is a description of its technology.",
      ],
      bullets: [
        "The site is built using Next.js, a popular React-based framework. This is evident from the page routing structure and the fast, seamless transitions between sections. Next.js allows the site to use Server-Side Rendering (SSR) or Static Site Generation (SSG), which ensures that the hotel’s room details and images load quickly for users.",
        "The website utilizes Tailwind CSS for its styling. This utility-first framework allows for the clean, mobile-responsive layout seen on the site, ensuring it looks professional on both desktops and smartphones.",
        "The site uses modern image formats (like WebP) and responsive image loading to showcase high-quality photos of the Darjeeling property without sacrificing site speed.",
      ],
    },
  },
  {
    id: "dipsagency",
    companyName: "Dips Agency",
    type: "Professional",
    category: ["Full Stack", "Frontend", "Web Dev"],
    websiteLink: "https://dips.agency",
    shortDescription:
      "A minimalist, high-speed logistics landing page built with Next.js and Tailwind CSS, optimized for a mobile-first professional user experience.",
    techStack: ["Next.js", "React", "Node.js", "Typescript", "Firebase"],
    startDate: new Date("2024-04-01"),
    endDate: new Date("2024-10-01"),
    companyLogoImg: "/projects/dipsagency/logo.png",
    pagesInfoArr: [
      {
        title: "Ingestion & Retrieval",
        description:
          "The website for Dips Agency (a shipping and logistics service based in Haldia) uses a streamlined, modern tech stack designed for a clean, single-page professional presence.",
        imgArr: ["/projects/dipsagency/image.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "The website for Dips Agency (a shipping and logistics service based in Haldia) uses a streamlined, modern tech stack designed for a clean, single-page professional presence.",
      ],
      bullets: [
        "Frontend Framework: Next.js (React-based). The site is built as a fast-loading, single-page application (SPA) that utilizes server-side rendering for improved performance.",
        "Styling: Tailwind CSS. The layout uses utility-first CSS, evidenced by the responsive design, modern spacing, and clean typography typical of Tailwind-based projects.",
        "Icons & Graphics: Lucide React or similar SVG-based icon libraries for clean, lightweight visual elements.",
        "Deployment & Hosting: Likely hosted on Vercel, which is the standard platform for Next.js applications, providing high speed and global availability.",
        "Development: The site is a custom build rather than a generic template, focusing on a minimal 'vibe' that highlights speed and reliability.",
      ],
    },
  },
  {
    id: "screen-protection",
    companyName: "Screen Protection — HDMI Splitter Detection",
    type: "Professional",
    category: ["Full Stack", "Web Dev", "UI/UX"],
    shortDescription:
      "An advanced hardware-integrity API that uses EDID fingerprinting, HDCP handshakes, and Widevine probing to detect HDMI unauthorized devices and generate a weighted security risk score.",
    websiteLink: "https://niya.nbarkiya.xyz",
    githubLink: "https://github.com/HackMEAny/Screen-Cast-Detect",
    techStack: ["Spring Boot", "Java", "HTML 5"],
    startDate: new Date("2026-02-26"),
    endDate: new Date("2026-03-02"),
    companyLogoImg: "/projects/screen-protection/logo.png",
    pagesInfoArr: [
      {
        title: "Technology Stack",
        description:
          "Spring Boot 3.x (Java), JNI (Java Native Interface) to call low-level Windows/Linux display APIs, OPM (Output Protection Manager) & DXGI (DirectX Graphics Infrastructure), RESTful Endpoints with WebSocket support for real-time probing",
        imgArr: [],
      },
      {
        title: "Architecture",
        description: "",
        imgArr: ["/projects/screen-protection/image.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "This Spring Boot REST API serves as a high-security Display Integrity & Content Protection Service. It is designed to prevent content piracy and unauthorized screen recording by identifying hardware-level bypasses like HDMI 'strippers' or unauthorized capture cards.",
        "Core Mechanism: Multi-Layer Signal Analysis",
        "The system moves beyond simple software checks by analyzing the physical and cryptographic properties of the display chain:",
      ],
      bullets: [
        "EDID Fingerprinting: Extracts the Extended Display Identification Data to verify the display's 'birth certificate.' It checks for manufacturer inconsistencies or generic IDs common in 'ghost' display emulators and splitters.",
        "OPM & HDCP Handshake: Executes a full Output Protection Manager (OPM) cryptographic challenge. By forcing a hardware-level HDCP (High-bandwidth Digital Content Protection) handshake, the API can detect if the encryption is being terminated early or 'stripped' by a middleman device.",
        "Display Topology Analysis: Maps the connection tree. It detects if a single signal is being mirrored or split across multiple downstream sinks (topology 'branching'), which is a hallmark of unauthorized redistribution.",
        "Widevine DRM Probing: Uses browser-level hooks to check for Widevine L1/L3 security levels. If a hardware device degrades the DRM path to a lower security level, it signals a compromised environment.",
      ],
    },
  },
  {
    id: "birthday-card",
    companyName: "Birthday Card",
    type: "Personal",
    category: ["Web Dev", "Frontend"],
    shortDescription:
      "This website appears to be a personalized birthday celebration page created as a digital greeting.",
    websiteLink: "https://birthdaydeyasini.anik3t.dev/",
    githubLink: "https://github.com/HackMEAny/birthday-card",
    techStack: ["React", "Next.js"],
    startDate: new Date("2022-03-01"),
    endDate: new Date("2022-07-01"),
    companyLogoImg: "/projects/birthday-card/logo.png",
    pagesInfoArr: [
      {
        title: "Webpage View",
        description: "Mobile & Desktop view",
        imgArr: [
          "/projects/birthday-card/logo.png",
          "/projects/birthday-card/image.png",
        ],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "Typically, such sites are built as lightweight, single-page interactive experiences (often featuring photos, animations, a timer, or a custom message) designed to deliver a personalized sentiment for a specific individual.",
      ],
      bullets: [
        "Tech Stack: A lightweight Next.js application, likely hosted on Firebase.",
        "Purpose: A bespoke, sentimental web project that demonstrates simple frontend development skills (CSS animations, responsive design, and image embedding) tailored for a personal occasion.",
        "Upload PDF & ready to go",
      ],
    },
  },
  {
    id: "smart_lms",
    companyName: "Smart LMS",
    type: "Personal",
    category: ["Backend", "UI/UX"],
    shortDescription:
      "Streamlining library operations through a clean, Swing-powered desktop app for librarians and members",
    techStack: ["Java", "Git"],
    startDate: new Date("2021-02-01"),
    endDate: new Date("2021-03-01"),
    companyLogoImg: "/projects/smart_lms/image.png",
    pagesInfoArr: [
      {
        title: "🖥️ Java Swing Desktop Architecture",
        description:
          "Built with Java SE (JDK 15+) and Swing UI, featuring modular MVC-like separation: role-based GUIs (Librarian/Member), custom components (GradientPanel), and event-driven workflows for borrowing, returns, and user management.",
        imgArr: [],
      },
      {
        title: "💾 Hybrid File-Based Persistence",
        description:
          "Uses JSON (dtb-member.json, dtb-array.json) for structured data storage and CSV fallback for compatibility, with shutdown hooks for safe writes—no external database required, making it lightweight and portable.",
        imgArr: [],
      },
      {
        title: "🛠️ Developer-Ready Tooling",
        description:
          "Developed in NetBeans 12+ with Ant build (build.xml), packaged as an executable JAR (dist/LMS.jar), includes basic unit tests (test/LMS_Test), and follows Git-friendly contribution workflows (fork → branch → PR).",
        imgArr: [],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "A desktop-based Library Management System designed to streamline book issuance, returns, and user management for educational institutions. Built with Java (JDK 15+) and developed in NetBeans, Smart_LMS features role-based interfaces for librarians and members, enabling efficient tracking of books, user profiles, borrowing history, and payment records.",
        "Key Features:",
      ],
      bullets: [
        "🔐 Secure user registration & authentication",
        "👥 Dual GUI: Librarian dashboard (add/manage books, view member details) + Member portal (browse, borrow, track payments)",
        "💾 Local JSON/CSV-based data persistence",
        "🎨 Clean Swing-based UI with loading screens, forms, and data tables",
        "🛠️ Modular architecture with test coverage",
      ],
    },
  },
  {
    id: "metadata-delete",
    companyName: "🔒 Metadata Delete",
    type: "Personal",
    category: ["Backend"],
    shortDescription:
      "A lightweight Python script that strips EXIF and embedded metadata from image files to protect user privacy before sharing online.",
    githubLink: "https://github.com/HackMEAny/Metadata-Delete",
    techStack: ["Python", "Linux"],
    startDate: new Date("2021-07-01"),
    endDate: new Date("2022-07-01"),
    companyLogoImg: "/projects/metadata-delete/image.png",
    pagesInfoArr: [
      {
        title: "Tech Stack",
        description: "Python 3.x, Pillow (PIL), MIT License",
        imgArr: [],
      },
      {
        title: "Before Deleting ( Raw Metadata )",
        description: "Contain several sensitive data like location, phone, etc",
        imgArr: ["/projects/metadata-delete/Before_Deleting.png"],
      },
      {
        title: "After Deleting",
        description: "No personal information exposed",
        imgArr: ["/projects/metadata-delete/After.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "Metadata-Delete is a focused privacy utility designed to remove sensitive metadata (EXIF, GPS coordinates, device info, timestamps) from image files before they are shared publicly. Built with Python 3 and common imaging libraries, this tool helps users mitigate unintentional data leakage — a critical concern for journalists, activists, photographers, and privacy-conscious individuals.",
        "Why It Matters:",
        "When you share a photo online, hidden metadata can reveal your location, device model, software used, and even editing history GitHub. This script provides a simple, offline-first solution to sanitize images without altering visual quality",
        "Key Features:",
      ],
      bullets: [
        "🧹 Removes EXIF, IPTC, and XMP metadata blocks from JPEG/PNG images.",
        "📍 Strips geolocation data to prevent location tracking.",
        "🔒 Offline execution — no cloud upload, ensuring file confidentiality.",
        "🖼️ Preserves image dimensions and visual fidelity during cleanup.",
        "🧪 Includes before/after validation screenshots for transparency.",
        "⚙️ Simple CLI workflow: `python3 MetaData_Remover.py`",
      ],
    },
  },
  {
    id: "googlemeet-automate",
    companyName: "Smart Meeting Attendance",
    type: "Personal",
    category: ["Mobile Dev", "Full Stack", "UI/UX"],
    shortDescription:
      "A Python script that automates Google Meet session joining using Selenium, designed to streamline attendance for online classes and scheduled meetings.",
    githubLink: "https://github.com/HackMEAny/GoogleMeet_Automate",
    techStack: ["Python"],
    startDate: new Date("2020-12-01"),
    endDate: new Date("2021-08-31"),
    companyLogoImg: "/projects/googlemeet-automate/logo.png",
    pagesInfoArr: [
      {
        title: "Tech Stack",
        description:
          "Python 3.x, Selenium WebDriver, ChromeDriver, Batch scripting, MIT License",
        imgArr: ["/projects/googlemeet-automate/demo.gif"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        `GoogleMeet_Automate is a lightweight automation utility built with Python and Selenium WebDriver to programmatically join Google Meet sessions. Originally designed to help students never miss scheduled online classes GitHub, this tool demonstrates practical application of web automation, credential handling, and browser interaction workflows.`,
        "How It Works:",
        "The script leverages Selenium to control a Chrome browser instance, navigate to Google Meet, authenticate via Gmail (user-configured), and join meetings at predefined times — reducing manual effort and human error in attendance tracking.",
        "Key Features:",
      ],
      bullets: [
        "🕒 Schedule-based auto-join: Configure meeting links, times, and credentials in GoogleMeet.py",
        "🌐 Selenium-driven browser automation for reliable Google Meet interaction",
        "🔐 Local config file for secure, user-controlled credential management",
      ],
    },
  },
  {
    id: "qwinos",
    companyName: "Q OS",
    type: "Personal",
    category: ["Backend"],
    shortDescription:
      "A collection of modular Bash scripts for automating Artix Linux installation — supporting bare-metal, chroot, and complete deployment workflows.",
    githubLink: "https://github.com/QWinOS/Q-OS",
    techStack: ["Shell ( Bash / Zsh )", "DevOps"],
    startDate: new Date("2021-07-14"),
    endDate: new Date("2022-07-01"),
    companyLogoImg: "/projects/qwinos/image.png",
    pagesInfoArr: [
      {
        title: "Tech Stack:",
        description:
          "Bash/Shell scripting, Artix/Arch Linux package management (pacman), chroot environments, MIT License",
        imgArr: [],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "Q-OS is a lightweight, open-source automation toolkit built entirely in Shell script to streamline the installation and configuration of Arch/Artix Linux — a lightweight, init-flexible Arch-based distribution. Designed for developers and system enthusiasts who value reproducibility and minimalism, this project provides ready-to-use scripts for multiple installation scenarios.",
        "How It Works:",
        "The repository includes purpose-built scripts for different deployment needs:",
        "-> Bare_Install.sh → Minimal base system setup with optimized pacman mirror lists",
        "-> Chroot_Install.sh / Chroot_Artix.sh → Chroot environment configuration for advanced customization",
        "-> Complete_Install.sh → Full-featured installation with parallel downloads, xdg-user-dirs, and desktop-ready defaults",
        "-> Bare_Install_Artix.sh → Specialized workflow for Artix-specific init systems (OpenRC, dinit, runit)",
        "Key Features:",
      ],
      bullets: [
        "🔄 Modular design: Mix-and-match scripts based on deployment requirements",
        "⚡ Performance-optimized: Parallel download configuration in pacman.conf for faster package retrieval",
        "🧭 Init-agnostic: Compatible with Artix's multiple init systems (OpenRC, dinit, runit, s6) ",
        "🔧 Idempotent-friendly: Scripts designed for repeatable, scriptable system provisioning",
        "📦 Zero dependencies: Pure Bash — runs in any Artix/Arch live environment without external tooling",
        "📜 Transparent: All operations visible in-terminal; no hidden binaries or opaque installers",
      ],
    },
  },
];

export const featuredProjects = Projects.slice(0, 3);
