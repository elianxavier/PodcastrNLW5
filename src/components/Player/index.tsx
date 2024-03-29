import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { usePlayer } from "../../contexts/PlayerContext";
import styles from "./style.module.scss";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

export function Player()
{   
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);
    
    const { 
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        hasNext,
        hasPrevious,
        playNext,
        playPrevious,
        setPlayingState
    } = usePlayer();

    useEffect(() => {
        if(!audioRef.current)
        {
            return;
        }
        
        if(isPlaying)
        {
            audioRef.current.play();
        } else 
        {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    const episode = episodeList[currentEpisodeIndex];

    function setupProgressListener()
    {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener("timeupdate", () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }

    function handleSeek(amount: number)
    {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    return(
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora</strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image height={592} width={592} src={episode.thumbnail} objectFit="cover" />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            ) }

            <footer className={!episode ? styles.empty : ""}>
                <div className={styles.progress}>
                    <span> { convertDurationToTimeString(progress) } </span>
                    
                    <div className={styles.slider}>
                        { episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={ handleSeek }
                                trackStyle={{ backgroundColor: "#04d361" }}
                                railStyle={{ backgroundColor: "#9f75ff"}}
                                handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    
                    <span>{ convertDurationToTimeString(episode?.duration ?? 0) }</span>
                </div>

                { episode && (
                    <audio 
                        src={episode.url}
                        ref={audioRef}
                        autoPlay
                        loop = { isLooping }
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={ setupProgressListener }
                    />
                )}

                <div className={styles.buttons}>
                    <button type="button" className={isShuffling ? styles.isActive : ""} onClick={ toggleShuffle } disabled={episodeList.length <= 2}>
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" onClick={ playPrevious } disabled={!hasPrevious || !episode || isShuffling}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
                        
                        {isPlaying ? (
                            <img src="/pause.svg" alt="Pausar"/>
                        ) : (
                            <img src="/play.svg" alt="Tocar"/>
                        )}
        
                    </button>
                    <button type="button" onClick={ playNext } disabled={(!hasNext && !isShuffling) || !episode}>
                        <img src="/play-next.svg" alt="Tocar próxima"/>
                    </button>
                    <button type="button" className={isLooping ? styles.isActive : ""} onClick={ toggleLoop } disabled={!episode}>
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    );
}