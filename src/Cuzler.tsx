import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface CuzlerType {
  _id: string;
  hatimNumber: number;
  cuzNumber: number;
  personName: string;
}

const Cuzler: React.FC = () => {
  const [cuzlers, setCuzlers] = useState<CuzlerType[]>([]);
  const [filteredCuzlers, setFilteredCuzlers] = useState<CuzlerType[]>([]);
  const [selectedHatim, setSelectedHatim] = useState<number>(1);
  const [nameInputs, setNameInputs] = useState<Record<number, string>>({});
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const isHatimComplete = (hatimNumber: number) => {
    const hatimCuzlers = cuzlers.filter(
      (cuz) => cuz.hatimNumber === hatimNumber
    );
    return hatimCuzlers.every(
      (cuz) => cuz.personName && cuz.personName.trim() !== ""
    );
  };
  const arePreviousHatimsComplete = (hatimNumber: number) => {
    for (let i = 1; i < hatimNumber; i++) {
      if (!isHatimComplete(i)) return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://ihya-2025-be0afcce5189.herokuapp.com/cuzlers`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();

        // Sort data by cuzNumber in ascending order
        const sortedData = result.response.sort(
          (a: CuzlerType, b: CuzlerType) => a.cuzNumber - b.cuzNumber
        );

        setCuzlers(sortedData);
        filterByHatim(1, sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filterByHatim = (hatimNumber: number, data: CuzlerType[] = cuzlers) => {
    const filtered = data
      .filter((item) => item.hatimNumber === hatimNumber)
      .sort((a, b) => a.cuzNumber - b.cuzNumber);

    setFilteredCuzlers(filtered);
    setSelectedHatim(hatimNumber);
  };

  const handleInputChange = (cuzNumber: number, value: string) => {
    setNameInputs((prev) => ({ ...prev, [cuzNumber]: value }));
  };

  const [updatedCuz, setUpdatedCuz] = useState<Record<number, boolean>>({});
  const [editedFields, setEditedFields] = useState<Record<number, boolean>>({}); // Track which fields are being edited

  const handleUpdateName = async (id: string, cuzNumber: number) => {
    const newName = nameInputs[cuzNumber]?.trim() ?? ""; // Allow empty string

    try {
      const response = await fetch(
        `https://ihya-2025-be0afcce5189.herokuapp.com/cuzlers/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ personName: newName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update personName");
      }

      // 1️⃣ **Update both states to reflect the new (even blank) name immediately**
      setCuzlers((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, personName: newName } : item
        )
      );

      setFilteredCuzlers((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, personName: newName } : item
        )
      );

      // 2️⃣ **Show "Güncellendi" for 2 seconds, then hide button**
      setUpdatedCuz((prev) => ({ ...prev, [cuzNumber]: true }));

      setTimeout(() => {
        setUpdatedCuz((prev) => ({ ...prev, [cuzNumber]: false }));
        setEditedFields((prev) => ({ ...prev, [cuzNumber]: false })); // Disable input after update
        setNameInputs((prev) => ({ ...prev, [cuzNumber]: "" })); // Reset input field
      }, 2000);
    } catch (error) {
      console.error("Error updating personName:", error);
    }
  };

  const handleDownloadExcel = () => {
    const formattedData = cuzlers.map((item) => ({
      "Hatim Numarasi": item.hatimNumber,
      "Cüz numarası": item.cuzNumber,
      İsim: item.personName || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cuzlers");

    XLSX.writeFile(workbook, "cuzlers.xlsx");
  };

  const handlePasswordSubmit = () => {
    if (adminPassword === "LONDRA") {
      setIsAdmin(true);
    } else {
      alert("Yanlis sifre");
    }
  };

  return (
    <Box sx={{ color: "black", height: "100%", padding: 2 }}>
      {/* Hatim selection buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          marginBottom: 2,
          justifyContent: "center", // 👈 Center buttons
          width: "100%", // 👈 Ensure they use full width
        }}
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <Button
            key={num}
            variant={selectedHatim === num ? "contained" : "outlined"}
            onClick={() => {
              if (!arePreviousHatimsComplete(num)) {
                alert(
                  "Lütfen önceki cüzü tamamlayın, ardından bir sonraki cüze geçebilirsiniz."
                );
              } else {
                filterByHatim(num);
              }
            }}
            // disabled={!arePreviousHatimsComplete(num)}
            sx={{
              flex: 1, // 👈 Make all buttons equal width
              minWidth: "auto", // 👈 Prevents buttons from being too wide
              fontSize: "0.8rem", // 👈 Reduce text size slightly
              padding: "6px 8px", // 👈 Reduce padding for compact design
              backgroundColor: !arePreviousHatimsComplete(num) ? "#f0f0f0" : "",
              color: !arePreviousHatimsComplete(num) ? "#999" : "",
              cursor: !arePreviousHatimsComplete(num)
                ? "not-allowed"
                : "pointer",
            }}
          >
            Hatim {num}
          </Button>
        ))}
      </Box>

      {/* List of Cuzlers */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {filteredCuzlers.map((item) => (
          <Box
            key={item._id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              background: "#cccccc",
              padding: 1,
              borderRadius: 1,
            }}
          >
            <span>Cüz {item.cuzNumber}:</span>

            {/* Show Input Only If Editing, Otherwise Show Name */}
            {editedFields[item.cuzNumber] || !item.personName ? (
              <>
                <TextField
                  size="small"
                  placeholder="Isminizi yaziniz"
                  value={nameInputs[item.cuzNumber] ?? item.personName}
                  onChange={(e) =>
                    handleInputChange(item.cuzNumber, e.target.value)
                  }
                  sx={{
                    background: "white",
                    border: "1px solid #ccc",
                    width: "170px",
                  }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleUpdateName(item._id, item.cuzNumber)}
                  sx={{
                    backgroundColor: updatedCuz[item.cuzNumber]
                      ? "green"
                      : "primary",
                  }}
                >
                  {updatedCuz[item.cuzNumber]
                    ? "Güncellendi"
                    : item.personName
                    ? "Güncelle"
                    : "Ekle"}
                </Button>
              </>
            ) : (
              // Show name as text, allow admin to click to edit
              <span
                style={{
                  cursor: isAdmin ? "pointer" : "default",
                  fontWeight: isAdmin ? "bold" : "normal",
                }}
                onClick={() =>
                  isAdmin &&
                  setEditedFields((prev) => ({
                    ...prev,
                    [item.cuzNumber]: true,
                  }))
                }
              >
                {item.personName || "—"} {/* Show dash if blank */}
              </span>
            )}
          </Box>
        ))}
      </Box>

      {/* Admin Password Input */}
      {!isAdmin && (
        <Box
          sx={{
            marginTop: 3,
            background: "#EF9A9A",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 1,
          }}
        >
          <Typography sx={{ color: "white" }}>
            Sadece Meryem hoca icin admin girisi
          </Typography>
          <Box
            sx={{ marginTop: 3, display: "flex", alignItems: "center", gap: 1 }}
          >
            <TextField
              size="small"
              type={showPassword ? "text" : "password"}
              placeholder="Admin şifresi"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={handlePasswordSubmit}
            >
              Tamam
            </Button>
          </Box>
        </Box>
      )}

      {/* Download Excel Button (Visible only for admin) */}
      {isAdmin && (
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          onClick={handleDownloadExcel}
        >
          Download Excel
        </Button>
      )}
    </Box>
  );
};

export default Cuzler;
