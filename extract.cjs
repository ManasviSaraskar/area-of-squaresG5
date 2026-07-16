const fs = require('fs');
const content = fs.readFileSync('C:/Users/user/.gemini/antigravity-ide/brain/d6fdf052-7c42-48c3-87c0-36f3ced3864f/.system_generated/steps/262/content.md', 'utf-8');
const strings = content.match(/"[a-zA-Z ,.!?'’]{30,}"/g) || [];
console.log(strings.join('\n'));
