# AU Business Identity

Australian business identifier validation and live ABN registry verification for AI agents and applications.

Part of **AU Agent Utilities**.

## What it does

AU Business Identity provides three MCP tools for working with Australian business identifiers:

- Validate ABNs using official format and checksum rules
- Verify ABNs live against the Australian Business Register
- Validate ACNs using official format and checksum rules

Use `validate_abn` when you only need deterministic local validation.

Use `verify_abn` when you need to know whether an ABN can be found in the Australian Business Register and retrieve available registry information.

## MCP tools

### `validate_abn`

Validates the format and checksum of an Australian Business Number without performing a registry lookup.

Example:

```text
51 824 753 556
```

Returns structured information including:

- Normalised ABN
- Formatted ABN
- Format validity
- Checksum validity
- Overall validation result

### `verify_abn`

Verifies an Australian Business Number against the Australian Business Register.

Example:

```text
51 824 753 556
```

Returns structured information that may include:

- Normalised and formatted ABN
- Checksum validity
- Registry match status
- Entity name
- Entity type
- ABN status
- GST registration status
- State and postcode
- Business names when available
- Registry update information

A checksum-valid ABN and a registry-verified ABN are not treated as the same thing.

### `validate_acn`

Validates the format and checksum of an Australian Company Number.

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
Verify ABN 51 824 753 556 against the Australian Business Register.
```

```text
Is this ABN active and registered for GST?
```

```text
Validate ACN 004 085 616.
```

## MCP endpoint

Public remote MCP endpoint:

```text
https://au-business-identity.auagentutilities.workers.dev/mcp
```

No API key is currently required for the public beta tools.

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

Verify an ABN against the Australian Business Register:

```json
{
  "name": "verify_abn",
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

## HTTP endpoints

Checksum validation is also available over HTTP:

```text
/validate-abn?abn=51824753556
```

```text
/validate-acn?acn=004085616
```

Live ABR verification is currently exposed through the MCP tool `verify_abn`.

## Planned capabilities

Potential future additions include:

- Business-name search
- ABN and business-name matching
- Expanded Australian entity verification
- Additional business identity checks based on real usage demand

## Privacy

The service records operational usage metadata such as tool name, success status and registry outcome to help measure reliability and adoption.

ABN and ACN input values are not intentionally stored in application usage logs.

## Development

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npx vitest run
```

## Source

GitHub:

```text
https://github.com/creatorhub121/au-business-identity
```
