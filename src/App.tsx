import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import { Box, Typography } from "@mui/material";
import "./App.css";
import TimeAndDate from "./TimeAndDate";
import TimeGrid from "./TimeGrid";
import GunlukSureler from "./GunlukSureler";

const App: React.FC = () => {
  const [selectedIslamicDate, setSelectedIslamicDate] = useState<string>("");

  const handleDateChange = (date: string) => {
    setSelectedIslamicDate(date);
  };

  const NavLink = ({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
      <Link to={to} style={{ textDecoration: "none" }}>
        <Typography
          variant="h6"
          sx={{
            cursor: "pointer",
            textDecoration: isActive ? "underline" : "none",
          }}
        >
          {children}
        </Typography>
      </Link>
    );
  };

  return (
    <Router>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          mt: -5,
        }}
      >
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <NavLink to="/">Itikaf saatleri</NavLink>
        </Box>
        <Box sx={{ mt: 4, textAlign: "center", ml: 10 }}>
          <NavLink to="/gunluk-sureler">Günlük Sureler</NavLink>
        </Box>
      </Box>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <TimeAndDate onDateChange={handleDateChange} />
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", ml: 0.5 }}>
                  <Box
                    sx={{
                      background: "#E57373",
                      width: "10px",
                      height: "10px",
                    }}
                  ></Box>
                  <Typography variant="body2" sx={{ ml: "5px" }}>
                    Geçmiş saat
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", ml: 0.5 }}>
                  <Box
                    sx={{
                      background: "#4CAF50",
                      width: "10px",
                      height: "10px",
                    }}
                  ></Box>
                  <Typography variant="body2" sx={{ ml: "5px" }}>
                    Şu anki saat
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", ml: 0.5 }}>
                  <Box
                    sx={{
                      background: "grey",
                      width: "10px",
                      height: "10px",
                    }}
                  ></Box>
                  <Typography variant="body2" sx={{ ml: "5px" }}>
                    Gelecek saat
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                İtikafa başladığınız saatte isminizin yanındaki kutuya tik
                atmayı unutmayınız. Kutucuklar sadece kendi saatlerinde aktif
                olacaktır. Önceden ya da saat geçtikten sonra değişiklik
                yapılmamaktadır. Eskiye dönük değişiklik yapmak isterseniz
                WhatsApp'tan yazabilirsiniz. Teşekkürler.
              </Typography>
              <TimeGrid selectedIslamicDate={selectedIslamicDate} />
            </>
          }
        />
        <Route path="/gunluk-sureler" element={<GunlukSureler />} />
      </Routes>
    </Router>
  );
};

export default App;
