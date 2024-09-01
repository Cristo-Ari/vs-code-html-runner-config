const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

// Пути к файлам
const serverStatusFilePath = path.join(__dirname, 'server-status.txt');
const chromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const serverScriptPath = path.join(__dirname, 'start-server.js');


function startServer() {
    console.log('Запускаем сервер...');
    
    const serverProcess = spawn('cmd.exe', ['/c', 'start', 'cmd.exe', '/k', 'node', serverScriptPath], {
        detached: true,
        stdio: 'ignore' // Игнорируем вывод, чтобы программа не ожидала завершения процесса
    });

    serverProcess.unref(); // Разрываем связь процесса с основным потоком
    process.exit();
}

// Функция запуска Chrome
function launchChrome(serverUrl) {
    console.log('Запускаем Chrome с URL:', serverUrl);
    spawn(chromePath, [serverUrl], {
        detached: true,
        stdio: 'ignore'
    }).unref();
    process.exit();
}

// Основная логика проверки
fs.readFile(serverStatusFilePath, 'utf8', (err, data) => {
    if (err) {
        console.log('Файл server-status.txt не найден.');
        startServer();
        return;
    }

    const lines = data.split('\n').map(line => line.trim());

    if (lines.length < 2 || !lines[1]) {
        console.log('Файл server-status.txt содержит менее двух строк.');
        startServer();
        return;
    }

    const serverUrl = lines[0];
    const serverTime = Number(lines[1]);
    const currentTime = Date.now();

    console.log(`Содержимое файла:\nURL: ${serverUrl}\nВремя: ${serverTime}`);

    if (isNaN(serverTime) || currentTime - serverTime > 2000) {
        console.log('Время в файле устарело или некорректно.');
        startServer();
    } else {
        console.log('Время в файле актуально.');
        launchChrome(serverUrl);
    }
});
