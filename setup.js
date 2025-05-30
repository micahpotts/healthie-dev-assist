#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const config = require('./config');

// Load environment variables from .env file
require('dotenv').config();

const { SCHEMA_URL, SCHEMA_DIR, SCHEMA_FILE, MCP_SERVER_PATH } = config;

// Convert relative paths to absolute paths
const absoluteSchemaDir = path.resolve(__dirname, SCHEMA_DIR);
const absoluteSchemaFile = path.resolve(__dirname, SCHEMA_FILE);
const absoluteMcpServerPath = path.resolve(__dirname, MCP_SERVER_PATH);

// Create schema directory if it doesn't exist
if (!fs.existsSync(absoluteSchemaDir)) {
    fs.mkdirSync(absoluteSchemaDir, { recursive: true });
}

// Check if schema file exists
if (!fs.existsSync(absoluteSchemaFile)) {
    
    // Use the regenerate-schema script
    const regenerate = spawn('node', [path.resolve(__dirname, 'regenerate-schema.js')], { 
        stdio: 'inherit',
        cwd: __dirname
    });
    
    regenerate.on('close', (code) => {
        if (code !== 0) {
            process.exit(1);
        }
        startMCPServer();
    });
} else {
    startMCPServer();
}

function startMCPServer() {
    // Check if MCP server exists
    if (!fs.existsSync(absoluteMcpServerPath)) {
        console.error(`MCP server not found at: ${absoluteMcpServerPath}`);
        process.exit(1);
    }

    // Build command arguments
    const args = ['--introspection', '--schema', absoluteSchemaFile, '--endpoint', SCHEMA_URL];
    
    // Add API key header if present in environment
    // Setting this up differs based on AI tool/LLM, see README for more info
    if (process.env.HEALTHIE_API_KEY) {
        args.push('--header', `authorization: Basic ${process.env.HEALTHIE_API_KEY}`);
        args.push('--header', `AuthorizationSource: API`);
    }

    // Start the MCP server with the SDL schema file
    // Suppress initial schema logging by filtering stderr
    const server = spawn(absoluteMcpServerPath, args, { 
        stdio: ['inherit', 'inherit', 'pipe'],
        cwd: __dirname
    });

    let suppressLogs = true;
    
    // Stop suppressing logs after 2 seconds
    setTimeout(() => {
        suppressLogs = false;
    }, 2000);

    server.stderr.on('data', (data) => {
        const output = data.toString();
        
        // Filter out schema logging and initial startup messages
        if (suppressLogs && (
            output.includes('Received schema:') ||
            output.includes('Received 0 operations:') ||
            output.includes('Apollo MCP Server v')
        )) {
            return;
        }
        
        process.stderr.write(data);
    });

    server.on('error', (err) => {
        process.exit(1);
    });

    server.on('close', (code) => {
        process.exit(code || 0);
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
        server.kill('SIGINT');
    });

    process.on('SIGTERM', () => {
        server.kill('SIGTERM');
    });
}