import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const personalInfo = {
    name: "David Beltrà",
    role: t("aboutRole"),
    contact: {
      linkedin: "linkedin.com/in/dbeltra/",
      github: "github.com/dbeltra",
    },
    description: t("aboutDescription", { returnObjects: true }),
  };

  return (
    <div className="px-4">
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
  const { t } = useTranslation();
  return (
    <TabContent
      code={Code}
      language="xml"
      Title={t("aboutTitle")}
      Content={AboutContent}
    ></TabContent>
  );
};

export default About;
