import React from "react";
import TabContent from "../components/tab-content";
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

const SkillsContent = () => {
  return (
    <>
      <div className="text-sm mb-4">
        <p>
          I enjoy the development world where there's always room to grow and
          explore new things. I like <b>team environments</b> where I get to
          both learn from my colleagues and help them with my expertise.
        </p>
        <p>
          I consider myself a <b>comunicative and proactive</b> person with the
          ability to manage problem solving.
        </p>
      </div>
      <div className="flex flex-wrap">
        <div className="w-1/2">
          <div className="font-bold mb-4">Languages & Frameworks</div>
          <ul className="text-sm">
            <li className="flex items-center mt-2">
              <span className="w-8">
                <img src={PythonLogo} className="h-5"></img>
              </span>
              <span> Python + Django</span>
            </li>
            <li className="flex items-center mt-2">
              <span className="w-8">
                <img src={JavascriptLogo} className="h-5"></img>
              </span>
              <span> Javascript + React</span>
            </li>
            <li className="flex items-center mt-2">
              <span className="w-8">
                <img src={RustLogo} className="h-5"></img>
              </span>
              <span> Rust</span>
            </li>
            <li className="flex items-center mt-2">
              <span className="w-8">
                <img src={HTMLLogo} className="h-5"></img>
              </span>
              <span> HTML</span>
            </li>
            <li className="flex items-center mt-2">
              <span className="w-8">
                <img src={CSSLogo} className="h-5"></img>
              </span>
              <span> CSS, Tailwind, Bootsrap, Bulma</span>
            </li>
          </ul>
        </div>
        <div className="w-1/2">
          <div className="font-bold mb-4">Tools</div>
          <ul>
            <li className="flex items-center mt-2">
              <span className="w-8">
                <img src={GitLogo} className="h-5"></img>
              </span>
              <span>Git, Github, Mercurial</span>
            </li>
            <li className="flex items-center mt-2">
              <span className="w-8">
                <img src={GithubLogo} className="h-5"></img>
              </span>
              <span>Github Actions</span>
            </li>
            <li className="flex items-center mt-2">
              <span className="w-8">
                <img src={DockerLogo} className="h-5"></img>
              </span>
              <span>Docker</span>
            </li>
            <li className="flex items-center mt-2">
              <span className="w-8">
                <img src={DBLogo} className="h-5"></img>
              </span>
              <span>SQL, Redis</span>
            </li>
            <li className="flex items-center mt-2">
              <span className="w-8">
                <img src={SassLogo} className="h-5"></img>
              </span>
              <span>Sass, Stylus, Scss</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

const Skills = () => {
  return (
    <TabContent
      code={Code}
      language="python"
      Title="My Skills"
      Content={SkillsContent}
    ></TabContent>
  );
};

export default Skills;
