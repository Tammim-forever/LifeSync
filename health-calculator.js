// Health Calculation Functions
function calculateBMI(weight, height) {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return bmi.toFixed(1);
}

function getBMICategory(bmi) {
  bmi = parseFloat(bmi);
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

function calculateDailyCalories(age, weight, height, gender, activityLevel, weeklyActivityHours) {
  let bmr;
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }

  // Base multiplier from activity level
  const activityMultipliers = {
    'Sedentary': 1.2,
    'Lightly Active': 1.375,
    'Moderate': 1.55,
    'Very Active': 1.725,
    'Extremely Active': 1.9
  };

  let multiplier = activityMultipliers[activityLevel] || 1.55;

  // Adjust multiplier based on weekly activity hours (fine-tune)
  // Assuming average 30-60 min per session, so hours roughly correlate to sessions
  if (weeklyActivityHours < 1) {
    multiplier = Math.max(multiplier, 1.2);
  } else if (weeklyActivityHours < 3) {
    multiplier = Math.max(multiplier, 1.375);
  } else if (weeklyActivityHours < 5) {
    multiplier = Math.max(multiplier, 1.55);
  } else if (weeklyActivityHours < 7) {
    multiplier = Math.max(multiplier, 1.725);
  } else {
    multiplier = Math.max(multiplier, 1.9);
  }

  return Math.round(bmr * multiplier);
}

// Sleep hour needed based on age group
function getIdealSleep(age) {
  if (age < 18) return "8-10";
  if (age < 65) return "7-9";
  return "7-8";
}

// Water recommendation
function calculateWaterIntake(weight, activityLevel, weeklyActivityHours) {
  let baseIntake = weight * 0.033;

  if (activityLevel === 'Very Active' || activityLevel === 'Extremely Active' || weeklyActivityHours > 5) {
    baseIntake += weight * 0.01;
  }

  return baseIntake.toFixed(1);
}

// Protein recommendation
function calculateProteinNeeds(weight, healthGoal, activityLevel) {
  let baseProtein = weight * 0.8; // 0.8g per kg for general health

  if (healthGoal === 'Muscle Gain') {
    baseProtein = weight * 1.6; // 1.6g per kg for muscle building
  } else if (healthGoal === 'Weight Loss') {
    baseProtein = weight * 1.2; // 1.2g per kg for weight loss (preserve muscle)
  }

  // Adjust for activity level
  if (activityLevel === 'Very Active' || activityLevel === 'Extremely Active') {
    baseProtein *= 1.1; // 10% more for high activity
  }

  return Math.round(baseProtein);
}

// Exercise Recommendations
function getExerciseRecommendation(age, activityLevel, bmi, healthGoal, weeklyActivityHours, stressLevel) {
  let recommendation = {};

  recommendation.cardioMinutes = 150;
  recommendation.strengthDays = 2;

  if (age > 60) {
    recommendation.intensity = 'Moderate';
    recommendation.warning = 'Consult doctor before starting';
  } else if (age > 40) {
    recommendation.intensity = 'Moderate to Vigorous';
  } else {
    recommendation.intensity = 'Vigorous';
  }

  if (activityLevel === 'Sedentary' || activityLevel === 'Lightly Active') {
    recommendation.startingLevel = 'Light - Start gradually';
  }

  bmi = parseFloat(bmi);
  if (bmi > 30) {
    recommendation.lowImpact = true;
    recommendation.warning = 'Focus on low-impact activities like walking';
  }

  // Specific workout plans based on goal
  if (healthGoal === 'Weight Loss') {
    recommendation.workoutPlan = {
      cardio: '30-45 min brisk walking or cycling, 5 days/week',
      strength: 'Full body strength training 2-3 days/week: squats, push-ups, planks',
      flexibility: '10 min stretching daily'
    };
  } else if (healthGoal === 'Muscle Gain') {
    recommendation.workoutPlan = {
      cardio: '20-30 min light cardio, 2-3 days/week',
      strength: 'Split routine 4-5 days/week: chest/triceps, back/biceps, legs, shoulders',
      flexibility: 'Foam rolling and dynamic stretching before workouts'
    };
  } else {
    recommendation.workoutPlan = {
      cardio: '30 min moderate cardio, 3-4 days/week',
      strength: 'Full body or push/pull routine 2-3 days/week',
      flexibility: 'Yoga or stretching 2-3 days/week'
    };
  }

  // Adjust based on weekly hours
  if (weeklyActivityHours < 2) {
    recommendation.note = 'Start with shorter sessions and gradually increase duration.';
  } else if (weeklyActivityHours > 7) {
    recommendation.note = 'Ensure adequate rest days to prevent overtraining.';
  }

  // Adjust based on stress level
const stressTips = [];

  if (stressLevel === 'High') {
    stressTips.push('Include daily relaxation practices like meditation, deep breathing, or mindful breathing for 10-15 minutes.');
    recommendation.note = (recommendation.note || '') + ' With high stress, prioritize recovery and include stress-reducing activities.';
  } else if (stressLevel === 'Medium') {
    stressTips.push('Consider adding light yoga, stretching, or short nature walks to help manage tension.');
  } else {
    stressTips.push('Keep supporting your stress resilience with regular sleep, hydration, and gentle movement.');
  }

  if (stressLevel === 'High' && healthGoal === 'Weight Loss') {
    stressTips.push('Avoid overly restrictive dieting during high stress; focus on balanced, nourishing meals instead.');
  }

  if (stressLevel === 'High' && bmi > 25) {
    stressTips.push('Choose low-impact activities like walking and restorative yoga to protect joints while reducing stress.');
  }

  if (stressLevel === 'High' && bmi < 18.5) {
    stressTips.push('Prioritize nutrient-dense meals and gentle strength work to support recovery and healthy energy levels.');
  }

  if (stressLevel === 'Medium' && bmi > 25) {
    stressTips.push('Use stress reduction techniques to support sustainable weight and prevent emotional eating.');
  }

  recommendation.stressSupport = stressTips.join(' ');

  return recommendation;
}

