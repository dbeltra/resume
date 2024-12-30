import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import TabContent from "../components/TabContent";
import PlanckImg from "../assets/images/planck.png";
import PepImg from "../assets/images/pep.png";
import AncoraImg from "../assets/images/ancora.png";

const Code = `{
  title: "Rust and React developer",
  company: "Planck Security",
  dates: "2024 - 2025",
  responsibilities: [
    "Migration of part of the tech stack from Python to Rust.",
    "Development and maintenance of a Rust Dockerized solution, able to manage decrypt and store email messages.",
    "Development of a Rust API and a React frontend to manage a decryption solution.",
  ]
},{
  title: "Web and Python developer",
  company: "pEp Security & Planck Security",
  dates: "2018 - 2024",
  responsibilities: [
    "Migration of static HTML websites to a customised CMS",
    "Development of a CLI and an API for our testing framework.",
    "Development of a custom shop with invoicing options.",
    "Design and implementation of a web/python interface to an MQ queue system.",
    "Implementation of a CLI tool and a Docker solution to decrypt email traffic.",
  ]
},{
  title: "Full Stack developer",
  company: "Ancora Dual",
  dates: "2014 - 2018",
  responsibilities: [
    "I worked as a web designer and developer.",
    "Created a customizable CRUD business solution.",
    "Development of a web-based management tool for driving schools.",
    "I also enforced agile methodologies to our team workflow.",
  ],
}
`;

const ExperienceContent = () => {
  const { t } = useTranslation();

  const staticExperiences = [
    { image: AncoraImg },
    { image: PepImg },
    { image: PlanckImg },
  ];
  const translatedExperiences = t("experienceExperiences", {
    returnObjects: true,
  });
  const experiences = translatedExperiences.map((exp, index) => ({
    ...exp,
    ...staticExperiences[index],
  }));

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(null);
  const [animating, setAnimating] = useState(false); // Tracks if an animation is in progress

  const handleNextSlide = () => {
    if (animating) return; // Prevent double clicks during animation
    setDirection("next");
    setAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % experiences.length);
      setDirection(null);
      setAnimating(false);
    }, 500);
  };

  const handlePrevSlide = () => {
    if (animating) return; // Prevent double clicks during animation
    setDirection("prev");
    setAnimating(true);
    setTimeout(() => {
      setCurrentSlide(
        (prev) => (prev - 1 + experiences.length) % experiences.length,
      );
      setDirection(null);
      setAnimating(false);
    }, 500);
  };

  const getSlideClass = (index) => {
    if (index === currentSlide && !animating) {
      return "opacity-100";
    }
    if (direction === "next") {
      if (index === currentSlide) return "animate-slide-out-left";
      if (index === (currentSlide + 1) % experiences.length)
        return "animate-slide-in-right";
    } else if (direction === "prev") {
      if (index === currentSlide) return "animate-slide-out-right";
      if (
        index ===
        (currentSlide - 1 + experiences.length) % experiences.length
      )
        return "animate-slide-in-left";
    }
    return "opacity-0";
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Image Container */}
      <div className="relative h-36 overflow-hidden">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-500 ${getSlideClass(index)}`}
          >
            <img
              src={exp.image}
              alt={exp.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Navigation Buttons */}
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4">
          <button
            onClick={handlePrevSlide}
            className="bg-white/10 rounded-sm p-2 hover:bg-white/10 transition"
          >
            <i className="material-symbols-outlined">chevron_left</i>
          </button>
          <button
            onClick={handleNextSlide}
            className="bg-white/10 rounded-sm p-2 hover:bg-white/20 transition"
          >
            <i className="material-symbols-outlined">chevron_right</i>
          </button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {experiences.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full ${
              index === currentSlide ? "bg-secondary-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Experience Details */}
      <div className="mt-6">
        <h3 className="text-xl font-bold">{experiences[currentSlide].title}</h3>
        <p className="">
          {experiences[currentSlide].company} ({experiences[currentSlide].dates}
          )
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {experiences[currentSlide].responsibilities.map((resp, index) => (
            <li key={index} className="">
              {resp}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Experience = () => {
  const { t } = useTranslation();
  return (
    <TabContent
      code={Code}
      language="json"
      Title={t("experienceTitle")}
      Content={ExperienceContent}
    ></TabContent>
  );
};

export default Experience;
