import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { ToastContainer } from "react-toastify";
import { GoogleTranslateWrapper } from "./components/translation/GoogleTranslateWrapper.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleTranslateWrapper>
        <RouterProvider router={router} />
      <ToastContainer />
      </GoogleTranslateWrapper>
    </Provider>
  </StrictMode>,
);