// Meal Recommendations
function getMealRecommendations(healthGoal, bmi, weight, activityLevel, dailyCalories) {
  let meals = {};
  const proteinNeeds = calculateProteinNeeds(weight, healthGoal, activityLevel);

  if (healthGoal === 'Weight Loss') {
    meals.breakfast = `350-400 cal - High-protein oatmeal with eggs (${Math.round(proteinNeeds * 0.2)}g protein)`;
    meals.lunch = `400-450 cal - Grilled chicken salad (${Math.round(proteinNeeds * 0.25)}g protein)`;
    meals.dinner = `350-400 cal - Baked fish with veggies (${Math.round(proteinNeeds * 0.25)}g protein)`;
    meals.snacks = `100-150 cal - Greek yogurt or nuts (${Math.round(proteinNeeds * 0.1)}g protein)`;
    meals.note = `Aim for 300-500 cal daily deficit. Total daily protein: ${proteinNeeds}g`;
  } 
  else if (healthGoal === 'Muscle Gain') {
    meals.breakfast = `500-600 cal - Egg whites, whole grain toast, fruit (${Math.round(proteinNeeds * 0.2)}g protein)`;
    meals.lunch = `600-700 cal - Turkey breast, brown rice, broccoli (${Math.round(proteinNeeds * 0.3)}g protein)`;
    meals.dinner = `500-600 cal - Lean beef, sweet potato, salad (${Math.round(proteinNeeds * 0.3)}g protein)`;
    meals.snacks = `200-300 cal - Protein shake, cheese (${Math.round(proteinNeeds * 0.2)}g protein)`;
    meals.note = `Aim for 300-500 cal daily surplus. Total daily protein: ${proteinNeeds}g`;
  } 
  else {
    meals.breakfast = `400-500 cal - Whole grain cereal with milk and fruit (${Math.round(proteinNeeds * 0.2)}g protein)`;
    meals.lunch = `500-600 cal - Tuna sandwich, soup (${Math.round(proteinNeeds * 0.25)}g protein)`;
    meals.dinner = `400-500 cal - Pasta with meat sauce, salad (${Math.round(proteinNeeds * 0.25)}g protein)`;
    meals.snacks = `150-200 cal - Apple with peanut butter (${Math.round(proteinNeeds * 0.1)}g protein)`;
    meals.note = `Maintain balanced nutrition. Total daily protein: ${proteinNeeds}g`;
  }

  // Add macro breakdown
  const carbsPercent = healthGoal === 'Weight Loss' ? 40 : healthGoal === 'Muscle Gain' ? 50 : 45;
  const fatPercent = healthGoal === 'Weight Loss' ? 30 : 20;
  const proteinPercent = 100 - carbsPercent - fatPercent;

  meals.macros = {
    protein: `${Math.round(dailyCalories * proteinPercent / 400)}g (${proteinPercent}%)`,
    carbs: `${Math.round(dailyCalories * carbsPercent / 400)}g (${carbsPercent}%)`,
    fat: `${Math.round(dailyCalories * fatPercent / 900)}g (${fatPercent}%)`
  };

  return meals;
}

