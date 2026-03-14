const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getModel = () => genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Check eligibility based on academic profile
const checkEligibility = async ({ gpa, entranceScore, programName, minGPA, minEntranceScore, eligibilityCriteria }) => {
  const model = getModel();
  const prompt = `
You are an expert university admissions AI system. Analyze this applicant's profile for the program "${programName}".

Applicant Data:
- GPA: ${gpa}/10
- Entrance Exam Score: ${entranceScore}/100
- 10th Percentage: ${gpa * 10}% (estimated)

Program Requirements:
- Minimum GPA Required: ${minGPA}/10
- Minimum Entrance Score: ${minEntranceScore}/100
- Additional Criteria: ${eligibilityCriteria || 'None specified'}

Respond ONLY in this exact JSON format:
{
  "eligible": true/false,
  "reason": "Brief, specific reason for eligibility or ineligibility",
  "recommendations": "What the applicant can improve if not eligible"
}
`;
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { eligible: false, reason: 'Unable to determine eligibility', recommendations: '' };
  } catch (err) {
    console.error('Gemini eligibility error:', err.message);
    return { eligible: gpa >= minGPA && entranceScore >= minEntranceScore, reason: 'Auto-assessed based on minimum criteria', recommendations: '' };
  }
};

// Score the candidate 0-100
const scoreCandidate = async ({ gpa, entranceScore, tenthPercentage, twelfthPercentage, programName, statement }) => {
  const model = getModel();
  const prompt = `
You are an expert university admissions scoring AI. Score this applicant for "${programName}" out of 100.

Academic Profile:
- GPA: ${gpa}/10
- Entrance Score: ${entranceScore}/100  
- 10th Percentage: ${tenthPercentage}%
- 12th Percentage: ${twelfthPercentage}%
- Personal Statement: "${statement || 'Not provided'}"

Scoring Weights:
- GPA: 35%
- Entrance Score: 30%
- 10th/12th scores: 20%  
- Personal Statement quality: 15%

Respond ONLY in this JSON format:
{
  "score": <number 0-100>,
  "breakdown": {
    "gpaScore": <0-35>,
    "entranceScore": <0-30>,
    "academicScore": <0-20>,
    "statementScore": <0-15>
  },
  "summary": "One sentence assessment of this candidate"
}
`;
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { score: Math.round((gpa * 3.5) + (entranceScore * 0.3)), breakdown: {}, summary: 'Auto-scored' };
  } catch (err) {
    console.error('Gemini scoring error:', err.message);
    return { score: Math.round((gpa * 3.5) + (entranceScore * 0.3)), breakdown: {}, summary: 'Auto-scored based on academic metrics' };
  }
};

// Detect fraud/inconsistencies in application
const detectFraud = async ({ gpa, entranceScore, tenthPercentage, twelfthPercentage, previousInstitution, programName }) => {
  const model = getModel();
  const prompt = `
You are a fraud detection AI for university admissions. Analyze this application for inconsistencies or suspicious patterns.

Application Data:
- Program Applied: ${programName}
- GPA: ${gpa}/10
- Entrance Score: ${entranceScore}/100
- 10th Percentage: ${tenthPercentage}%
- 12th Percentage: ${twelfthPercentage}%
- Previous Institution: ${previousInstitution || 'Not specified'}

Look for:
1. Inconsistencies between scores (e.g., very high GPA but very low entrance score)
2. Unrealistic grade combinations
3. Suspicious patterns

Respond ONLY in this JSON format:
{
  "riskScore": <number 0-100, where 0=no risk, 100=highest risk>,
  "riskLevel": "low/medium/high",
  "flags": ["list of specific concerns, empty array if none"],
  "recommendation": "Brief recommendation for admin"
}
`;
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { riskScore: 0, riskLevel: 'low', flags: [], recommendation: 'No anomalies detected' };
  } catch (err) {
    console.error('Gemini fraud error:', err.message);
    return { riskScore: 0, riskLevel: 'low', flags: [], recommendation: 'Manual review recommended' };
  }
};

// Predict admission yield (likelihood of accepting offer)
const predictYield = async ({ gpa, entranceScore, programName, aiScore }) => {
  const model = getModel();
  const prompt = `
You are an admission yield prediction AI. Predict the probability (0-100%) that this student will ACCEPT an admission offer.

Student Profile:
- Program: ${programName}
- GPA: ${gpa}/10
- Entrance Score: ${entranceScore}/100
- AI Admission Score: ${aiScore}/100

Consider factors like:
- Academic strength (higher scores = more options = may not accept)
- Program desirability
- Typical yield patterns

Respond ONLY in this JSON format:
{
  "yieldProbability": <number 0-100>,
  "confidence": "high/medium/low",
  "insight": "Brief insight about yield prediction"
}
`;
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { yieldProbability: 65, confidence: 'medium', insight: 'Moderate yield expected' };
  } catch (err) {
    console.error('Gemini yield error:', err.message);
    return { yieldProbability: 65, confidence: 'medium', insight: 'Moderate yield expected' };
  }
};

// Admission chatbot
const chat = async (userMessage, conversationHistory = [], contextData = "") => {
  const model = getModel();
  const systemContext = `
You are an AI admissions assistant for an AI-Enabled University Admissions Management System. 
Help students with questions about:
- Application process and requirements
- Program information and eligibility
- Document upload requirements
- Application status and timeline
- General admissions guidance

**Real-Time Database Context**:
${contextData}

Be helpful, professional, concise, and encouraging. Answer directly based on the Real-Time Database Context provided above. If the user asks about programs, list the specific ones available. If you don't know because it isn't in the context, guide students to check the portal or contact the admissions office.
Keep responses under 150 words.`;

  const prompt = [
    systemContext,
    ...conversationHistory,
    `User: ${userMessage}`
  ].join('\n\n');

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error('Gemini chat error:', err.message);
    return "I apologize, I'm having trouble responding right now. Please try again in a moment or contact our admissions office directly.";
  }
};

module.exports = { checkEligibility, scoreCandidate, detectFraud, predictYield, chat };
