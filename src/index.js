import { createMcpHandler } from "agents/mcp/server";
import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

import { validateAbn, validateAcn } from "./validators.js";

function toolSuccess(result) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result),
      },
    ],
  };
}

function toolFailure(error) {
  return {
    isError: true,
    content: [
      {
        type: "text",
        text: JSON.stringify({
          error: error instanceof Error ? error.message : "Unknown error",
        }),
      },
    ],
  };
}

async function verifyAbn(env, abn) {
  if (!env?.BUSINESS_IDENTITY_SERVICE) {
    throw new Error(
      "ABN registry verification is temporarily unavailable."
    );
  }

  let response;

  try {
    response = await env.BUSINESS_IDENTITY_SERVICE.fetch(
      "https://internal/v1/verify-abn",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ abn }),
      }
    );
  } catch {
    throw new Error(
      "ABN registry verification is temporarily unavailable."
    );
  }

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      "ABN registry verification is temporarily unavailable."
    );
  }

  if (response.ok) {
    return result;
  }

  if (
    response.status === 422 &&
    result?.verification_status === "invalid_input"
  ) {
    const error = new Error(
      "The supplied ABN is invalid."
    );

    error.publicDetails = result;
    throw error;
  }

  if (
    response.status === 502 ||
    response.status === 503
  ) {
    throw new Error(
      "ABN registry verification is temporarily unavailable."
    );
  }

  throw new Error(
    "ABN registry verification could not be completed."
  );
}

function createServer(env) {
  const server = new McpServer({
    name: "AU Business Identity",
    version: "0.2.0",
  });

  server.registerTool(
    "validate_abn",
    {
      description:
        "Validate the format and checksum of an Australian Business Number (ABN). This does not confirm that the ABN is registered or active.",
      inputSchema: {
        abn: z
          .string()
          .min(1)
          .describe(
            "Australian Business Number. Spaces and hyphens are accepted."
          ),
      },
    },
    async ({ abn }) => {
      try {
        return toolSuccess(validateAbn(abn));
      } catch (error) {
        return toolFailure(error);
      }
    }
  );

  server.registerTool(
    "verify_abn",
    {
      description:
        "Verify an Australian Business Number (ABN) against the Australian Business Register. Returns checksum validity, registry match status, and available registry details.",
      inputSchema: {
        abn: z
          .string()
          .min(1)
          .describe(
            "Australian Business Number to verify against the Australian Business Register. Spaces and hyphens are accepted."
          ),
      },
    },
    async ({ abn }) => {
      try {
        return toolSuccess(
          await verifyAbn(env, abn)
        );
      } catch (error) {
        if (error?.publicDetails) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  error.publicDetails
                ),
              },
            ],
          };
        }

        return toolFailure(error);
      }
    }
  );

  server.registerTool(
    "validate_acn",
    {
      description:
        "Validate the format and checksum of an Australian Company Number (ACN). This does not confirm that the company is registered or active.",
      inputSchema: {
        acn: z
          .string()
          .min(1)
          .describe(
            "Australian Company Number. Spaces and hyphens are accepted."
          ),
      },
    },
    async ({ acn }) => {
      try {
        return toolSuccess(validateAcn(acn));
      } catch (error) {
        return toolFailure(error);
      }
    }
  );

  return server;
}

function jsonResponse(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url); 

    if (url.pathname === "/mcp") {
      if (request.method === "POST") {
        try {
          const body = await request.clone().json();
          const messages = Array.isArray(body) ? body : [body];

          for (const message of messages) {
            if (message?.method === "initialize") {
              console.log("mcp.initialize");
            } else if (message?.method === "tools/list") {
              console.log("mcp.tools_list");
            } else if (message?.method === "tools/call") {
              const toolName = message?.params?.name;

              if (typeof toolName === "string") {
                console.log(`mcp.tool_call ${toolName}`);
              } else {
                console.log("mcp.tool_call unknown");
              }
            }
          }
        } catch {
          // Ignore non-JSON or unreadable MCP request bodies.
        }
      }

      const mcpHandler = createMcpHandler(
        () => createServer(env)
      );

      return mcpHandler(request, env, ctx);
    }

    if (url.pathname === "/") {
      return jsonResponse({
        name: "AU Business Identity",
        version: "0.2.0",
        description:
          "Australian business identifier validation and live ABN registry verification for AI agents and applications.",
        mcp: "/mcp",
        mcp_tools: ["validate_abn", "verify_abn", "validate_acn"],
        http_endpoints: {
          validate_abn: "/validate-abn?abn=51824753556",
          validate_acn: "/validate-acn?acn=004085616",
        },
        note:
          "validate_abn and validate_acn perform checksum validation. verify_abn performs live Australian Business Register verification.",
      });
    }

    if (url.pathname === "/validate-abn") {
      const abn = url.searchParams.get("abn");

      if (!abn) {
        return jsonResponse(
          {
            error: "abn query parameter is required",
          },
          400
        );
      }

      return jsonResponse(validateAbn(abn));
    }

    if (url.pathname === "/validate-acn") {
      const acn = url.searchParams.get("acn");

      if (!acn) {
        return jsonResponse(
          {
            error: "acn query parameter is required",
          },
          400
        );
      }

      return jsonResponse(validateAcn(acn));
    }

    return jsonResponse(
      {
        error: "Not found",
      },
      404
    );
  },
};
