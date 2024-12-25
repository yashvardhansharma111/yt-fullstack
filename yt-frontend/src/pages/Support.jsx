import React from "react";
import {
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaWhatsapp,
  FaQuestionCircle,
} from "react-icons/fa";

const SocialLink = ({ name, icon: Icon, url }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Visit ${name}`}
    className="flex items-center p-3 bg-gray-800 dark:bg-gray-200 rounded-lg hover:bg-orange-700 dark:hover:bg-orange-500 transition duration-300"
  >
    <Icon className="text-orange-400 dark:text-orange-600 mr-3 text-xl" />
    <span className="text-lg dark:text-black">{name}</span>
  </a>
);

const Support = () => {
  const personalInfo = {
    name: "Yashvardhan Sharma",
    email: "Yashvardhansharma111@gmail.com",
  };

  const links = [
    { name: "Instagram", icon: FaInstagram, url: "https://www.instagram.com/heyitsvardhan_?igsh=MW15a3ZhZ2xmaHFuZA==" },
    { name: "LinkedIn", icon: FaLinkedin, url: "https://www.linkedin.com/in/yashvardhan-sharma-671b02270/" },
    { name: "GitHub", icon: FaGithub, url: "https://github.com/yashvardhansharma111" },
    { name: "WhatsApp", icon: FaWhatsapp, url: "https://wa.me/9589708682" },
  ];

  return (
    <section className="w-full flex justify-center items-center">
      <div className="bg-gray-900 dark:bg-gray-100 dark:text-black text-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-orange-600 dark:bg-orange-400 p-4 rounded-full mb-4">
            <FaQuestionCircle className="text-4xl text-white dark:text-black" />
          </div>
          <h3 className="text-2xl font-bold text-center mb-2 dark:text-orange-500">
            Contact me for any issue or Support
          </h3>
          <h4 className="text-2xl font-bold text-center mb-2">{personalInfo.name}</h4>
          <p
            className="text-orange-400 dark:text-orange-600 text-lg mb-4 cursor-pointer"
            onClick={() => navigator.clipboard.writeText(personalInfo.email)}
          >
            {personalInfo.email}
          </p>
        </div>
        <div className="space-y-4">
          {links.length > 0 ? (
            links.map((link) => <SocialLink key={link.name} {...link} />)
          ) : (
            <p>No social links available</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Support;
