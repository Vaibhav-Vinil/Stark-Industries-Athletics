/* Seed script for one admin account with tracker entries */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const User = require("../models/user");

dotenv.config();

const ensureEnv = () => {
  if (!process.env.MONGO_URL || !process.env.SECRET_KEY) {
    throw new Error("Missing MONGO_URL or SECRET_KEY in backend .env");
  }
};

const today = new Date().toISOString().split("T")[0];

const makeExerciseHash = (name) => {
  return `${crypto.createHash("sha1").update(name).digest("hex")}*${today}`;
};

const adminSeedPayload = {
  username: "admin",
  email: "admin@avengersprotocol.com",
  phone: "9999999999",
  password: "Admin@123",
  isAdmin: true,
  preferences: ["High Protein", "Low Sugar", "Low Sodium", "Mediterranean"],
  restrictions: ["Peanuts", "Shellfish"],
  favoriteMenuItems: [
    { location: "Windsor", itemName: "Grilled Chicken Bowl" },
    { location: "Ford", itemName: "Greek Yogurt Parfait" }
  ],
  foods: [
    {
      foodName: "Protein Oats Bowl",
      calories: 420,
      fat: 9,
      protein: 27,
      carbohydrates: 58,
      servings: 1,
      servingSize: "1 bowl",
      mealType: "Breakfast",
      hash: `${crypto.createHash("sha1").update("Protein Oats Bowl").digest("hex")}${Math.floor(Date.now() / 1000)}`
    },
    {
      foodName: "Chicken Rice Meal",
      calories: 610,
      fat: 14,
      protein: 48,
      carbohydrates: 70,
      servings: 1,
      servingSize: "1 plate",
      mealType: "Lunch",
      hash: `${crypto.createHash("sha1").update("Chicken Rice Meal").digest("hex")}${Math.floor(Date.now() / 1000) + 1}`
    },
    {
      foodName: "Salmon Quinoa Plate",
      calories: 540,
      fat: 18,
      protein: 42,
      carbohydrates: 49,
      servings: 1,
      servingSize: "1 plate",
      mealType: "Dinner",
      hash: `${crypto.createHash("sha1").update("Salmon Quinoa Plate").digest("hex")}${Math.floor(Date.now() / 1000) + 2}`
    },
    {
      foodName: "Almond Yogurt Cup",
      calories: 220,
      fat: 8,
      protein: 12,
      carbohydrates: 22,
      servings: 1,
      servingSize: "1 cup",
      mealType: "Snack",
      hash: `${crypto.createHash("sha1").update("Almond Yogurt Cup").digest("hex")}${Math.floor(Date.now() / 1000) + 3}`
    }
  ],
  lowLevelNutritionGoals: {
    calories: "2400",
    protein: "170",
    carbohydrates: "260",
    fat: "75"
  },
  highLevelNutritionGoals: [
    "Maintain lean muscle mass",
    "Keep body fat under control",
    "Hit hydration and protein goals daily"
  ],
  currentFoodPlan: [
    "Breakfast: Protein oats + fruit",
    "Lunch: Lean protein + complex carbs",
    "Dinner: Fish/chicken + vegetables",
    "Snack: Greek yogurt + nuts"
  ],
  favoriteFoodItems: ["Chicken Rice Meal", "Salmon Quinoa Plate", "Protein Oats Bowl"],
  liftingLog: [
    {
      exerciseName: "Bench Press",
      sets: 4,
      reps: 8,
      time: 0,
      exerciseType: "Weight Lifting",
      hash: makeExerciseHash("Bench Press")
    }
  ],
  cardioLog: [
    {
      exerciseName: "Treadmill Run",
      sets: "N/A",
      reps: "N/A",
      time: 25,
      exerciseType: "Cardio",
      hash: makeExerciseHash("Treadmill Run")
    }
  ],
  otherExerciseLog: [
    {
      exerciseName: "Mobility Circuit",
      sets: "N/A",
      reps: "N/A",
      time: 15,
      exerciseType: "Other",
      hash: makeExerciseHash("Mobility Circuit")
    }
  ],
  favoriteExercises: ["Bench Press", "Treadmill Run", "Mobility Circuit"],
  lowLevelFitnessGoals: [
    {
      missionName: "Avenger Base Conditioning",
      weeklyWorkoutTarget: 5,
      dailyWaterTarget: 3200
    }
  ],
  highLevelFitnessGoals: [
    "Build strength and stamina",
    "Improve conditioning for high-intensity scenarios",
    "Train at least 5 sessions per week"
  ],
  currentWorkoutPlan: [
    "Mon: Upper body strength",
    "Tue: Cardio intervals",
    "Wed: Mobility and core",
    "Thu: Lower body strength",
    "Fri: Full-body conditioning"
  ],
  physicalActivityRestrictions: [
    {
      activityLevel: "Very Active",
      lifestyle: "Busy"
    }
  ],
  workdayRange: ["09:00", "18:00"],
  healthQuestionnaireAnswers: [
    { question: "Injuries", answer: "No major injuries" },
    { question: "Training preference", answer: "Strength + conditioning" },
    { question: "Recovery quality", answer: "Good" }
  ],
  currentHealthPlan: [
    "Sleep 7-8 hours",
    "Hydration minimum 3.2L daily",
    "Light mobility after each training session"
  ],
  waterIntakeLog: [
    { intake: 900, date: today },
    { intake: 700, date: today },
    { intake: 650, date: today },
    { intake: 950, date: today }
  ],
  weightLog: [
    { weight: 78, date: today },
    { weight: 78.2, date: "2026-04-08" },
    { weight: 77.9, date: "2026-04-09" }
  ],
  sleepLog: [
    { length: 7.5, date: today },
    { length: 7.2, date: "2026-04-08" },
    { length: 8.0, date: "2026-04-09" }
  ],
  supplementLog: [
    { supplement: "Whey Protein", amount: "1 scoop", date: today },
    { supplement: "Creatine", amount: "5g", date: today },
    { supplement: "Omega-3", amount: "1 capsule", date: today }
  ],
  friends: ["captain.rogers", "natasha.romanoff", "bruce.banner"],
  goals: [
    "Complete all weekly workouts",
    "Maintain daily hydration target",
    "Average at least 160g protein per day"
  ],
  favoriteExercise: "Bench Press",
  favoriteFood: "Chicken Rice Meal",
  optInRated: true,
  optInSaved: true
};

const seedAdmin = async () => {
  try {
    ensureEnv();
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const encryptedPassword = CryptoJS.AES.encrypt(
      adminSeedPayload.password,
      process.env.SECRET_KEY
    ).toString();

    const updatePayload = {
      ...adminSeedPayload,
      password: encryptedPassword
    };

    const existing = await User.findOne({
      $or: [
        { username: adminSeedPayload.username },
        { email: adminSeedPayload.email },
        { phone: adminSeedPayload.phone }
      ]
    });

    if (existing) {
      await User.findByIdAndUpdate(existing._id, { $set: updatePayload }, { new: true });
      console.log(`Updated existing admin account: ${adminSeedPayload.username}`);
    } else {
      await User.create(updatePayload);
      console.log(`Created admin account: ${adminSeedPayload.username}`);
    }

    console.log("Admin seed completed.");
  } catch (error) {
    console.error("Admin seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedAdmin();
