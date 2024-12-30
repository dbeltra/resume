import React from "react";
import { useTranslation } from "react-i18next";

import TabContent from "../components/TabContent";
import PythonLogo from "../assets/icons/color/python.png";
import JavascriptLogo from "../assets/icons/color/js.png";
import RustLogo from "../assets/icons/color/rust.png";
import HTMLLogo from "../assets/icons/color/html-5.png";
import CSSLogo from "../assets/icons/color/css-3.png";
import GitLogo from "../assets/icons/color/git.png";
import GithubLogo from "../assets/icons/color/github.png";
import DockerLogo from "../assets/icons/color/docker.png";
import DBLogo from "../assets/icons/color/database.png";
import SassLogo from "../assets/icons/color/sass.png";

const Code = `# This is what I can do!

skills = {
    "Python": "🐍",
    "Rust": "🦀",
    "Javascript": "👨🏼‍💻",
    "Django": "🤠",
    "React": "⚛️",
    "Docker": "🐋",
    "Github": "🐙",
}

def show_skills(skills):
    """Show some love for the skills"""
    
    for skill, icon in skills.items(): 
        print(f"I ♥️ {skill}! {icon}")

def main():
    show_skills(myskills)

if __name__ == "__main__":
    main()
`;

const Languages = [
  { icon: PythonLogo, name: "Python + Django" },
  { icon: JavascriptLogo, name: "Javascript + React" },
  { icon: RustLogo, name: "Rust" },
  { icon: HTMLLogo, name: "HTML" },
  { icon: CSSLogo, name: "CSS, Tailwind, Bootsrtap, Bulma" },
];

const Tools = [
  { icon: GitLogo, name: "Git, Github, Mercurial" },
  { icon: GithubLogo, name: "Github Actions" },
  { icon: DockerLogo, name: "Docker" },
  { icon: DBLogo, name: "SQL, Redis" },
  { icon: SassLogo, name: "Sass, Stylus, Scss" },
];

const SkillsContent = () => {
  const { t } = useTranslation();

  const skills = t("skillsDescription", {
    returnObjects: true,
  });
  return (
    <>
      <div className="text-sm mb-4">
        {skills.map((skill, index) => (
          <p key={index} className="mt-2">
            {skill}
          </p>
        ))}
      </div>
      <div className="flex flex-wrap">
        <div className="w-1/2">
          <div className="font-bold mb-4">{t("skillsLanguages")}</div>
          <ul className="text-sm">
            {Languages.map(({ name, icon }) => (
              <li className="flex items-center mt-2" key={name}>
                <span className="w-8">
                  <img src={icon} className="h-5" alt={name}></img>
                </span>
                <span>{name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/2">
          <div className="font-bold mb-4">{t("skillsTools")}</div>
          <ul className="text-sm">
            {Tools.map(({ name, icon }) => (
              <li className="flex items-center mt-2" key={name}>
                <span className="w-8">
                  <img src={icon} className="h-5" alt={name}></img>
                </span>
                <span>{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

const Skills = () => {
  const { t } = useTranslation();

  return (
    <TabContent
      code={Code}
      language="python"
      Title={t("skillsTitle")}
      Content={SkillsContent}
    ></TabContent>
  );
};

export default Skills;
