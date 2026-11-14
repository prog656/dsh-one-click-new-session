// Host-side cordis plugin (no-op).
//
// All behaviour lives in the client module: lib/client.js registers a React
// component into the `sidebar.footer.action` slot and uses the client
// sessions / workspaces / uiWorkspace services to open a blank conversation
// without asking the user to pick a workspace.
//
// Why not inject an inline script from the host webserver:
//   1. An inline script has no cordis client ctx, so it cannot call
//      uiWorkspace.openSession;
//   2. It would need a window global bridge plus DOM polling, which fails
//      silently when the UI is not ready yet;
//   3. The official plugin guidelines require slot registration instead of
//      building DOM by hand.
//
// This file exists because the bundle patch expects a host-side module.

/**
 * Host-side apply: this plugin needs no host behaviour.
 * @param {import("@deepseek-ai/cordis").Context} _ctx Host context
 */
function apply(_ctx) {}

export { apply };
