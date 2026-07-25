const SKILLS_DICT = [
  // Languages
  { name: "JavaScript", regex: /\bjavascript\b/i },
  { name: "TypeScript", regex: /\btypescript\b/i },
  { name: "Python", regex: /\bpython\b/i },
  { name: "Java", regex: /\bjava\b/i },
  { name: "C++", regex: /\bc\+\+\b/i },
  { name: "C#", regex: /\bc#\b/i },
  { name: "Go", regex: /\b(golang|go)\b/i },
  { name: "Ruby", regex: /\bruby\b/i },
  { name: "Rust", regex: /\brust\b/i },
  { name: "PHP", regex: /\bphp\b/i },
  { name: "Swift", regex: /\bswift\b/i },
  { name: "Kotlin", regex: /\bkotlin\b/i },
  { name: "SQL", regex: /\bsql\b/i },
  { name: "NoSQL", regex: /\bnosql\b/i },
  { name: "HTML", regex: /\bhtml5?\b/i },
  { name: "CSS", regex: /\bcss3?\b/i },
  
  // Frontend
  { name: "React", regex: /\breact(\.js)?\b/i },
  { name: "Angular", regex: /\bangular(\.js)?\b/i },
  { name: "Vue", regex: /\bvue(\.js)?\b/i },
  { name: "Next.js", regex: /\bnext(\.js)?\b/i },
  { name: "Redux", regex: /\bredux\b/i },
  { name: "Tailwind CSS", regex: /\btailwind(css)?\b/i },
  { name: "Bootstrap", regex: /\bbootstrap\b/i },
  { name: "Webpack", regex: /\bwebpack\b/i },
  { name: "Vite", regex: /\bvite\b/i },
  
  // Backend / Server
  { name: "Node.js", regex: /\bnode(\.js)?\b/i },
  { name: "Express.js", regex: /\bexpress(\.js)?\b/i },
  { name: "Django", regex: /\bdjango\b/i },
  { name: "Flask", regex: /\bflask\b/i },
  { name: "FastAPI", regex: /\bfastapi\b/i },
  { name: "Spring Boot", regex: /\bspring(\s?boot)?\b/i },
  { name: "NestJS", regex: /\bnest(\.js)?\b/i },
  { name: "GraphQL", regex: /\bgraphql\b/i },
  { name: "REST API", regex: /\brest(ful)?\s?api\b/i },
  
  // Databases
  { name: "MongoDB", regex: /\bmongodb\b/i },
  { name: "PostgreSQL", regex: /\bpostgres(ql)?\b/i },
  { name: "MySQL", regex: /\bmysql\b/i },
  { name: "Redis", regex: /\bredis\b/i },
  { name: "DynamoDB", regex: /\bdynamodb\b/i },
  { name: "Firebase", regex: /\bfirebase\b/i },
  
  // Cloud & DevOps
  { name: "Docker", regex: /\bdocker\b/i },
  { name: "Kubernetes", regex: /\b(kubernetes|k8s)\b/i },
  { name: "AWS", regex: /\b(aws|amazon\sweb\sservices)\b/i },
  { name: "Azure", regex: /\b(azure|microsoft\sazure)\b/i },
  { name: "GCP", regex: /\b(gcp|google\scloud)\b/i },
  { name: "Git", regex: /\bgit\b/i },
  { name: "CI/CD", regex: /\bci\/?cd\b/i },
  { name: "Jenkins", regex: /\bjenkins\b/i },
  { name: "Terraform", regex: /\bterraform\b/i },
  
  // Data Science & ML
  { name: "Machine Learning", regex: /\bmachine\slearning\b/i },
  { name: "Deep Learning", regex: /\bdeep\slearning\b/i },
  { name: "TensorFlow", regex: /\btensorflow\b/i },
  { name: "PyTorch", regex: /\bpy(torch)?\b/i },
  { name: "Pandas", regex: /\bpandas\b/i },
  { name: "NumPy", regex: /\bnumpy\b/i },
  { name: "Scikit-Learn", regex: /\b(scikit|sci-kit|sklearn)\b/i },
  
  // Concepts / Other
  { name: "Data Structures", regex: /\b(dsa|data\sstructures)\b/i },
  { name: "Algorithms", regex: /\balgorithms\b/i },
  { name: "System Design", regex: /\bsystem\sdesign\b/i },
  { name: "Microservices", regex: /\bmicroservices\b/i },
  { name: "Agile", regex: /\bagile\b/i },
  { name: "Scrum", regex: /\bscrum\b/i },
  { name: "Unit Testing", regex: /\b(unit\stesting|testing|jest|mocha|cypress)\b/i },
];

/**
 * Extracts key technical skills from a raw text block.
 * @param {string} text - The input text (e.g. JD or resume).
 * @returns {string[]} An array of identified skill names.
 */
const extractSkillsFromText = (text) => {
  if (!text) return [];
  const found = [];
  for (const skill of SKILLS_DICT) {
    if (skill.regex.test(text)) {
      found.push(skill.name);
    }
  }
  return found;
};

/**
 * Tokenizes text and counts term frequencies.
 */
const tokenizeAndCount = (text) => {
  if (!text) return {};
  // Normalize and split by whitespace (keeping key technical symbols)
  const words = text
    .toLowerCase()
    .replace(/[^\w\s\+\-\#\.]/g, "")
    .split(/\s+/);
  
  const counts = {};
  for (const word of words) {
    if (word && word.length > 2) {
      counts[word] = (counts[word] || 0) + 1;
    }
  }
  return counts;
};

/**
 * Computes the Cosine Similarity between two text blocks.
 */
const calculateCosineSimilarity = (text1, text2) => {
  const v1 = tokenizeAndCount(text1);
  const v2 = tokenizeAndCount(text2);
  
  const allWords = new Set([...Object.keys(v1), ...Object.keys(v2)]);
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;
  
  for (const word of allWords) {
    const val1 = v1[word] || 0;
    const val2 = v2[word] || 0;
    dotProduct += val1 * val2;
    mag1 += val1 * val1;
    mag2 += val2 * val2;
  }
  
  if (mag1 === 0 || mag2 === 0) return 0;
  return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
};

/**
 * Evaluates how well a student matches a Job Description (JD).
 * @param {string} jdText - The Job Description.
 * @param {object} student - The Student document containing skills & parsedResumeText.
 * @returns {object} Match metrics including percentage and skill overlap.
 */
const evaluateMatch = (jdText, student) => {
  const jdSkills = extractSkillsFromText(jdText);
  
  // Merge student's profile skills and extracted resume skills (case-insensitive deduplication)
  const studentSkillsSet = new Set();
  if (Array.isArray(student.skills)) {
    student.skills.forEach(s => studentSkillsSet.add(s.trim().toLowerCase()));
  }
  if (Array.isArray(student.extractedSkills)) {
    student.extractedSkills.forEach(s => studentSkillsSet.add(s.trim().toLowerCase()));
  }
  
  const matchedSkills = [];
  const missingSkills = [];
  
  jdSkills.forEach(skill => {
    if (studentSkillsSet.has(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });
  
  let skillOverlapScore = 0;
  if (jdSkills.length > 0) {
    skillOverlapScore = matchedSkills.length / jdSkills.length;
  } else {
    skillOverlapScore = 1; // Default to 1 if JD doesn't list explicit technical skills
  }
  
  const cosineSim = calculateCosineSimilarity(jdText, student.parsedResumeText || "");
  
  // Combine scores: 70% Skill Overlap + 30% Cosine Text Similarity
  const matchPercentage = Math.round((0.7 * skillOverlapScore + 0.3 * cosineSim) * 100);
  
  return {
    studentId: student._id,
    name: student.name,
    email: student.email,
    rollNo: student.rollNo,
    branch: student.branch,
    cgpa: student.cgpa,
    skills: student.skills,
    extractedSkills: student.extractedSkills,
    matchPercentage: Math.min(matchPercentage, 100),
    matchedSkills,
    missingSkills,
  };
};

module.exports = {
  extractSkillsFromText,
  calculateCosineSimilarity,
  evaluateMatch,
};
