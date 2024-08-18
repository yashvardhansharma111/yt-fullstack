import { useQuery } from "@tanstack/react-query"
import {
    getChannelAbouts,
    getChannelStats,
    getChannelVideos
} from "../api/dashboard.api"

export const useChannelAbouts = () => {
    return useQuery({
        queryKey:["channelAbout"],
        queryFn: getChannelAbouts,
    });
};

export const useChannelStats = () => {
    return useQuery({
        queryKey:["channelStats"],
        queryFn: getChannelStats,
    });
};

export const useChannelVideos = () => {
    return useQuery({
        queryKey:["channelVideos"],
        queryFn: getChannelVideos,
    });
};