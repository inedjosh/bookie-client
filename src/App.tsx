import Routes from "./Routes/Index";
import ModalLayout from "./Layouts/ModalLayouts";

function App() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
      });
    });
  }
  return (
    <>
      <ModalLayout>
        <Routes />
      </ModalLayout>
    </>
  );
}

export default App;
