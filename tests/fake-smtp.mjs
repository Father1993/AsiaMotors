// Isolated integration-test SMTP sink. Never forwards email.
import net from 'node:net'
import { mkdirSync, writeFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
mkdirSync('/captures', { recursive: true })
net.createServer((socket) => {
    socket.setEncoding('utf8')
    socket.write('220 test SMTP\r\n')
    let buffer = '',
        data = false,
        message = ''
    socket.on('data', (chunk) => {
        buffer += chunk
        while (buffer.includes('\r\n')) {
            const end = buffer.indexOf('\r\n'),
                line = buffer.slice(0, end)
            buffer = buffer.slice(end + 2)
            if (data) {
                if (line === '.') {
                    writeFileSync('/captures/' + randomUUID() + '.eml', message)
                    data = false
                    message = ''
                    socket.write('250 queued\r\n')
                } else message += line + '\r\n'
            } else if (/^EHLO|^HELO/i.test(line))
                socket.write('250-test\r\n250 SIZE 1000000\r\n')
            else if (/^MAIL|^RCPT|^RSET/i.test(line)) socket.write('250 OK\r\n')
            else if (/^DATA/i.test(line)) {
                data = true
                socket.write('354 send data\r\n')
            } else if (/^QUIT/i.test(line)) {
                socket.end('221 bye\r\n')
            } else socket.write('250 OK\r\n')
        }
    })
    socket.on('error', () => {})
}).listen(2525, '0.0.0.0')
