import React, { useState } from "react";
import TabContent from "../components/tab-content";
import PlanckImg from "../assets/images/planck.png";
import PepImg from "../assets/images/pep.png";
import AncoraImg from "../assets/images/ancora.png";

const Code = `\`\`\`json
{
  title: "Rust and React developer",
  company: "Planck Security",
  dates: "2024 - 2025",
  responsibilities: [
    "Migration of part of the tech stack from Python to Rust.",
    "Development and maintenance of a Rust Dockerized solution, able to manage decrypt and store email messages.",
    "Development of a Rust API and a React frontend to manage a Rust decryption solution.",
  ]
},{
  title: "Web and Python developer",
  company: "pEp Security → Planck Security",
  dates: "2018 - 2024",
  responsibilities: [
    "Development of Python-based apps and tools like a command line interface or an API for our testing framework.",
    "Migration of static HTML websites to a customised CMS (Django/Mezzanine)",
    "Development of a shop integrated with different payment platforms and custom invoicing options.",
    "Design and implementation of a web/python interface to an MQ queue system.",
    "Implementation of a CLI tool and a Docker solution to decrypt email traffic.",
  ]
},{
    title: "Full Stack developer",
    company: "Ancora Dual",
    dates: "2014 - 2018",
    responsibilities: [
      "Website design and development",
      "Development of a customizable CMS adaptable to all kind of business, based on Django and Backbone.",
      "Design and development of Autopractik, a driving school management and booking system and multi-platform APP.",
      "Design and development of Backbone/Phonegap system to generate customized APPs for our customers.",
      "Implementation of agile-based working methodology on the company.",
    ]
  }
\`\`\``;

const experiences = [
  {
    image: AncoraImg,
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
  },
  {
    image: PepImg,
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
  },
  {
    image: PlanckImg,
    title: "Rust and React developer",
    company: "Planck Security",
    dates: "2024 - 2025",
    responsibilities: [
      "Migration of part of the tech stack from Python to Rust.",
      "Development and maintenance of a Rust Dockerized solution, able to manage decrypt and store email messages.",
      "Development of a Rust API and a React frontend to manage a Rust decryption solution.",
    ],
  },
];

const ExperienceContent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % experiences.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + experiences.length) % experiences.length,
    );
  };
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="overflow-hidden">
        {/* Image */}
        <div className="w-full h-64 overflow-hidden relative">
          <img
            src={experiences[currentSlide].image}
            alt={`${experiences[currentSlide].company} logo`}
            className="w-full h-full object-contain"
          />

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4">
            <button
              onClick={prevSlide}
              className="p-2 rounded hover:bg-gray-500 transition"
            >
              <i className="material-icons ">chevron_left</i>
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded hover:bg-gray-500 transition"
            >
              <i className="material-icons ">chevron_right</i>
            </button>
          </div>
        </div>

        {/* Experience Details */}
        <div className="p-6 ">
          <h3 className="text-xl font-bold">
            {experiences[currentSlide].title}
          </h3>
          <div className="mb-2">
            <span>{experiences[currentSlide].company}</span>
            <span className="ml-4 text-sm">
              ({experiences[currentSlide].dates})
            </span>
          </div>

          <ul className="">
            {experiences[currentSlide].responsibilities.map((resp, index) => (
              <li key={index} className="text-sm">
                {resp}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center mt-4">
        {experiences.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 mx-1 rounded-full ${
              index === currentSlide ? "bg-secondary" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
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
