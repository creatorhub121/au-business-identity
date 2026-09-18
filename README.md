# AU Business Identity

Deterministic Australian business identifier validation for AI agents and applications.

Part of **AU Agent Utilities**.

## What it does

AU Business Identity currently validates Australian:

- ABNs — Australian Business Numbers
- ACNs — Australian Company Numbers

Validation is performed locally using the official checksum rules.

It does **not yet confirm whether an ABN or ACN is registered, active or associated with a particular entity**.

Registry verification and Australian business lookup tools are planned next.

## MCP tools

### `validate_abn`

Validates the format and checksum of an Australian Business Number.

Example:

```text
51 824 753 556

Returns structured information including:
- Normalised ABN 
- Formatted ABN
- Format validity 
- Checksum validity 
- Overall validation result

### `validate_acn`

Validates the format and checksum of an Australian Company Number

Example: 

```text
004 085 616
```

Returns structured information including: 
- Normalised ACN 
- Formatted ACN 
- Format validity 
- Checksum validity 
- Overall validation result 

## Example agent requests 

```text
Is 51 824 753 556 a valid ABN?
```

```text 
Validate ACN 004 085 616
```

```text
Check whether this Australian business identifier passes its checksum
```

## HTTP endpoints 

ABN: 

```text 
/validate-abn?abn=51824753556
```

ACN:

```text
/validate-acn?acn=004085616
```

## MCP Endpoint 

Public remote MCP endpoint: 

```text
https://au-business-identity.agentutilities.workers.dev/mcp
``` 

```markdown 
## Quick MCP examples

Validate an ABN: 

```json
{
  "name": "validate_abn",
  "arguments": {
    "abn": "51 824 753 556"
  }
}
```

Validate an ACN: 

```json
{
  "name": "validate_acn",
  "arguments": {
    "acn": "004 085 616"
  }
}
```

 

## Planned tools 

Future versions are intended to add: 
- Australian business lookup 
- ABN registry status 
- GST registration status 
- business-name search
- ABN / business-name matching 
- Australian entity verification 

## Privacy 

Anonymous MCP usage logging records protocol events and tool names only. 

Tool arguments such as ABNs or ACNs are not intentionally logged by the application. 

## Development 

Install dependencies: 

```text 
</> Bash 
npm install
``` 

Run tests: 

```text
</> Bash 
npm test -- --run
```

Run locally: 
```text 
</> Bash
npm run dev
```

## Licence 

MIT

