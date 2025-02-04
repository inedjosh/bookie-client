import uitoolkit from "@zoom/videosdk-ui-toolkit";
import "@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css";

function ZoomSDK() {
  let sessionContainer: HTMLDivElement | null = null;
  // set your auth endpoint here
  // a sample is available here: https://github.com/zoom/videosdk-auth-endpoint-sample
  const authEndpoint =
    "https://29f5-197-210-53-171.ngrok-free.app/v1/auth/generate-token";
  const config = {
    videoSDKJWT: "",
    sessionName: "test",
    userName: "React",
    sessionPasscode: "123",
    features: ["video", "audio", "settings", "users", "chat", "share"],
    options: { init: {}, audio: {}, video: {}, share: {} },
    virtualBackground: {
      allowVirtualBackground: true,
      allowVirtualBackgroundUpload: true,
      virtualBackgrounds: [
        "https://images.unsplash.com/photo-1715490187538-30a365fa05bd?q=80&w=1945&auto=format&fit=crop",
      ],
    },
  };
  const role = 1;

  function getVideoSDKJWT() {
    sessionContainer = document.getElementById(
      "sessionContainer"
    ) as HTMLDivElement;
    document.getElementById("join-flow")!.style.display = "none";
    fetch(authEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionName: config.sessionName, role: role }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.signature) {
          console.log(data.signature);
          config.videoSDKJWT = data.signature;
          joinSession();
        } else {
          console.log("call not joined.");
          console.log(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function joinSession() {
    console.log({ config });
    if (sessionContainer) {
      try {
        console.log("there is a session container");
        console.log(sessionContainer);
        try {
          uitoolkit.showVideoComponent(sessionContainer);
          uitoolkit.showChatComponent(sessionContainer);
          uitoolkit.showControlsComponent(sessionContainer);
          uitoolkit.showUsersComponent(sessionContainer);
          uitoolkit.showSettingsComponent(sessionContainer);
          uitoolkit.joinSession(sessionContainer, config);
        } catch (error) {
          console.error("Error while joining session:", error);
        }
        uitoolkit.onSessionJoined(() => {
          console.log("Session joined successfully");
        });
        if (sessionContainer) uitoolkit.onSessionClosed(sessionClosed);
      } catch (error) {
        console.log({ error });
      }
    }
  }

  // useEffect(() => {

  // }, [uitoolkit]);

  const sessionClosed = () => {
    console.log("session closed");
    if (sessionContainer) uitoolkit.closeSession(sessionContainer);
    document.getElementById("join-flow")!.style.display = "block";
  };

  return (
    <div className="App">
      <main>
        <div id="join-flow">
          <h1>Zoom Video SDK Sample React</h1>
          <p>User interface offered by the Video SDK UI Toolkit</p>
          <button onClick={getVideoSDKJWT}>Join Session</button>
        </div>
        <div id="sessionContainer"></div>
      </main>
    </div>
  );
}

export default ZoomSDK;
