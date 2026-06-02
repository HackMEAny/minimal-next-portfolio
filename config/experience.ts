import { ValidSkills } from "./constants";

export interface ExperienceInterface {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: Date;
  endDate: Date | "Present";
  description: string[];
  achievements: string[];
  skills: ValidSkills[];
  companyUrl?: string;
  logo?: string;
}

export const experiences: ExperienceInterface[] = [
  {
    id: "tcs",
    position: "Full Stack Developer",
    company: "TCS",
    location: "Kolkata, India",
    startDate: new Date("2022-07-07"),
    endDate: "Present",
    description: [
      "Developed highly scalable RESTful APIs using Java, ensuring real-time data synchronization that supported 500+ concurrent users with sub-200ms latency.",
      "Architected optimized MySQL schemas and secure middleware, reducing query time by 40% while ensuring data integrity and 100% security audit compliance.",
      "Migrated application from Angular 10 to 13 and implemented Lazy Loading, leveraging the Ivy Compiler to reduce bundle size by 70% and load latency by 80%.",
      "Refactored legacy backend code to modern Java standards, which reduced technical debt and decreased production bug reports by 25% in the subsequent quarter.",
      "Managed Jenkins CI/CD pipelines and enabled Persistent Build Cache, cutting build times by 60% and reducing release cycles from weekly to daily.",
      "Conducted rigorous code reviews and implemented JUnit/Mockito testing to achieve 99% code coverage, resulting in zero critical defects in production releases.",
      "Resolved critical performance bottlenecks by profiling Java applications and analyzing MySQL slow query logs, improving overall system availability to 99.99%.",
      "Collaborated with cross-functional Agile teams to translate requirements into technical specs, ensuring the on-time delivery of 4 major modules within strict deadlines.",
      "Engineered automation features including bulk data processing and one-click report generation, streamlining client workflows and reducing manual task execution time by 40%.",
    ],
    achievements: [
      "Milestone achiever in the tcsˆAI Hackathon - 2025",
      "Secured 3rd rank in BEH (Best Ethical Hacking) TCS, 2022",
      "Secured 25th place globally in ”The Great Appsec Hackathon” - 2021",
    ],
    skills: [
      "Java",
      "Angular",
      "React",
      "Next.js",
      "Docker",
      "Jenkins",
      "Spring Boot",
      "MySQL",
    ],
    companyUrl: "https://www.tcs.com",
    logo: "/experience/tcs.png",
  },
];
