import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

const refreshTokens = new Set(); // store valid refresh tokens (better -> DB/Redis)

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    refreshTokens.add(refreshToken);

    // send refreshToken in httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    res.json({ 
      accessToken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(403).json({ message: "Refresh token invalid" });
  }

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(user.id);
    res.json({ accessToken: newAccessToken });
  });
};

export const logout = (req, res) => {
  const token = req.cookies.refreshToken;
  refreshTokens.delete(token);
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};
