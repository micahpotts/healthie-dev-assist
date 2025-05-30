<p align="center">
  <img src="images/healthie-logo.png" alt="Healthie Logo" width="300">
</p>

# Healthie Dev Assist

A development assistant that empowers users of the Healthie API, by seamlessly integrating Healthie's GraphQL API with AI tools through the Model Context Protocol (MCP).

## About

This project provides a bridge between Healthie's comprehensive healthcare API and modern AI development tools. It automatically handles GraphQL schema introspection, manages authentication, and provides a standardized interface that AI assistants can use to help you develop healthcare applications.


### Features

- 🔌 **Model Context Protocol (MCP) Integration** - Connect to Claude, OpenAI, Cursor, and other MCP-compatible AI tools
- 📊 **Automatic Schema Management** - Downloads and maintains Healthie's GraphQL schema
- 🔐 **API Authentication Support** - Optional authentication for accessing protected endpoints
- 🚀 **Zero Configuration Start** - Works out of the box with minimal setup
- 🔄 **Schema Regeneration** - Keep your local schema in sync with Healthie's latest API


### Example Prompts

- "Write a ruby script to listen to the a Healthie webhook, and when a message is sent by me in Healthie, send a text to the patient via Twilio"
- "Create a GraphQL query to fetch patient information"
- "Where is a patient's DOB stored?"
- "Help me create a mutation to update patient data"

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- A Healthie API key (optional, for authenticated access)

## ⚠️ Important Warning

**This tool is intended for use with Healthie's sandbox environment only.** While it can be modified to interface directly with production environments, we strongly advise against this unless you are certain your AI tools are authorized to process Protected Health Information (PHI). Most popular AI tools do not come with Business Associate Agreements (BAAs) by default, which are required for handling PHI in production healthcare environments.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Follow the steps below for your AI tool of choice

## Configuration

### First Run

When you run the project for the first time, it will:
1. Check for the GraphQL schema file
2. If not found, automatically download it from Healthie's API
3. Start the MCP server

To manually regenerate the schema:
```bash
npm run regenerate-schema
```

## Setup with AI Tools

### Claude Desktop App

1. Open Claude Desktop settings
2. Navigate to Developer settings
3. Add a new MCP server configuration:

```json
{
  "mcpServers": {
    "healthie-dev-assist": {
      "command": "node",
      "args": ["/path/to/healthie-dev-assist/setup.js"],
      "env": {
        "HEALTHIE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

4. Restart Claude Desktop
5. You should see "healthie-dev-assist" in the available tools

### Claude Code (VS Code Extension)

1. Install the Claude Code extension in VS Code
2. Open VS Code settings (Cmd+, or Ctrl+,)
3. Search for "Claude Code MCP"
4. Add the following configuration:

```json
{
  "claude-code.mcpServers": {
    "healthie-dev-assist": {
      "command": "node",
      "args": ["/path/to/healthie-dev-assist/setup.js"],
      "env": {
        "HEALTHIE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

5. Reload VS Code window
6. The Healthie MCP server will be available in Claude Code

### OpenAI (via MCP Bridge)

Since OpenAI doesn't natively support MCP, you'll need to use an MCP bridge:

1. Install the OpenAI MCP bridge:
```bash
npm install -g @modelcontextprotocol/bridge-openai
```

2. Start the bridge with Healthie Dev Assist:
```bash
mcp-bridge-openai \
  --server-command "node /path/to/healthie-dev-assist/setup.js" \
  --openai-api-key "your-openai-api-key"
```

3. The bridge will provide an endpoint you can use with OpenAI's API

### Cursor

1. Open Cursor settings
2. Navigate to Features > API
3. Enable "Use Model Context Protocol"
4. Add a new MCP server:

```json
{
  "mcp": {
    "servers": {
      "healthie-dev-assist": {
        "command": "node",
        "args": ["/path/to/healthie-dev-assist/setup.js"],
        "env": {
          "HEALTHIE_API_KEY": "your-api-key-here"
        }
      }
    }
  }
}
```

5. Restart Cursor
6. The Healthie context will be available in your AI conversations

## Usage

Once configured, you can ask your AI assistant to:

- Query Healthie's GraphQL API
- Generate GraphQL queries and mutations
- Explore available types and fields
- Build integrations with Healthie
- Debug API responses

## Troubleshooting

### Common Issues

1. **"Schema file not found" error**
   - Run `npm run regenerate-schema` to download the schema
   - Ensure you have internet connectivity

2. **Authentication errors**
   - Verify your API key is correct in the `.env` file
   - Check that the key has appropriate permissions

3. **MCP server not showing in AI tool**
   - Ensure the path to setup.js is absolute, not relative
   - Restart your AI tool after configuration
   - Check the tool's logs for error messages

4. **"Cannot find module" errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check that the apollo-mcp-server submodule is properly initialized

### Debug Mode

To see detailed logs, set the `DEBUG` environment variable:
```bash
DEBUG=* npm start
```

## Development


### Updating the Schema

To update the GraphQL schema from Healthie's latest API:
```bash
npm run regenerate-schema
```

This will fetch the latest schema from the staging API and save it locally.


## License

The apollo-mcp-server included here is distributed under the [Elasic License 2.0](https://github.com/apollographql/apollo-mcp-server/blob/main/LICENSE)


## Support

For issues and questions:
- [GitHub Issues](https://github.com/healthie/healthie-dev-assist/issues)
- [Healthie API Documentation][https://docs.gethealthie.com/guides/intro/]


