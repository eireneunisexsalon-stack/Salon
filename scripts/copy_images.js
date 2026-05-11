const fs = require('fs');
const path = require('path');

const srcFemale = "C:\\Users\\kushw\\.gemini\\antigravity\\brain\\cb2e3728-4a8b-43b0-a6ea-9ac870bd4e5b\\female_stylist_1778445003865.png";
const destFemale = "D:\\Saloon\\public\\team_female.png";

const srcMale = "C:\\Users\\kushw\\.gemini\\antigravity\\brain\\cb2e3728-4a8b-43b0-a6ea-9ac870bd4e5b\\male_barber_1778445021722.png";
const destMale = "D:\\Saloon\\public\\team_male.png";

try {
  fs.copyFileSync(srcFemale, destFemale);
  fs.copyFileSync(srcMale, destMale);
  console.log("Images copied successfully!");
} catch (e) {
  console.error("Error copying images:", e);
}
