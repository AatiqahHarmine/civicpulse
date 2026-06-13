/**
 * Modular AI Severity Scorer.
 * Swap this mock with Gemini/OpenAI SDK calls when ready.
 */
exports.analyzeIssue = async (title, description, base64Image) => {
  let score = 3.5;
  const criticalWords = ['fire', 'spark', 'explosion', 'flooding', 'collapsed', 'wire', 'hazard', 'toxic'];
  const highWords = ['broken', 'leak', 'pothole', 'stench', 'blocked', 'accident', 'dark'];

  const content = `${title} ${description}`.toLowerCase();

  criticalWords.forEach(word => { if (content.includes(word)) score += 3.0; });
  highWords.forEach(word => { if (content.includes(word)) score += 1.5; });

  if (score > 10) score = 10;

  let severity = 'Low';
  if (score >= 4.0) severity = 'Medium';
  if (score >= 7.0) severity = 'High';
  if (score >= 9.0) severity = 'Critical';

  return { severity, score: parseFloat(score.toFixed(1)) };
};
