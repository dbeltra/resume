import avatarImg from "../assets/images/avatar.png";
import React from "react";
import TabContent from "../components/tab-content";
import Button from "../components/button";
import GithubIcon from "../assets/icons/github.png";
import LinkedinIcon from "../assets/icons/linkedin.png";

const Code = `\`\`\`xml
<!-- About me -->
<hello to="everyone">
  My name is <David_Beltrà/>,
  I'm a full-stack developer
  with more than 10 years of experience
  <frontend>
    It will look and behave nice
  </frontend>
  <backend>
    It will work easy and fast
  </backend>
</hello>
  \`\`\``;

const AboutContent = () => {
  const personalInfo = {
    name: "David Beltrà",
    role: "Full stack developer",
    contact: {
      linkedin: "linkedin.com/in/dbeltra/",
      github: "github.com/dbeltra",
    },
    description: [
      "I'm currently based in Barcelona, and I have have worked with a  wide range of technologies, both frontend and backend, such as Python, Django, Rust, Javascript or React.",
      "I enjoy challenges and finding ways to learn news skills or improve my current ones.",
    ],
  };

  return (
    <div>
      <img className="h-32" src={avatarImg}></img>
      <div className="text-5xl mt-4 uppercase font-bold">
        {personalInfo.name}
      </div>
      <div className="text-2xl uppercase mb-4">{personalInfo.role}</div>
      <div>
        {personalInfo.description.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
      <div className="flex justify-left py-6 gap-6">
        <Button
          url={personalInfo.contact.github}
          text="Github"
          image={GithubIcon}
        ></Button>
        <Button
          variant="secondary"
          url={personalInfo.contact.linkedin}
          text="Linkedin"
          image={LinkedinIcon}
        ></Button>
      </div>
    </div>
  );
};

const About = () => {
  return (
    <TabContent
      code={Code}
      Title="About Me"
      Content={AboutContent}
    ></TabContent>
  );
};

export default About;