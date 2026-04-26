#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function fail(message) {
  throw new Error(message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(`${label} must be an object`);
  }
}

function assertArray(value, label) {
  if (!Array.isArray(value)) {
    fail(`${label} must be an array`);
  }
}

function assertString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    fail(`${label} must be a non-empty string`);
  }
}

function assertNumber(value, label, min = 0, max = 100) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) {
    fail(`${label} must be a number between ${min} and ${max}`);
  }
}

function uniqueBy(items, getKey, label) {
  const seen = new Set();
  for (const item of items) {
    const key = getKey(item);
    if (seen.has(key)) {
      fail(`${label} contains duplicate key: ${key}`);
    }
    seen.add(key);
  }
}

function combinations(axes, index = 0, parts = [], result = []) {
  if (index === axes.length) {
    result.push(parts.join("_"));
    return result;
  }

  combinations(axes, index + 1, [...parts, axes[index].lowCode], result);
  combinations(axes, index + 1, [...parts, axes[index].highCode], result);
  return result;
}

function validateConfig(config) {
  assertObject(config, "config");
  assertObject(config.meta, "meta");
  assertString(config.meta.title, "meta.title");
  assertArray(config.axes, "axes");
  assertArray(config.questions, "questions");
  assertArray(config.scoring, "scoring");
  assertArray(config.personas, "personas");

  if (config.axes.length < 2 || config.axes.length > 5) {
    fail("axes length must be between 2 and 5");
  }

  uniqueBy(config.axes, (axis) => axis.key, "axes");
  const axisKeys = new Set(config.axes.map((axis) => axis.key));

  for (const [index, axis] of config.axes.entries()) {
    assertString(axis.key, `axes[${index}].key`);
    assertString(axis.name, `axes[${index}].name`);
    assertString(axis.lowCode, `axes[${index}].lowCode`);
    assertString(axis.highCode, `axes[${index}].highCode`);
    assertString(axis.lowLabel, `axes[${index}].lowLabel`);
    assertString(axis.highLabel, `axes[${index}].highLabel`);
    assertNumber(axis.threshold, `axes[${index}].threshold`);
    if (axis.lowCode === axis.highCode) {
      fail(`axis ${axis.key} lowCode and highCode must differ`);
    }
  }

  if (config.questions.length === 0) {
    fail("questions must not be empty");
  }

  uniqueBy(config.questions, (question) => question.id, "questions");
  const questions = new Map(config.questions.map((question) => [question.id, question]));

  for (const [index, question] of config.questions.entries()) {
    assertString(question.id, `questions[${index}].id`);
    assertString(question.title, `questions[${index}].title`);
    if (!["single", "allocation"].includes(question.type)) {
      fail(`questions[${index}].type must be "single" or "allocation"`);
    }
    assertArray(question.options, `questions[${index}].options`);
    if (question.options.length < 2) {
      fail(`question ${question.id} must have at least 2 options`);
    }
    uniqueBy(question.options, (option) => option.key, `question ${question.id} options`);
    for (const [optionIndex, option] of question.options.entries()) {
      assertString(option.key, `question ${question.id} options[${optionIndex}].key`);
      assertString(option.label, `question ${question.id} options[${optionIndex}].label`);
    }
    if (question.type === "allocation") {
      assertNumber(question.total, `question ${question.id}.total`, 1, 1000);
    }
  }

  const scoredQuestions = new Set();
  const scoredAxes = new Set();

  for (const [index, rule] of config.scoring.entries()) {
    assertString(rule.questionId, `scoring[${index}].questionId`);
    assertString(rule.axisKey, `scoring[${index}].axisKey`);
    assertNumber(rule.weight, `scoring[${index}].weight`, 0.0001, 1000);
    assertObject(rule.optionScores, `scoring[${index}].optionScores`);

    const question = questions.get(rule.questionId);
    if (!question) {
      fail(`scoring[${index}] references missing question: ${rule.questionId}`);
    }
    if (!axisKeys.has(rule.axisKey)) {
      fail(`scoring[${index}] references missing axis: ${rule.axisKey}`);
    }

    for (const option of question.options) {
      assertNumber(
        rule.optionScores[option.key],
        `scoring for question ${question.id}, axis ${rule.axisKey}, option ${option.key}`
      );
    }

    scoredQuestions.add(rule.questionId);
    scoredAxes.add(rule.axisKey);
  }

  for (const question of config.questions) {
    if (!scoredQuestions.has(question.id)) {
      fail(`question ${question.id} has no scoring rule`);
    }
  }

  for (const axis of config.axes) {
    if (!scoredAxes.has(axis.key)) {
      fail(`axis ${axis.key} has no scoring rule`);
    }
  }

  const expectedKeys = combinations(config.axes);
  const expectedKeySet = new Set(expectedKeys);
  const personaKeySet = new Set(config.personas.map((persona) => persona.key));

  if (config.personas.length !== expectedKeys.length) {
    fail(`personas length must be ${expectedKeys.length} for ${config.axes.length} axes`);
  }

  for (const key of expectedKeys) {
    if (!personaKeySet.has(key)) {
      fail(`missing persona key: ${key}`);
    }
  }

  uniqueBy(config.personas, (persona) => persona.key, "personas");
  for (const [index, persona] of config.personas.entries()) {
    assertString(persona.key, `personas[${index}].key`);
    if (!expectedKeySet.has(persona.key)) {
      fail(`unexpected persona key: ${persona.key}`);
    }
    assertObject(persona.axisSides, `personas[${index}].axisSides`);
    for (const axis of config.axes) {
      if (!["low", "high"].includes(persona.axisSides[axis.key])) {
        fail(`persona ${persona.key} axisSides.${axis.key} must be "low" or "high"`);
      }
    }
    assertString(persona.name, `personas[${index}].name`);
    assertString(persona.description, `personas[${index}].description`);
    assertString(persona.report, `personas[${index}].report`);
  }

  return {
    axisCount: config.axes.length,
    questionCount: config.questions.length,
    scoringRuleCount: config.scoring.length,
    personaCount: config.personas.length
  };
}

if (require.main === module) {
  const configPath = process.argv[2];
  if (!configPath) {
    console.error("Usage: node validate_config.js <config.json>");
    process.exit(2);
  }

  try {
    const summary = validateConfig(readJson(path.resolve(configPath)));
    console.log(JSON.stringify({ ok: true, ...summary }, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { validateConfig };