// Sleep Schedule
function getSleepSchedule(sleepHours, bedtimeStr) {
  const hours = parseInt(sleepHours);

  let bedHour = 22;
  let bedMinute = 0;

  if (bedtimeStr) {
    const parts = bedtimeStr.split(':');
    bedHour = parseInt(parts[0]);
    bedMinute = parseInt(parts[1]) || 0;
  }

  let wakeHour = bedHour + hours;
  let wakeMinute = bedMinute;

  if (wakeHour >= 24) {
    wakeHour -= 24;
  }

  const recommendation = hours >= 8
    ? 'Excellent rest window. Keep your bedtime consistent for better recovery.'
    : 'Try to maintain a regular sleep schedule and aim for more rest when possible.';

  return {
    bedtime: formatTime24To12(bedHour, bedMinute),
    wakeTime: formatTime24To12(wakeHour, wakeMinute),
    sleepHours: hours,
    recommendation,
    reason: hours >= 8
      ? 'Your sleep duration supports energy, focus, and recovery.'
      : 'Increasing your sleep by 30–60 minutes can improve overall recovery and mood.'
  };
}

function formatTime24To12(hour, minute) {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const displayMinute = minute < 10 ? '0' + minute : minute;
  return `${displayHour}:${displayMinute} ${period}`;
}


// BMI Algorithm and Routine Generation

function generatePersonalizedRoutine(formData) {

  const bmi = calculateBMI(formData.weight, formData.height);
  const category = getBMICategory(bmi);

  let effectiveGoal = formData.healthGoal;
  let note = "";

  // Goal adjustment based on BMI category
  if (category === "Underweight" && formData.healthGoal === "Weight Loss") {
    effectiveGoal = "Muscle Gain"; // Recommend healthy weight gain instead
    note = "⚠️ Based on your BMI, we recommend focusing on healthy weight gain rather than weight loss.";
  }

  if (category === "Normal weight" && formData.healthGoal === "Weight Loss") {
    effectiveGoal = "Stay Fit"; // Recommend maintaining healthy weight
    note = "⚠️ You already have a healthy BMI. A weight-loss plan may reduce your healthy balance. We recommend focusing on maintenance and fitness so you stay energized and preserve muscle.";
  }

  if ((category === "Overweight" || category === "Obese") && formData.healthGoal === "Muscle Gain") {
    effectiveGoal = "Weight Loss"; // Recommend weight loss first
    note = "⚠️ Your BMI is above the healthy range, so building muscle first may be harder and risk joint strain. We recommend weight loss first to improve body composition and make future muscle gain safer and more effective.";
  }

  // Calculate base daily calories (maintenance)
  const maintenanceCalories = calculateDailyCalories(
    formData.age,
    formData.weight,
    formData.height,
    formData.gender,
    formData.activityLevel,
    formData.weeklyActivityHours
  );

  let dailyCalories = maintenanceCalories;

  // Adjust calories based on effective goal
  if (effectiveGoal === "Weight Loss") {
    dailyCalories -= 500; // Deficit for weight loss
  } else if (effectiveGoal === "Muscle Gain") {
    dailyCalories += 500; // Surplus for muscle gain
  }
  // For "Stay Fit", keep as maintenance

  // Warning for low BMI
  let warning = "";
  if (category === "Underweight") {
    warning = "Your BMI indicates underweight. This may pose health risks. Please consult a healthcare professional for personalized advice.";
  }

  const exerciseRecommendation = getExerciseRecommendation(
    formData.age,
    formData.activityLevel,
    bmi,
    effectiveGoal,
    formData.weeklyActivityHours,
    formData.stressLevel
  );

  return {
    userInfo: formData,

    healthMetrics: {
      bmi: bmi,
      bmiCategory: category,
      selectedGoal: formData.healthGoal, // Keep original selection
      effectiveGoal: effectiveGoal, // What we're recommending
      note: note,
      warning: warning,
      stressLevel: formData.stressLevel,

      dailyCalories: Math.max(1200, dailyCalories), // Ensure minimum 1200 calories

      idealSleep: getIdealSleep(formData.age),
      waterIntake: calculateWaterIntake(formData.weight, formData.activityLevel, formData.weeklyActivityHours),

      reasons: {
        sleep: 'Consistent, quality sleep supports recovery, hormone balance, mental focus, and long-term weight stability.',
        food: 'A balanced meal plan helps you fuel workouts, preserve muscle, and meet your daily calorie and protein needs.',
        calories: effectiveGoal === 'Weight Loss'
          ? 'A moderate calorie deficit helps reduce body fat while preserving energy and healthy metabolic function.'
          : effectiveGoal === 'Muscle Gain'
          ? 'A slight calorie surplus supports muscle growth and recovery from training sessions.'
          : 'Calorie maintenance supports steady energy, stable weight, and healthy daily performance.',
        water: 'Staying hydrated improves digestion, metabolism, energy, and exercise recovery, especially with higher activity.'
      },

      exerciseRecommendation: exerciseRecommendation,
      stressSupport: exerciseRecommendation.stressSupport,
      sleepScore: calculateSleepScore(formData.sleepHours, getIdealSleep(formData.age)),
      activityScore: calculateActivityScore(formData.activityLevel, formData.weeklyActivityHours),
      healthScore: calculateHealthScore(formData, {
        bmiCategory: category,
        sleepHours: formData.sleepHours,
        waterIntake: calculateWaterIntake(formData.weight, formData.activityLevel, formData.weeklyActivityHours),
        weeklyActivityHours: formData.weeklyActivityHours,
        stressLevel: formData.stressLevel
      }),
      mealRecommendations: getMealRecommendations(
        effectiveGoal,
        bmi,
        formData.weight,
        formData.activityLevel,
        dailyCalories
      ),

      sleepSchedule: getSleepSchedule(
        formData.sleepHours,
        formData.bedtime
      ),
      maintenanceCalories: maintenanceCalories
    }
  };
}

