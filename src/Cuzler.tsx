import { Box, Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

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
      .sort((a, b) => a.cuzNumber - b.cuzNumber); // Ensure sorting is applied

    setFilteredCuzlers(filtered);
    setSelectedHatim(hatimNumber);
  };

  const handleInputChange = (cuzNumber: number, value: string) => {
    setNameInputs((prev) => ({ ...prev, [cuzNumber]: value }));
  };

  const handleUpdateName = async (id: string, cuzNumber: number) => {
    const newName = nameInputs[cuzNumber];
    if (!newName) return;

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

      // Update the full state
      setCuzlers((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, personName: newName } : item
        )
      );

      // Update only the filtered list (so UI updates immediately)
      setFilteredCuzlers((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, personName: newName } : item
        )
      );

      // Clear input field
      setNameInputs((prev) => ({ ...prev, [cuzNumber]: "" }));
    } catch (error) {
      console.error("Error updating personName:", error);
    }
  };

  return (
    <Box sx={{ color: "black", height: "100%", padding: 2 }}>
      {/* Hatim selection buttons */}
      <Box sx={{ display: "flex", gap: 1, marginBottom: 2 }}>
        {[1, 2, 3, 4, 5].map((num) => (
          <Button
            key={num}
            variant={selectedHatim === num ? "contained" : "outlined"}
            onClick={() => filterByHatim(num)}
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
              gap: 2,
              background: "white",
              padding: 1,
              borderRadius: 1,
            }}
          >
            <span>Cuz {item.cuzNumber}:</span>
            {item.personName ? (
              <span>{item.personName}</span>
            ) : (
              <>
                <TextField
                  size="small"
                  placeholder="Enter your name"
                  value={nameInputs[item.cuzNumber] || ""}
                  onChange={(e) =>
                    handleInputChange(item.cuzNumber, e.target.value)
                  }
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleUpdateName(item._id, item.cuzNumber)}
                >
                  Add
                </Button>
              </>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Cuzler;
