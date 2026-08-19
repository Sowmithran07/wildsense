const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('1. Building frontend production bundle...');
execSync('npm run build', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });

console.log('2. Preparing GitHub Pages assets...');
const distPath = path.join(__dirname, 'frontend', 'dist');
fs.writeFileSync(path.join(distPath, '.nojekyll'), '');
fs.copyFileSync(path.join(__dirname, 'frontend', 'public', '404.html'), path.join(distPath, '404.html'));

console.log('3. Pushing gh-pages branch to GitHub...');
const remoteUrl = process.env.GH_TOKEN 
  ? `https://Sowmithran07:${process.env.GH_TOKEN}@github.com/Sowmithran07/wildsense.git` 
  : 'origin';
execSync('git init', { cwd: distPath });
execSync('git add -A', { cwd: distPath });
execSync('git commit -m "Deploy production build to GitHub Pages"', { cwd: distPath });
execSync('git branch -M gh-pages', { cwd: distPath });
execSync(`git push -f ${remoteUrl} gh-pages`, { cwd: distPath, stdio: 'inherit' });

console.log('✅ Successfully deployed gh-pages branch to GitHub!');
