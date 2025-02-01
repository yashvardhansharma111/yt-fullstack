import React, { useEffect, useState } from "react";
import { useVideos } from "../hooks/video.hook";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { Videocard, VideoCardLoading } from "../components/index.js";

function Home() {
  const { data, fetchNextPage, isFetched, isFetching } = useVideos();
  const { ref, inView } = useInView();
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Apply dark mode class to the document when theme changes
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0 bg-white dark:bg-[#121212] text-black dark:text-white transition-colors duration-300">
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
        {isFetching
          ? Array(8)
              .fill()
              .map((_, index) => <VideoCardLoading key={index} />)
          : isFetched &&
            data?.pages.map((page, index) => (
              <React.Fragment key={index}>
                {page.docs.map((video) => (
                  <Link to={`/video/${video._id}`} key={video._id}>
                    <Videocard video={video} />
                  </Link>
                ))}
              </React.Fragment>
            ))}

        {/* Infinite Scroll Trigger */}
        <div ref={ref}></div>
      </div>
    </section>
  );
}

export default Home;
