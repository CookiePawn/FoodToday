/* eslint-disable */
const child_process = require('child_process');
const fs = require('fs');
const util = require('util');
const path = require('path');

(async () => {
  const exec = util.promisify(child_process.exec);

  try {
    // 라이선스 정보 생성
    const { stdout, stderr } = await exec('npx react-native-oss-license --json --only-direct-dependency');

    if (stderr) {
      console.error('[Export License] LICENSE EXPORT FAILED: ', stderr);
      return;
    }

    // JSON 파싱
    const rawLicenses = JSON.parse(stdout);

    // package.json에서 의존성 정보 가져오기
    const packageJson = require('../package.json');
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

    // 라이선스 정보를 License 컴포넌트에서 사용할 수 있는 형식으로 변환
    const formattedLicenses = Object.entries(dependencies).map(([packageName, version]) => {
      const licenseInfo = rawLicenses[packageName] || {};
      
      return {
        name: packageName,
        version: version.replace('^', ''),
        license: licenseInfo.licenses || 'MIT',
        description: licenseInfo.description || 'N/A',
        repository: licenseInfo.repository?.url || 'N/A'
      };
    });

    // JSON 파일 저장 경로
    const jsonFilePath = path.join(__dirname, '../src/screens/License/licenses.json');

    // JSON 파일로 저장
    fs.writeFileSync(jsonFilePath, JSON.stringify(formattedLicenses, null, 2));

    // License 컴포넌트 파일 경로
    const licenseComponentPath = path.join(__dirname, '../src/screens/License/License.tsx');

    // License 컴포넌트 파일 읽기
    let licenseComponent = fs.readFileSync(licenseComponentPath, 'utf8');

    // 라이선스 배열을 import 문으로 교체
    const licensesRegex = /const licenses = \[([\s\S]*?)\];/;
    const newLicensesString = `import licenses from './licenses.json';\n\nconst License = () => {`;
    licenseComponent = licenseComponent.replace(licensesRegex, newLicensesString);

    // 파일 쓰기
    fs.writeFileSync(licenseComponentPath, licenseComponent);

    console.log('[Export License] JSON FILE CREATED: ', jsonFilePath);
    console.log('[Export License] COMPONENT UPDATED: ', licenseComponentPath);
  } catch (error) {
    console.error('[Export License] ERROR: ', error);
  }
})(); 