// Storage
function saveFormData(formData) {
  localStorage.setItem('lifesyncFormData', JSON.stringify(formData));
}

function getFormData() {
  return JSON.parse(localStorage.getItem('lifesyncFormData'));
}

function calculateSleepScore(sleepHours, idealRange) {
  const actual = parseFloat(sleepHours);
  const [min, max] = idealRange.split('-').map(Number);
  if (actual >= min && actual <= max) return 100;
  const distance = actual < min ? min - actual : actual - max;
  return Math.max(40, Math.round(100 - distance * 15));
}

function calculateActivityScore(activityLevel, weeklyHours) {
  const targetHours = 7;
  const hourScore = Math.min(100, Math.round((Math.min(weeklyHours, targetHours) / targetHours) * 100));
  const levelBonus = activityLevel === 'Very Active' || activityLevel === 'Extremely Active' ? 10 : activityLevel === 'Moderate' ? 5 : 0;
  return Math.min(100, Math.max(40, hourScore + levelBonus));
}

function calculateHealthScore(userInfo, healthMetrics) {
  const bmiValues = {
    'Underweight': 75,
    'Normal weight': 100,
    'Overweight': 85,
    'Obese': 65
  };
  const bmiScore = bmiValues[healthMetrics.bmiCategory] || 80;
  const sleepScore = calculateSleepScore(userInfo.sleepHours, getIdealSleep(userInfo.age));
  const waterScore = Math.min(100, Math.round((healthMetrics.waterIntake / 2.5) * 100));
  const activityScore = calculateActivityScore(userInfo.activityLevel, userInfo.weeklyActivityHours);
  const stressScore = healthMetrics.stressLevel === 'Low' ? 100 : healthMetrics.stressLevel === 'Medium' ? 85 : 70;

  const score = Math.round(
    bmiScore * 0.28 +
    sleepScore * 0.22 +
    waterScore * 0.18 +
    activityScore * 0.2 +
    stressScore * 0.12
  );

  return {
    score: Math.min(100, Math.max(45, score)),
    label: getHealthScoreLabel(score)
  };
}

function getHealthScoreLabel(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Strong';
  if (score >= 60) return 'Balanced';
  return 'Needs Improvement';
}

function getBMIColorClass(category) {
  if (category === 'Underweight') return 'bmi-pill underweight';
  if (category === 'Normal weight') return 'bmi-pill normal';
  if (category === 'Overweight') return 'bmi-pill overweight';
  if (category === 'Obese') return 'bmi-pill obese';
  return 'bmi-pill';
}

