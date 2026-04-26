#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { validateConfig } = require("./validate_config");

function fail(message) {
  throw new Error(message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function allocationTotal(answer) {
  return Object.values(answer).reduce((total, value) => total + Number(value), 0);
}

function getQuestion(config, questionId) {
  const question = config.questions.find((item) => item.id === questionId);
  if (!question) {
    fail(`missing question: ${questionId}`);
  }
  return question;
}

function scoreRule(config, answers, rule) {
  const question = getQuestion(config, rule.questionId);
  const answer = answers[rule.questionId];

  if (question.type === "allocation") {
    if (!answer || typeof answer !== "object" || Array.isArray(answer)) {
      fail(`answer for ${question.id} must be an allocation object`);
    }

    const total = allocationTotal(answer);
    if (total !== question.total) {
      fail(`answer for ${question.id} must sum to ${question.total}; got ${total}`);
    }

    return (
      question.options.reduce((sum, option) => {
        const value = Number(answer[option.key]);
        if (!Number.isFinite(value)) {
          fail(`answer for ${question.id}.${option.key} must be numeric`);
        }
        return sum + value * rule.optionScores[option.key];
      }, 0) / total
    );
  }

  if (!question.options.some((option) => option.key === answer)) {
    fail(`answer for ${question.id} must be one of its option keys`);
  }

  return rule.optionScores[answer];
}

function calculateAxisScore(config, answers, axis) {
  const rules = config.scoring.filter((rule) => rule.axisKey === axis.key);
  const totalWeight = rules.reduce((sum, rule) => sum + rule.weight, 0);
  if (totalWeight <= 0) {
    fail(`axis ${axis.key} has no positive scoring weight`);
  }

  const weightedScore = rules.reduce(
    (sum, rule) => sum + scoreRule(config, answers, rule) * rule.weight,
    0
  );

  return Math.round((weightedScore / totalWeight) * 100) / 100;
}

function calculatePersona(config, answers) {
  validateConfig(config);

  const scores = Object.fromEntries(
    config.axes.map((axis) => [axis.key, calculateAxisScore(config, answers, axis)])
  );
  const axisSides = Object.fromEntries(
    config.axes.map((axis) => [axis.key, scores[axis.key] >= axis.threshold ? "high" : "low"])
  );
  const key = config.axes
    .map((axis) => (axisSides[axis.key] === "high" ? axis.highCode : axis.lowCode))
    .join("_");
  const persona = config.personas.find((item) => item.key === key);

  if (!persona) {
    fail(`missing persona for calculated key: ${key}`);
  }

  return {
    key,
    scores,
    axisSides,
    persona
  };
}

if (require.main === module) {
  const [configPath, answersPath] = process.argv.slice(2);
  if (!configPath || !answersPath) {
    console.error("Usage: node calculate_persona.js <config.json> <answers.json>");
    process.exit(2);
  }

  try {
    const result = calculatePersona(readJson(path.resolve(configPath)), readJson(path.resolve(answersPath)));
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { calculatePersona };
