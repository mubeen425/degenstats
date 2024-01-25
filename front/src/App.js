import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

// Components
import Index from "./jsx";
// Style
import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./css/style.css";
import Conformation from "./jsx/pages/conformation";
import Reference from "./jsx/pages/Reference";
import Home from "./jsx/components/Dashboard/Home";

const ForgotPassword = lazy(() => import("./jsx/pages/ForgotPassword"));
const Login = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("./jsx/pages/Login")), 500);
  });
});

function App() {
  return (
    <div className="vh-100">
      
      <Suspense
        fallback={
          <div id="preloader">
            <div className="sk-three-bounce">
              <div className="sk-child sk-bounce1"></div>
              <div className="sk-child sk-bounce2"></div>
              <div className="sk-child sk-bounce3"></div>
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/:ref_address" element={<Reference />} />
          <Route path="/conformation" element={<Conformation />} />
          <Route path="/dashboard" element={<Index />} />
          {/* Other routes can be added here */}
          {/* <Route path='/page-forgot-password' element={<ForgotPassword />} /> */}
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
