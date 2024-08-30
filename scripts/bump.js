const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function exec(command) {
  execSync(command, { stdio: 'inherit' });
}

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  return packageJson.version;
}

function updateVersion(type) {
  exec(`npm version ${type} --no-git-tag-version`);
}

function commitPackageChanges() {
  const newVersion = getCurrentVersion();
  const commitMessage = `bump version to v${newVersion}`;
  try {
    exec('git add package.json');
    exec(`git commit -m "${commitMessage}"`);
  } catch (error) {
    console.log('No changes to package.json needed.');
  }
}

function bumpVersion(type) {
  try {
    updateVersion(type);
    commitPackageChanges();
    const newVersion = getCurrentVersion();
    console.log(`Successfully bumped version to v${newVersion}`);
  } catch (error) {
    console.error('Version bump failed:', error.message);
  }
}

rl.question('Enter version type to bump (patch/minor/major): ', (type) => {
  if (['patch', 'minor', 'major'].includes(type)) {
    bumpVersion(type);
  } else {
    console.log('Invalid version type. Please enter patch, minor, or major.');
  }
  rl.close();
});