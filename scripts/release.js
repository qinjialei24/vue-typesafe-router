const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJson.version;
}

function updateVersion(type) {
  const currentVersion = getCurrentVersion();
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  let newVersion;

  switch (type) {
    case 'patch':
      newVersion = `${major}.${minor}.${patch + 1}`;
      break;
    case 'minor':
      newVersion = `${major}.${minor + 1}.0`;
      break;
    case 'major':
      newVersion = `${major + 1}.0.0`;
      break;
    default:
      throw new Error('Invalid version type');
  }

  execSync(`npm version ${newVersion} --no-git-tag-version`);
  return newVersion;
}

function runTests() {
  console.log('Running tests...');
  execSync('pnpm run test', { stdio: 'inherit' });
}

function buildPackage() {
  console.log('Building package...');
  execSync('pnpm run build', { stdio: 'inherit' });
}

function commitPackageChanges() {
  const newVersion = getCurrentVersion();
  execSync('git add package.json');
  execSync(`git commit -m "Bump version to ${newVersion}"`);
  execSync(`git tag v${newVersion}`);
}

function publishToNpm() {
  console.log('Publishing to npm...');
  execSync('npm publish', { stdio: 'inherit' });
}

function release(type) {
  try {
    // 拉取最新的更改
    execSync('git pull');

    // 运行测试
    runTests();

    // 更新版本
    const newVersion = updateVersion(type);

    // 构建包
    buildPackage();

    // 提交 package.json 的更改
    commitPackageChanges();

    // 推送到 Git
    execSync('git push --follow-tags');

    // 发布到 npm
    publishToNpm();

    console.log(`Successfully released version v${newVersion}`);
    rl.close();
  } catch (error) {
    console.error('Release failed:', error.message);
    rl.close();
    process.exit(1);
  }
}

rl.question('Enter release type (patch/minor/major): ', (answer) => {
  if (['patch', 'minor', 'major'].includes(answer)) {
    release(answer);
  } else {
    console.log('Invalid release type. Please enter patch, minor, or major.');
    rl.close();
  }
});
