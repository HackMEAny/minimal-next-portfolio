import { Icons } from "@/components/common/icons";

interface SocialInterface {
  name: string;
  username: string;
  icon: any;
  link: string;
}

export const SocialLinks: SocialInterface[] = [
  {
    name: "Github",
    username: "@HackMeAny",
    icon: Icons.gitHub,
    link: "https://github.com/hackmeany",
  },
  {
    name: "LinkedIn",
    username: "Aniket Das",
    icon: Icons.linkedin,
    link: "https://www.linkedin.com/in/aniketdas188/",
  },
  {
    name: "Twitter",
    username: "@Aniket10702843",
    icon: Icons.twitter,
    link: "https://x.com/Aniket10702843",
  },
  {
    name: "Gmail",
    username: "aniket.das.188",
    icon: Icons.gmail,
    link: "mailto:aniket.das.188@gmail.com",
  },
];
