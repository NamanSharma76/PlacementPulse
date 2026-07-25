const { evaluateMatch } = require("../utils/matchingEngine.util");

// Mock Job Description
const MOCK_JD = `
We are looking for a Senior React Developer to join our team. 
Key requirements:
- Strong experience with JavaScript and TypeScript.
- Hands-on building backend APIs with Node.js and Express.js.
- Database management with MongoDB.
- Containerization using Docker is a big plus.
`;

// Mock Candidates
const MOCK_CANDIDATE_A = {
  _id: "60d5ec499b19e222a0000001",
  name: "Alice Johnson",
  email: "alice@gmail.com",
  rollNo: "2K22/CSE/001",
  branch: "CSE",
  cgpa: 9.2,
  skills: ["React", "JavaScript", "HTML", "CSS"],
  extractedSkills: ["Node.js", "MongoDB", "Git"],
  parsedResumeText: "Alice Johnson. Software Engineer with strong experience in JavaScript, React web apps, Node.js REST APIs, and MongoDB database storage. Passionate about frontend layouts."
};

const MOCK_CANDIDATE_B = {
  _id: "60d5ec499b19e222a0000002",
  name: "Bob Smith",
  email: "bob@gmail.com",
  rollNo: "2K22/ME/020",
  branch: "ME",
  cgpa: 7.8,
  skills: ["Python", "Django", "SQL"],
  extractedSkills: ["Git"],
  parsedResumeText: "Bob Smith. Mechanical Engineering student. Proficient in Python scripting, Django web framework, and SQL databases. Basic Git version control."
};

function runTest() {
  console.log("🧪 RUNNING RAG MATCHING ENGINE UNIT VERIFICATION TEST\n");
  console.log("--- Job Description ---");
  console.log(MOCK_JD.trim());
  console.log("-----------------------\n");

  console.log("Evaluating Candidate A (Alice Johnson)...");
  const resultA = evaluateMatch(MOCK_JD, MOCK_CANDIDATE_A);
  console.log("Result A:", {
    name: resultA.name,
    matchPercentage: `${resultA.matchPercentage}%`,
    matchedSkills: resultA.matchedSkills,
    missingSkills: resultA.missingSkills,
  });

  console.log("\nEvaluating Candidate B (Bob Smith)...");
  const resultB = evaluateMatch(MOCK_JD, MOCK_CANDIDATE_B);
  console.log("Result B:", {
    name: resultB.name,
    matchPercentage: `${resultB.matchPercentage}%`,
    matchedSkills: resultB.matchedSkills,
    missingSkills: resultB.missingSkills,
  });

  // Verify that Alice has a significantly higher score than Bob
  if (resultA.matchPercentage > resultB.matchPercentage && resultA.matchPercentage >= 50) {
    console.log("\n🎉 SUCCESS: Matching engine scores candidates logically! Alice scored higher due to skill overlap.");
    process.exit(0);
  } else {
    console.error("\n❌ FAILED: Matching engine logic yielded unexpected scores.");
    process.exit(1);
  }
}

runTest();
