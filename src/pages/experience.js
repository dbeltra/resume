import React from "react";
import TabContent from "../components/tab-content";

const workExperience = [
  {
    title: "Rust and React developer",
    company: "Planck Security",
    dates: "2024 - 2025",
    responsibilities: [
      "Migration of part of the tech stack from Python to Rust.",
      "Development and maintenance of a Rust Dockerized solution, able to manage decrypt and store email messages.",
      "Development of a Rust API and a React frontend to manage a Rust decryption solution.",
    ],
    skills: ["Rust", "React", "Docker", "Javascript", "Bashscript"],
  },
  {
    title: "Web and Python developer",
    company: "pEp Security → Planck Security",
    dates: "2018 - 2024",
    responsibilities: [
      "Development of Python-based apps and tools like a command line interface or an API for our testing framework.",
      "Migration of static HTML websites to a customised CMS (Django/Mezzanine)",
      "Development of a shop integrated with different payment platforms and custom invoicing options.",
      "Design and implementation of a web/python interface to an MQ queue system.",
      "Implementation of a CLI tool and a Docker solution to decrypt email traffic.",
    ],
    skills: ["Python", "Django", "Docker", "HTML", "CSS", "Javascript"],
  },
  {
    title: "Full Stack developer",
    company: "Ancora Dual",
    dates: "2014 - 2018",
    responsibilities: [
      "Website design and development",
      "Development of a customizable CMS adaptable to all kind of business, based on Django and Backbone.",
      "Design and development of Autopractik, a driving school management and booking system and multi-platform APP.",
      "Design and development of Backbone/Phonegap system to generate customized APPs for our customers.",
      "Implementation of agile-based working methodology on the company.",
    ],
    skills: [
      "Python",
      "Django",
      "Backbone",
      "Phonegap",
      "HTML",
      "CSS",
      "Javascript",
    ],
  },
];

const Code = `\`\`\`json
{
  title: "Rust and React developer",
  company: "Planck Security",
  dates: "2024 - 2025",
  responsibilities: [
    "Migration of part of the tech stack from Python to Rust.",
    "Development and maintenance of a Rust Dockerized solution, 
    able to manage decrypt and store email messages.",
    "Development of a Rust API and a React frontend to manage a Rust 
    decryption solution.",
  ]
}
\`\`\``;

const ExperienceContent = () => {
  return <div></div>;
};

const Experience = () => {
  return (
    <TabContent
      code={Code}
      Title="My Experience"
      Content={ExperienceContent}
    ></TabContent>
  );
};

export default Experience;
