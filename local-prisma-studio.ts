// dotenvを使って環境変数を読み込む
require('dotenv').config({ path: '.env.local' });

// prisma studioを実行
const { exec } = require('child_process');

exec('npx prisma studio', (error: any, stdout: any, stderr: any) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
