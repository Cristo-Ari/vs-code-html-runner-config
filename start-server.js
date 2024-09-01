const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function startLiveServer(htmlDirectoryPath, serverPort) {
    console.log(`Live Server запущен на порту ${serverPort} для директории ${htmlDirectoryPath}`);

    const liveServerCommand = `npx live-server "${htmlDirectoryPath}" --port=${serverPort} --no-browser`;
    exec(liveServerCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Ошибка при запуске Live Server: ${error.message}`);
            return;
        }
        console.log(`Вывод Live Server: ${stdout}`);
        if (stderr) {
            console.error(`Ошибка Live Server: ${stderr}`);
        }
    });
}

function updateServerStatusFile(filePath, serverAddress) {
    setInterval(() => {
        const currentTimeInMilliseconds = Date.now().toString();
        const statusContent = `${serverAddress}\n${currentTimeInMilliseconds}`;
        fs.writeFile(filePath, statusContent, (err) => {
            if (err) {
                console.error(`Ошибка при записи статуса сервера в файл: ${err.message}`);
            }
        });
    }, 1000);
}

function launchChromeAfterDelay(serverAddress, delayInMilliseconds) {
    setTimeout(() => {
        const chromePath = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
        const chromeArguments = [serverAddress];
        
        const chromeProcess = spawn(chromePath, chromeArguments, {
            detached: true,
            stdio: 'ignore'
        });

        chromeProcess.unref(); // Разрываем связь процесса с основным потоком
        console.log(`Chrome запущен с адресом: ${serverAddress}`);
    }, delayInMilliseconds);
}

const htmlProjectDirectory = 'C:/Users/Лика/Desktop/Pixilang/trash/cool3/site';
const liveServerPort = 5500;
startLiveServer(htmlProjectDirectory, liveServerPort);

const serverAddress = `http://localhost:${liveServerPort}/`;
const serverStatusFilePath = path.join(__dirname, 'server-status.txt');
updateServerStatusFile(serverStatusFilePath, serverAddress);

const chromeLaunchDelay = 3000; // Задержка в миллисекундах (2 секунды)
launchChromeAfterDelay(serverAddress, chromeLaunchDelay);
