const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/signup',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

console.log('Testing connection to POST http://localhost:5000/api/auth/signup...');

const req = http.request(options, res => {
    console.log(`Response Status Code: ${res.statusCode}`);
    if (res.statusCode === 404) {
        console.log('FAIL: Endpoint not found. The server is likely running old code.');
    } else if (res.statusCode === 400 || res.statusCode === 200 || res.statusCode === 201) {
        console.log('SUCCESS: Endpoint exists (input validation error is expected/good).');
    } else {
        console.log('UNKNOWN: Received status ' + res.statusCode);
    }
});

req.on('error', error => {
    console.error('Connection Error:', error.message);
});

req.end();
