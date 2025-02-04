import YouTube from "react-youtube";

const VideoPlayer = ({ ref }: any) => {
  const _onReady = (event: any) => {
    event.target.pauseVideo();
  };

  const options = {
    height: "500",
    width: "600",
    playerVars: {
      autoplay: 1,
      controls: 0,
    },
  };

  return (
    <YouTube
      ref={ref}
      videoId="Oflbho9ZG2U"
      options={options}
      onReady={_onReady}
      id="video"
    />
  );
};

export default VideoPlayer;
