import React from "react";
import TabContent from "../components/TabContent";
import Button from "../components/Button";
import GithubIcon from "../assets/icons/mono/github.png";
import LinkedinIcon from "../assets/icons/mono/linkedin.png";
import Avatar from "../components/Avatar";

const Code = `<!-- About me -->
<hello to="everyone">
  <introduction>
    <name>David Beltrà</name>
    <profession>Full-stack Developer</profession>
    <experience>
      <years>10</years>
    </experience>
  </introduction>

  <frontend>
    <description>
      I specialize in building modern, responsive UIs
      with an emphasis on accessibility for all users.
    </description>
  </frontend>

  <backend>
    <description>
      I develop fast, scalable, and maintainable backend
      applications for robust and reliable systems.
    </description>
  </backend>
</hello>`;

const AboutContent = () => {
  const personalInfo = {
    name: "David Beltrà",
    role: "Full stack developer",
    contact: {
      linkedin: "linkedin.com/in/dbeltra/",
      github: "github.com/dbeltra",
    },
    description: [
      "I'm currently based in Barcelona, and I have worked with a  wide range of technologies, both frontend and backend, such as Python, Django, Rust, Javascript or React.",
      "I enjoy challenges and finding ways to learn news skills or improve my current ones.",
    ],
  };

  return (
    <div>
      <Avatar></Avatar>
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
      language="xml"
      Title="About Me"
      Content={AboutContent}
    ></TabContent>
  );
};

export default About;
