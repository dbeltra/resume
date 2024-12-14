import React from "react";
import TabContent from "../components/tab-content";

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
    <div>
      Lorem ipsum dolor set amet orem ipsum dolor set amet orem ipsum dolor set
      amet orem ipsum
    </div>
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
