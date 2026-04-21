// Health Calculation Functions

// Calculate BMI
function calculateBMI(weight, height) {
  // weight in kg, height in cm
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return bmi.toFixed(1);
}

// Get BMI Category
function getBMICategory(bmi) {
  bmi = parseFloat(bmi);
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

// Calculate Daily Calorie Needs (using Harris-Benedict equation)
function calculateDailyCalories(age, weight, height, gender, activityLevel) {
  let bmr;
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
  
  // Activity multipliers
  const activityMultipliers = {
    'Sedentary': 1.2,
    'Lightly Active': 1.375,
    'Moderate': 1.55,
    'Very Active': 1.725,
    'Extremely Active': 1.9
  };
  
  const multiplier = activityMultipliers[activityLevel] || 1.55;
  return Math.round(bmr * multiplier);
}

// Calculate Ideal Sleep
function getIdealSleep(age) {
  if (age < 18) return 8-10;
  if (age < 65) return 7-9;
  return 7-8;
}

// Calculate Water Intake (in liters)
function calculateWaterIntake(weight, activityLevel) {
  let baseIntake = weight * 0.033; // Basic: 33ml per kg
  
  if (activityLevel === 'Very Active' || activityLevel === 'Extremely Active') {
    baseIntake += weight * 0.01; // Add 10ml per kg for active people
  }
  
  return baseIntake.toFixed(1);
}

// Get Exercise Recommendations
function getExerciseRecommendation(age, activityLevel, bmi) {
  let recommendation = {};
  
  // Base minutes per week
  recommendation.cardioMinutes = 150;
  recommendation.strengthDays = 2;
  
  // Age adjustments
  if (age > 60) {
    recommendation.cardioMinutes = 150;
    recommendation.intensity = 'Moderate';
    recommendation.warning = 'Consult doctor before starting';
  } else if (age > 40) {
    recommendation.cardioMinutes = 150;
    recommendation.intensity = 'Moderate to Vigorous';
  } else {
    recommendation.cardioMinutes = 150;
    recommendation.intensity = 'Vigorous';
  }
  
  // Activity level adjustments
  if (activityLevel === 'Sedentary' || activityLevel === 'Lightly Active') {
    recommendation.startingLevel = 'Light - Start gradually';
  }
  
  // BMI adjustments
  bmi = parseFloat(bmi);
  if (bmi > 30) {
    recommendation.lowImpact = true;
    recommendation.warning = 'Focus on low-impact activities like swimming and walking';
  }
  
  return recommendation;
}

// Get Meal Recommendations
function getMealRecommendations(healthGoal, bmi, weight) {
  let meals = {};
  
  if (healthGoal === 'Weight Loss') {
    meals.breakfast = '350-400 cal - Protein + Fiber';
    meals.lunch = '400-450 cal - Lean protein + vegetables';
    meals.dinner = '350-400 cal - Light meal';
    meals.snacks = '100-150 cal - Fruits or nuts';
    meals.note = 'Aim for 300-500 cal daily deficit';
  } else if (healthGoal === 'Muscle Gain') {
    meals.breakfast = '500-600 cal - Eggs + Oats + Fruit';
    meals.lunch = '600-700 cal - Chicken + Rice + Veggies';
    meals.dinner = '500-600 cal - Protein rich meal';
    meals.snacks = '200-300 cal - Protein shakes + nuts';
    meals.note = 'Aim for 300-500 cal daily surplus';
  } else {
    meals.breakfast = '400-500 cal - Balanced meal';
    meals.lunch = '500-600 cal - Balanced meal';
    meals.dinner = '400-500 cal - Light meal';
    meals.snacks = '150-200 cal - Healthy snacks';
    meals.note = 'Maintain balanced nutrition';
  }
  
  return meals;
}

// Get Sleep Schedule Based on Bedtime
function getSleepSchedule(sleepHours, bedtimeStr) {
  const hours = parseInt(sleepHours);
  
  // Parse bedtime from HH:MM format
  let bedHour = 22;
  let bedMinute = 0;
  
  if (bedtimeStr) {
    const parts = bedtimeStr.split(':');
    bedHour = parseInt(parts[0]);
    bedMinute = parseInt(parts[1]) || 0;
  }
  
  // Calculate wake time by adding sleep hours to bedtime
  let wakeHour = bedHour + hours;
  let wakeMinute = bedMinute;
  
  // Handle day overflow
  if (wakeHour >= 24) {
    wakeHour -= 24;
  }
  
  // Format times
  const bedtime = formatTime24To12(bedHour, bedMinute);
  const wakeTime = formatTime24To12(wakeHour, wakeMinute);
  
  return {
    bedtime: bedtime,
    wakeTime: wakeTime,
    sleepHours: hours,
    recommendation: 'Maintain this consistent sleep schedule daily for better health and energy levels'
  };
}

function formatTime24To12(hour, minute) {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const displayMinute = minute < 10 ? '0' + minute : minute;
  return `${displayHour}:${displayMinute} ${period}`;
}

// Generate Personalized Routine
function generatePersonalizedRoutine(formData) {
  const routine = {
    userInfo: {
      age: formData.age,
      weight: formData.weight,
      height: formData.height,
      gender: formData.gender,
      activityLevel: formData.activityLevel,
      healthGoal: formData.healthGoal,
      sleepHours: formData.sleepHours,
      bedtime: formData.bedtime
    },
    
    healthMetrics: {
      bmi: calculateBMI(formData.weight, formData.height),
      bmiCategory: getBMICategory(calculateBMI(formData.weight, formData.height)),
      dailyCalories: calculateDailyCalories(formData.age, formData.weight, formData.height, formData.gender, formData.activityLevel),
      idealSleep: getIdealSleep(formData.age),
      waterIntake: calculateWaterIntake(formData.weight, formData.activityLevel),
      exerciseRecommendation: getExerciseRecommendation(formData.age, formData.activityLevel, calculateBMI(formData.weight, formData.height)),
      mealRecommendations: getMealRecommendations(formData.healthGoal, calculateBMI(formData.weight, formData.height), formData.weight),
      sleepSchedule: getSleepSchedule(formData.sleepHours, formData.bedtime)
    }
  };
  
  return routine;
}

// Save to LocalStorage
function saveFormData(formData) {
  localStorage.setItem('lifesyncFormData', JSON.stringify(formData));
}

// Get from LocalStorage
function getFormData() {
  return JSON.parse(localStorage.getItem('lifesyncFormData'));
}
