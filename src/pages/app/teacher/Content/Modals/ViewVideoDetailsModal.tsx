import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { fetchData } from "../../../../../Utils/fetch";
import { useEffect, useRef, useState } from "react";
import { VideoType } from "../../../../../types";
import EditContentSkeleton from "../Components/EditContentSkeleton";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../../components/Typography";
import { readableDate } from "../../../../../Utils/Helpers";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any; // Add YT type if using a YouTube TypeScript library for better typings
  }
}

interface ModalComponentProps {
  modalId: string;
}

function ViewVideoDetailsModal({ modalId }: ModalComponentProps) {
  const ref = useRef<HTMLDivElement | null>();

  const { modalStates } = useModal();
  const videoId = modalStates[modalId]?.props?.videoId;
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState<VideoType | null>();

  useEffect(() => {
    const getCourse = async () => {
      try {
        setLoading(true);
        const response = await fetchData<VideoType>(`/video/${videoId}`);
        setVideo(response.data || null);
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getCourse();
  }, [videoId, modalStates[modalId]?.isOpen]);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) return;
    alert("this fired");
    const handleIframeLoad = () => {
      const iframeWindow = iframe.contentWindow;
      const iframeDocument = iframe.contentDocument;

      if (!iframeWindow || !iframeDocument) return;

      const handleClick = () => {
        const input = iframeDocument.querySelector("input");
        if (input) input.focus();
      };

      iframeWindow.addEventListener("click", handleClick);

      // Cleanup click event listener on iframe window
      return () => iframeWindow.removeEventListener("click", handleClick);
    };

    iframe.addEventListener("load", handleIframeLoad);

    // Cleanup load event listener on iframe
    return () => iframe.removeEventListener("load", handleIframeLoad);
  }, []);

  useEffect(() => {
    // Dynamically load the YouTube API script
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    // Define the callback function that initializes the player
    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player("player", {
        height: "390",
        width: "640",
        videoId: "dQw4w9WgXcQ",
        events: {
          onReady: (event: any) => event.target.playVideo(),
        },
      });
    };

    //  return () => {
    //    // Cleanup: safely remove the onYouTubeIframeAPIReady property
    //    delete window.onYouTubeIframeAPIReady;
    //  };
  }, []);

  return (
    <Modal modalId={modalId}>
      {video ? (
        <ModalHeader modalId={modalId}>
          <Typography variant="subheading">{video.topic}</Typography>
          <Typography variant="subheading">
            {readableDate(new Date(video.createdAt))}
          </Typography>
        </ModalHeader>
      ) : null}
      <div className="w-full h-[700px] px-5 md:px-10 mt-10 overflow-visible md:w-[800px]">
        {loading ? (
          <EditContentSkeleton />
        ) : (
          <div>
            <div id="player"></div>
            <div className="mt-10">
              {video ? (
                <Typography as="div">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: video.description,
                    }}
                  />
                </Typography>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default ViewVideoDetailsModal;
