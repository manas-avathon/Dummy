import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Home from "./Home";
import "./App.css";
import GridPage from "./GridPage";
import UserAddress from "./Address";
import Form from "./Form"

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

function App() {
  return (
    <>
      <Router>
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
          <nav className="bg-blue-600 p-4 shadow-md">
            <ul className="flex space-x-6">
              <li>
                <Link
                  to="/"
                  className="text-white hover:text-blue-200 text-lg font-medium"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/grid"
                  className="text-white hover:text-blue-200 text-lg font-medium"
                >
                  GridPage
                </Link>
              </li>
              <li>
                <Link to="/address" className="text-white hover:text-blue-200 text-lg font-medium">
                  Address
                </Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/grid" element={<GridPage />} />
            <Route path="/address" element={<UserAddress />} />
            <Route path="/createAddress" element={<Form />} />
            <Route path="/edit-address/:addressId" element={<Form />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
