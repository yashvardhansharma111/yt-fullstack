import React from "react";
import { useVideos } from "../../hooks/video.hook";
import NextVideoCard from "./NextVideoCard";
import { Link } from "react-router-dom";
import NextVideoCardLoading from "../Loading/NextVideoCardLoading";

function UserNextVideos({ userId }) {
  const { data: videosFromUser, isFetching, isFetched } = useVideos({ userId });

  if (isFetching) {
    return (
      <div className="flex flex-col gap-3">
        <NextVideoCardLoading />
        <NextVideoCardLoading />
        <NextVideoCardLoading />
        <NextVideoCardLoading />
        <NextVideoCardLoading />
      </div>
    );
  }

  return (
    <>
      {isFetched &&
        videosFromUser?.pages.map((page, index) => {
          return (
            <React.Fragment key={index}>
              {isFetched &&
                page.docs.map((video) => {
                  return (
                    <Link to={`/video/${video._id}`} key={video._id}>
                      <NextVideoCard video={video} />
                    </Link>
                  );
                })}
            </React.Fragment>
          );
        })}
    </>
  );
}

export default UserNextVideos;