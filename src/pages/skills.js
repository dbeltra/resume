import React from "react";
import TabContent from "../components/tab-content";

const Code = `\`\`\`Python
# This is what I can do!

hard_skills = {
    "Python": "🐍",
    "Rust": "🦀",
    "Javascript": "👨🏼‍💻",
    "Django": "🤠",
    "React": "⚛️",
    "Docker": "🐋",
    "Github": "🐙",
}

def show_skills(myskills):
    """
    Show some love for the skills
    """
    for skill, icon in myskills.items(): 
        print(f"I ♥️ {skill}! {icon}")

def main():
    show_skills(myskills)

if __name__ == "__main__":
    main()

\`\`\``;

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
      Title="My Skills"
      Content={SkillsContent}
    ></TabContent>
  );
};

export default Skills;
