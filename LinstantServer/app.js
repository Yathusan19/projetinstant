import express from "express";
import multer, { diskStorage } from "multer";
import {  resolve } from "path";
import { existsSync, mkdirSync } from "fs";
import mongoose from "mongoose";
import User from "./src/user.schema.js";
import bodyParser from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Event from "./src/event.schema.js";
import Image from "./src/image.schema.js";

const app = express();

app.use(bodyParser.json());
const JWT_KEY = "instant_key_943";

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/instant", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB database");
});

const uploadsDir = resolve("uploads");
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir);
}

const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use("/images", express.static(uploadsDir));

app.post("/uploads", upload.array("images"), async (req, res) => {
  const token = req.headers.authorization;
  console.log("req.body",req.body)
  const decodedToken = jwt.verify(token, JWT_KEY);
  const { name, startDate, endDate, description } = req.body;
  const images = await Image.insertMany(
    req.files.map((file) => {
      return { name: file.filename, user: decodedToken.userId };
    })
  );
  const newEvent = new Event({
    name,
    startDate,
    endDate,
    description,
    user: decodedToken.userId,
    images: images,
  });
  await newEvent.save();

  res.status(200).send(newEvent);
});

app.get('/events', async (req, res) => {
  let userId;
  const token = req.headers.authorization;
  if (token) {
    try{
      const decodedToken = jwt.verify(token, JWT_KEY);
      userId = decodedToken.userId;
    }catch(e){
      res.status(400).send("Token invalide")
    }
  }

  let events;
  if (userId) {
    events = await Event.find({ user: userId }).populate('images').sort({createdAt:-1});
  } else {
    events = await Event.find().populate('images').sort({createdAt:-1});
  }

  res.status(200).send(events);
})

app.delete("/event/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const event = await Event.findById(eventId);
  if (event) {
    const imageIds = event.images;
    await Image.deleteMany({ _id: { $in: imageIds } });
    await Event.deleteOne({ _id: eventId });
    res.status(200).send("Suppression de l'evenement effectué avec succes");
  } else {
    res.status(404).send("Evenement introuvable");
  }
  console.log("eventId", eventId);
});

app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Check if the email is already used
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email déja utilisé" );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Create and return a JWT token
    const token = jwt.sign({ userId: newUser._id }, JWT_KEY);
    res.status(200).send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send( "Internal Server Error" );
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!user || !isPasswordValid) {
      return res.status(401).send( "Vos informations de connexion sont erronés" );
    }
    const token = jwt.sign({ userId: user._id }, JWT_KEY);
    const verify = jwt.verify(token, JWT_KEY);
    console.log("verify",verify)
    res.status(200).send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("Votre compte est introuvable, verifier le mail!");
    }

    const resetToken = jwt.sign({ userId: user._id }, JWT_KEY, {
      expiresIn: "1h",
    });
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour in milliseconds
    await user.save();
    //normally we should send a reset token through email  but we have no mail server
    res.status(200).send({ resetToken });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.post("/reset-password", async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    // Decode the reset token
    try {
      const decodedToken = jwt.verify(resetToken, JWT_KEY);
      const user = await User.findOne({
        _id: decodedToken.userId,
        resetToken,
        resetTokenExpiry: { $gt: Date.now() },
      });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();

      res.status(200).send({ message: "Password reset successful" });
      if (!user) {
        return res
          .status(400)
          .send({ error: "Invalid or expired reset token" });
      }
    } catch (e) {
      return res.status(403).send("token expired");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error" );
  }
});

app.get("/images", async (req, res) => {
  let userId;
  const token = req.headers.authorization;
  if (token) {
    try{
      const decodedToken = jwt.verify(token, JWT_KEY);
      userId = decodedToken.userId;
    }catch(e){
      res.status(400).send("Token invalide")
    }
  }

  let allImages;
  if (userId) {
    allImages = await Image.find({ user: userId });
  } else {
    allImages = await Image.find();
  }

  res.status(200).send(allImages);
});


app.patch('/image/:imageId/:likes', async (req, res) => {
  await Image.updateOne({_id:req.params.imageId},{likeCount:+req.params.likes})
  res.status(200).send('liked')
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
