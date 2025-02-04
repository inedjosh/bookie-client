import { useEffect, useRef, useState } from "react";

type Props = {
  setVideoWatchTime: (value: number) => void;
  url: string;
};

const Video = ({ setVideoWatchTime, url }: Props) => {
  console.log(url);
  const playerRef = useRef<any>(null);
  const [watchTime, setWatchTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  console.log(watchTime);
  useEffect(() => {
    // Load YouTube IFrame API if not already loaded
    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);

      // Define the global callback for when the API is ready
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    } else {
      // If the API is already loaded, initialize the player directly
      initPlayer();
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current) playerRef.current.destroy(); // Clean up the player
    };
  }, []);

  const initPlayer = () => {
    playerRef.current = new window.YT.Player("player", {
      height: "100%",
      width: "100%",
      videoId: url, // Sample video ID
      events: {
        onReady: () => console.log("Player is ready"),
        onStateChange: onPlayerStateChange,
      },
    });
  };

  const onPlayerStateChange = (event: any) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          const currentTime = playerRef.current.getCurrentTime();
          console.log({ currentTime });
          setWatchTime((prevTime) => {
            console.log(prevTime);
            const updatedTime = Math.floor(currentTime);
            setVideoWatchTime(updatedTime);
            return updatedTime;
          });
        }, 1000);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  return <div id="player"></div>;
};

export default Video;
