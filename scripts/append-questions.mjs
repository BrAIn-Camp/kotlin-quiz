// Usage: node scripts/append-questions.mjs <chapterId> <newQuestionsJsonFile>
import { readFileSync, writeFileSync } from 'fs';

const [,, chapterId, newFile] = process.argv;
const base = `src/data/chapters/${chapterId}.json`;

const existing = JSON.parse(readFileSync(base, 'utf8'));
const additions = JSON.parse(readFileSync(newFile, 'utf8'));

const merged = [...existing, ...additions];
writeFileSync(base, JSON.stringify(merged, null, 2));
console.log(`✓ ${chapterId}: ${existing.length} + ${additions.length} = ${merged.length} questions`);
