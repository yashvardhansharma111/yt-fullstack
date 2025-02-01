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
    className="flex items-center p-3 bg-gray-800 dark:bg-gray-200 rounded-lg hover:bg-orange-500 dark:hover:bg-orange-400 transition duration-300 ease-in-out"
  >
    <Icon className="text-orange-400 dark:text-orange-600 mr-3 text-xl" />
    <span className="text-lg text-white dark:text-black font-medium">{name}</span>
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
    <section className="w-full flex bg-white justify-center items-center py-8 dark:bg-black">
      <div className="bg-gradient-to-r from-blue-50 via-purple-100 to-blue-400 dark:from-gray-800 dark:via-gray-700 dark:to-black text-white dark:text-white p-8 rounded-lg shadow-lg max-w-xl mx-auto transition duration-300 ease-in-out">
        <div className="flex flex-col items-center mb-6 space-y-4">
          <div className="bg-orange-600 dark:bg-orange-500 p-6 rounded-full mb-4">
            <FaQuestionCircle className="text-5xl text-white" />
          </div>
          <h3 className="text-3xl font-semibold text-center mb-2 text-black dark:text-white">
            Need Help? Reach out to me
          </h3>
          <h4 className="text-2xl font-bold text-center mb-2 text-black dark:text-white">
            {personalInfo.name}
          </h4>
          <p
            className="text-lg text-orange-400 dark:text-orange-600 cursor-pointer hover:underline"
            onClick={() => navigator.clipboard.writeText(personalInfo.email)}
          >
            {personalInfo.email}
          </p>
        </div>
        <div className="space-y-4">
          {links.length > 0 ? (
            links.map((link) => <SocialLink key={link.name} {...link} />)
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No social links available</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Support;