function getFoodDetails(healthGoal, bmiCategory) {
  const common = {
    breakfast: {
      title: 'Protein Oatmeal Bowl',
      items: [
        '1 cup steel-cut oats',
        '2 egg whites or Greek yogurt',
        'Handful of berries',
        '1 tbsp chia seeds'
      ],
      image: 'https://images.unsplash.com/photo-1511689982419-6d0d075d5f94?auto=format&fit=crop&w=900&q=80'
    },
    lunch: {
      title: 'Lean Protein Salad',
      items: [
        'Grilled chicken or turkey breast',
        'Mixed greens and roasted vegetables',
        'Quinoa or brown rice',
        'Light lemon vinaigrette'
      ],
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=900&q=80'
    },
    dinner: {
      title: 'Balanced Fish or Lean Dinner',
      items: [
        'Baked salmon or white fish',
        'Steamed broccoli or asparagus',
        'Roasted sweet potato',
        'Leafy side salad'
      ],
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80'
    },
    snacks: {
      title: 'Smart Snacks',
      items: [
        'Greek yogurt with berries',
        'Handful of almonds or walnuts',
        'Sliced apple with peanut butter'
      ],
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80'
    }
  };

  if (healthGoal === 'Weight Loss') {
    common.breakfast.items = ['1 cup steel-cut oats', '1 boiled egg', 'Fresh berries', '1 tbsp flaxseed'];
    common.lunch.items = ['Grilled chicken salad', 'Cucumber & tomato', 'Quinoa', 'Light olive oil dressing'];
    common.dinner.items = ['Baked fish', 'Steamed green beans', 'Roasted cauliflower', 'Mixed greens'];
    common.snacks.items = ['Greek yogurt', 'Raw carrot sticks', 'A few almonds'];
  }

  if (healthGoal === 'Muscle Gain') {
    common.breakfast.items = ['3 egg omelet with spinach', '2 slices whole grain toast', 'Banana', 'Greek yogurt'];
    common.lunch.items = ['Turkey breast wrap', 'Brown rice', 'Roasted broccoli', 'Avocado slices'];
    common.dinner.items = ['Lean beef or turkey', 'Sweet potato', 'Steamed veggies', 'Side salad'];
    common.snacks.items = ['Protein shake', 'Cottage cheese', 'Trail mix'];
  }

  if (healthGoal === 'Stay Fit') {
    common.breakfast.items = ['Whole grain cereal', 'Low-fat milk', 'Mixed berries', 'Walnuts'];
    common.lunch.items = ['Tuna sandwich', 'Leafy green salad', 'Tomato slices', 'Light dressing'];
    common.dinner.items = ['Pasta with tomato sauce', 'Grilled chicken', 'Steamed vegetables', 'Side salad'];
    common.snacks.items = ['Apple slices', 'Peanut butter', 'Greek yogurt'];
  }

  if (bmiCategory === 'Underweight') {
    common.breakfast.items.push('Extra avocado or nut butter');
    common.lunch.items.push('Extra olive oil or seeds');
    common.dinner.items.push('Additional healthy fat source');
  }

  return common;
}

function buildWeeklyMealPlan(meals) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days.map(day => ({
    day,
    breakfast: meals.breakfast,
    lunch: meals.lunch,
    dinner: meals.dinner,
    snack: meals.snacks
  }));
}

function drawBarChart(canvasId, labels, values, colors) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);

  const width = rect.width;
  const height = rect.height;
  const maxValue = Math.max(...values, 100);
  const barWidth = Math.min(84, width / (values.length * 2.4));
  const spacing = barWidth * 1.8;
  const totalWidth = spacing * values.length;
  const startX = Math.max(24, (width - totalWidth) / 2);
  const baseY = height - 50;

  ctx.font = '600 14px Poppins, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(16, baseY);
  ctx.lineTo(width - 16, baseY);
  ctx.stroke();

  labels.forEach((label, index) => {
    const x = startX + index * spacing;
    const centerX = x + barWidth / 2;
    const barHeight = Math.round((values[index] / maxValue) * (height - 110));
    const y = baseY - barHeight;

    ctx.fillStyle = colors[index] || '#ff6b35';
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = '#334155';
    ctx.fillText(`${values[index]}%`, centerX, y - 12);

    ctx.fillStyle = '#64748b';
    ctx.fillText(label, centerX, baseY + 20);
  });
}
