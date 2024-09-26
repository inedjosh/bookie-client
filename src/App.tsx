import { Suspense } from "react";
import Routes from "./Routes/Index";
import PageLoader from "./Layouts/PageLoader";
import ModalLayout from "./Layouts/ModalLayouts";

function App() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <ModalLayout>
          {" "}
          <Routes />{" "}
        </ModalLayout>
      </Suspense>
    </>
  );
}

export default App;
