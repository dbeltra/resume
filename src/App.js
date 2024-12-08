import React from 'react';
import "highlight.js/styles/nnfx-dark.css";
import hljs from "highlight.js";
import { marked } from "marked";
import { useEffect } from "react";
import avatarImg from "./assets/images/avatar.png"

const Resume = () => {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  const personalInfo = {
    name: "David Beltrà",
    role: "Full stack developer",
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
      ],
      skills: [
        "Rust", "React", "Docker", "Javascript", "Bashscript"
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
        "Implementation of a CLI tool and a Docker solution to decrypt email traffic."
      ],
      skills: [
        "Python", "Django", "Docker", "HTML", "CSS", "Javascript"
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
      ],
      skills: [
        "Python", "Django", "Backbone", "Phonegap", "HTML", "CSS", "Javascript"
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

  const aboutMe = `\`\`\`xml
<!-- About me -->
<hello>
  My name is <David_Beltrà/>,
  I'm a full-stack developer
  with more than 10 years of experience
</hello>
  \`\`\``;

  const lineNumbers = Array.from({ length: aboutMe.split('\n').length }, (_, i) => i + 1);


  return (
    <div className='flex justify-center items-center md:h-screen bg-gray-800 md:bg-page-bg bg-cover bg-center'>
      <div className='md:m-20 xl:m-40 bg-gray-800/80 rounded-t-lg text-gray-200 flex relative flex-col md:flex-row'>
        <div className='w-full md:w-60 p-2 md:py-4 md:px-6'>
          <div className='flex items-center'>
            <span className='bg-red-600 w-3 h-3 rounded-full mr-2'></span>
            <span className='bg-yellow-400 w-3 h-3 rounded-full mr-2'></span>
            <span className='bg-green-600 w-3 h-3 rounded-full mr-3'></span>
            <span>Resumé</span>
          </div>
          <div className='hidden md:flex justify-between py-4'>
            <i className="material-icons text-blue-400">folder</i> 
            <i className="material-icons">search</i> 
            <i className="material-icons">widgets</i> 
            <i className="material-icons">settings</i> 
          </div>
          <div className='hidden md:flex flex-col gap-2 text-sm'>
            <div className='flex items-center justify-start gap-3'>
              <i className="material-icons-outlined">folder</i><b>Resumeé</b>
            </div>
            <div className='flex items-center justify-start gap-3'>
              <i className="material-icons">chevron_right</i><i className="material-icons">folder</i> .github
            </div>
            <div className='flex items-center justify-start gap-3'>
              <i className="material-icons">chevron_right</i><i className="material-icons">folder</i> node_modules
            </div>
            <div className='flex items-center justify-start gap-3'>
              <i className="material-icons rotate-90">chevron_right</i><i className="material-icons-outlined">folder</i> src
            </div>
            <div className='flex items-center justify-start gap-3'>
              <i className="material-icons opacity-0">chevron_right</i><i className="material-icons-outlined">description</i> About.html
            </div>
            <div className='flex items-center justify-start gap-3'>
              <i className="material-icons opacity-0">chevron_right</i><i className="material-icons-outlined">description</i> Experience.css
            </div>
            <div className='flex items-center justify-start gap-3'>
              <i className="material-icons opacity-0">chevron_right</i><i className="material-icons-outlined">description</i> Education.js
            </div>
          </div>
        </div>
        <div className=' bg-gray-800 rounded-tr-lg'>
          <div className='flex bg-gray-900 text-xs rounded-tr-lg'>
            <div className= 'bg-gray-700 border-r border-gray-700 px-3 py-2'>
              <i className="material-icons-outlined text-sm">html</i>About.html
            </div>
            <div className= 'border-r border-gray-700 px-3 py-2'>
              <i className="material-icons-outlined text-sm mr-2">css</i>Experience.css
            </div>
            <div className= 'border-r border-gray-700 px-3 py-2'>
              <i className="material-icons-outlined text-sm mr-2">javascript</i>Education.js
            </div>
          </div>
          <div className='flex flex-grow'>
            <div className='code-font hidden md:block p-4 text-gray-400'>
            {lineNumbers.map((lineNumber) => (
                <div key={lineNumber}>{lineNumber}</div>
              ))}
            </div>
            <div className='code-font p-4 hidden md:block'>
              <div dangerouslySetInnerHTML={{ __html: marked(aboutMe) }} />
            </div>

            <div className='bg-gray-700 p-4'>
            <div className='border-b'>Who am I?</div>
            <div className='p-2'>
              <img className='h-32' src={avatarImg}></img>
              <div className='text-5xl mt-4 uppercase font-bold'>{personalInfo.name}</div>
              <div className='text-2xl uppercase mb-4'>{personalInfo.role}</div>
              <div>
                <p>I'm currently based in Barcelona, and I have have worked with a wide range of technologies, both frontend and backend, such as Python, Django, Rust, Javascript or React.</p>
                <p>I enjoy challenges and finding ways to learn news skills or improve my current ones.</p>
              </div>
              <div className='flex justify-left py-6 gap-6'>
                <a href={`https://${personalInfo.contact.github}`} role='button' className='bg-gray-400 text-gray-800 rounded px-4 py-2'>Github</a>
                <a href={`https://${personalInfo.contact.linkedin}`} role='button' className='bg-gray-400 text-gray-800 rounded px-4 py-2'>Linkedin</a>
              </div>
            </div>
          </div>


          </div>
        </div>
        <div className='absolute -bottom-5 w-full h-5 bg-gray-600 text-gray-400 text-xs hidden md:flex gap-4 justify-end px-4 rounded-b-lg'>
          <span>Line 4/20</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
};

export default Resume;
