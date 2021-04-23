import { createContext, useState, ReactNode, useContext } from "react";

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
    playNext: () => void;
    playPrevious: () => void;
    setPlayingState: (state: boolean) => void;
}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}

export function PlayerContextProvider ({ children }: PlayerContextProviderProps) 
{
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    function play(episode)
    {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list: Episode[], index: number)
    {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay()
    {
        setIsPlaying(!isPlaying);
    }

    function toggleLoop()
    {
        setIsLooping(!isLooping);
    }

    function toggleShuffle()
    {
        setIsShuffling(!isShuffling);
    }

    const hasNext = (currentEpisodeIndex + 1) < episodeList.length;
    const hasPrevious = currentEpisodeIndex > 0;

    function playNext()
    {
        if(isShuffling)
        {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            
            if(nextRandomEpisodeIndex == currentEpisodeIndex)
            {
                if(hasNext)
                {
                    setCurrentEpisodeIndex(nextRandomEpisodeIndex + 1);
                } else if(hasPrevious)
                {
                    setCurrentEpisodeIndex(nextRandomEpisodeIndex - 1);
                }
            } else
            {
                setCurrentEpisodeIndex(nextRandomEpisodeIndex);
            }
        } else if(hasNext)
        {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }

    function playPrevious()
    {
        if(hasPrevious)
        {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }

    function setPlayingState(state: boolean)
    {
        setIsPlaying(state);
    }

    return (
        <PlayerContext.Provider 
            value={{ 
                episodeList, 
                currentEpisodeIndex, 
                isPlaying,
                isLooping,
                isShuffling,
                play,
                playList,
                togglePlay,
                toggleLoop,
                toggleShuffle,
                hasNext,
                hasPrevious,
                playNext,
                playPrevious,
                setPlayingState 
            }}
        >
            { children }
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => { 
    return useContext(PlayerContext);
}