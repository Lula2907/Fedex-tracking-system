import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Aman");
});

const getFedExToken = async () => {
  try {
    const response = await axios.post(
      "https://apis-sandbox.fedex.com/oauth/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.API_KEY,
        client_secret: process.env.API_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error fetching FedEx token:",
      error.response?.data || error.message
    );
    throw new Error("Failed to authenticate with FedEx API");
  }
};

app.post("/track", async (req, res) => {
  try {
    const token = await getFedExToken();
    const input = req.body;

    const response = await axios.post(
      "https://apis-sandbox.fedex.com/track/v1/trackingnumbers",
      input,
      {
        headers: {
          "Content-Type": "application/json",
          "X-locale": "en_US",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
