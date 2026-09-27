import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import User from "../models/User.js";

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const emailsToUpdate = [
    "omkarjadhav415523@gmail.com",
    "author@bookify.com",
    "author_1790173585886@bookify.com",
  ];

  for (const email of emailsToUpdate) {
    const res = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          isAuthor: true,
          hasAuthorProfile: true,
          accountCategory: "student_author",
          penName: email.includes("omkar") ? "Omkar Jadhav" : "Author",
        },
      },
      { new: true }
    );
    console.log(`Updated ${email}:`, res ? res.accountCategory : "Not found");
  }

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
