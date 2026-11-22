import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HotelListPage from "./pages/HotelListPage";
import HotelFormPage from "./pages/HotelFormPage";
import HotelDetailPage from "./pages/HotelDetailPage";

function App() {
  return (
    <div className="app-shell">
      <Header />
      <div className="app-body">
        <Routes>
          <Route path="/" element={<HotelListPage />} />
          <Route path="/hotels/new" element={<HotelFormPage />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="/hotels/:id/edit" element={<HotelFormPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
