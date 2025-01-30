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
import Cuzler from "./Cuzler";

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
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Cuzler />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
