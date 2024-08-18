import { QueryClient, useMutation , useQuery , useQueryClient } from "@tanstack/react-query";
import {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos,
} from '../api/like.api';
import { comment } from "postcss";

export const useLike = (type) => {
const queryClient = useQueryClient();
if (type == 'video') {
    return useMutation ({
        mutationFn : (videoId) => toggleVideoLike(videoId),
        onSuccess:(data , videoId) => {
            queryClient.invalidateQueries({
                queryKey : ["video" , videoId]
            });
        },
    });
};
    if (type == 'comment') {
        return useMutation ({
            mutationFn : (commentId) => toggleCommentLike(commentId),
            onSuccess:(data , commentId) => {
                queryClient.invalidateQueries({
                    queryKey : ["comment" , commentId]
                });
            },
        });
    };
    if (type == "tweet") {
       return useMutation ({
        mutationFn : (tweetId) => toggleTweetLike(tweetId),
        onSuccess:(data , tweetId) => {
            queryClient.invalidateQueries({
                queryKey : ["tweet" , tweetId]
            });
        },
       });
    };
};

export const useLikedVideos = () => {
    return useQuery({
      queryKey: ["likedVideos"],
      queryFn: () => getLikedVideos(),
    });
  };
  