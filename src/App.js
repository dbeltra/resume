import React from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';

const Resume = () => {

  const personalInfo = {
    name: "David Beltrà Tejero",
    title: "Full stack developer",
    contact: {
      email: "dbeltra@gmail.com",
      location: "Barcelona, Spain",
      linkedin: "linkedin.com/in/dbeltra/",
      github: "github.com/dbeltra"
    }
  };

  const workExperience = [
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
      company: "pEp Security / Planck Security",
      dates: "2018 - 2024",
      responsibilities: [
        "Development of Python-based apps and tools like a command line interface or an API for our testing framework.",
        "Migration of static HTML websites to a customised CMS (Django/Mezzanine)",
        "Development of a shop integrated with different payment platforms and custom invoicing options.",
        "Design and implementation of a web/python interface to an MQ queue system.",
        "Implementation of a CLI tool and a Docker solution to decrypt email traffic."
      ]
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
        "Implementation of agile-based working methodology on the company."
      ]
    }
  ];

  const education = [
    {
      degree: "Multimedia Degree",
      mention: "Interactive Aplication development specialization.",
      school: "Universitat Oberta de Catalunya (UOC)"
    }
  ];

  const skills = {
    technical: ["Python", "Rust", "Javascript", "Django", "Backbone", "React", "Docker", "Github"],
    soft: ["Communication", "Teamwork", "Problem Solving"]
  };

  return (
    <div className='text-gray-100'>
      <Navbar></Navbar>
      <Header></Header>

    <div className="bg-black min-h-screen flex items-center justify-center p-6 ">
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{personalInfo.name}</h1>
          <p className="text-xl text-gray-400">{personalInfo.title}</p>
        </div>

        {/* Contact Information */}
        <section className="text-center mb-6 mt-4 text-gray-200">
          <p>{personalInfo.contact.email}</p>
          <p>{personalInfo.contact.location}</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a 
              href={`https://${personalInfo.contact.linkedin}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 hover:underline"
            >
              LinkedIn
            </a>
            <a 
              href={`https://${personalInfo.contact.github}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 hover:underline"
            >
              GitHub
            </a>
          </div>
        </section>

        {/* Work Experience */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold border-b-2 border-gray-600 mb-4">Work Experience</h2>
          {workExperience.map((job, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-bold">{job.title}</h3>
              <p className="text-gray-400">{job.company} | {job.dates}</p>
              <ul className="list-none list-inside text-gray-200">
                {job.responsibilities.map((resp, respIndex) => (
                  <li key={respIndex}>{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold border-b-2 border-gray-600 mb-4">Education</h2>
          {education.map((edu, index) => (
            <div key={index}>
              <h3 className="text-xl font-bold text-gray-100">{edu.degree}</h3>
              <p className="text-gray-400">{edu.school}</p>
              <p className="text-gray-200">{edu.mention}</p>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-2xl font-semibold border-b-2 border-gray-600 mb-4">Skills</h2>
          <div className="flex">
            <div className="w-1/2">
              <h3 className="font-bold">Technical Skills</h3>
              <ul className="list-disc list-inside text-gray-200">
                {skills.technical.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
            <div className="w-1/2">
              <h3 className="font-bold">Soft Skills</h3>
              <ul className="list-disc list-inside text-gray-200">
                {skills.soft.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

    </div>
    </div>
  );
};

export default Resume;
