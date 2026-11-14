window.__ModuleLoader__.load({
	id: "@local/dsh-one-click-new-session",
	factory: (require) => {
		const React = require("react");
		const h = React.createElement;

		// ---------------------------------------------------------------------
		// Configurable constants.
		// install.mjs replaces SCRATCH_DIR with a real absolute path on the
		// target machine, and can localise the four labels with --lang zh.
		// If you install manually, edit these lines yourself.
		// ---------------------------------------------------------------------
		const SCRATCH_DIR = "__DSH_BLANK_SESSION_DIR__";
		const SCRATCH_TITLE = "Quick Chats";
		const LABEL = "New chat";
		const HINT = "New chat (no workspace needed)";
		const FAIL_LABEL = "New chat failed";
		const TAG = "[dsh-one-click-new-session]";

		function text(value) {
			if (value === undefined || value === null) return "";
			if (typeof value === "string") return value;
			if (value && typeof value.message === "string") return value.message;
			return String(value);
		}

		function normPath(value) {
			return String(value || "")
				.replace(/\\/g, "/")
				.replace(/\/+$/, "")
				.toLowerCase();
		}

		// Fallback: bypass uiWorkspace and use the client sessions service directly.
		async function createAndOpenBySession(ctx, workspaceId) {
			const sessionId = await ctx.sessions.create({ workspaceId });
			ctx.uiWorkspace.openSession(sessionId);
			return sessionId;
		}

		const CSS = [
			".dsh-blank-new{display:flex;align-items:center;gap:8px;box-sizing:border-box;width:100%;margin:0 2px;padding:7px 8px;border:none;background:transparent;border-radius:var(--dsw-radius-md,8px);color:var(--dsw-alias-label-primary,#1b1b1b);font:inherit;line-height:22px;text-align:left;cursor:pointer;transition:background .12s var(--ds-ease-in-out,ease)}",
			".dsh-blank-new:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.06))}",
			".dsh-blank-new:active{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.08))}",
			".dsh-blank-new:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary,#3a7bff));outline-offset:-2px}",
			".dsh-blank-new[data-busy=true]{opacity:.55;cursor:default}",
			".dsh-blank-new[data-failed=true]{color:var(--dsw-alias-state-error-primary,#d93f3f)}",
			".dsh-blank-new__icon{display:inline-flex;flex:none;align-items:center;justify-content:center}",
			".dsh-blank-new__label{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
			".dsh-blank-new[data-rail=true]{width:36px;height:36px;justify-content:center;padding:0;margin:0 auto}",
			"@media (prefers-reduced-motion:reduce){.dsh-blank-new{transition:none}}"
		].join("");

		function PlusIcon() {
			return h(
				"span",
				{ className: "dsh-blank-new__icon" },
				h(
					"svg",
					{
						width: 16,
						height: 16,
						viewBox: "0 0 16 16",
						fill: "none",
						"aria-hidden": "true"
					},
					h("path", {
						d: "M8 3.4v9.2M3.4 8h9.2",
						stroke: "currentColor",
						strokeWidth: 1.5,
						strokeLinecap: "round"
					})
				)
			);
		}

		return {
			// Wait for all four client services before apply(), otherwise
			// ctx.uiWorkspace / ctx.sessions may still be undefined.
			inject: ["slots", "sessions", "workspaces", "uiWorkspace"],
			apply(ctx) {
				/**
				 * Ensure the scratch workspace exists. workspaces.create is
				 * idempotent for an already-registered path: the host resolves
				 * by path and returns the existing workspace (created:false).
				 */
				async function ensureScratchWorkspace() {
					if (SCRATCH_DIR.indexOf("__DSH_BLANK") === 0) {
						throw new Error("SCRATCH_DIR is not configured. Run install.mjs or edit lib/client.js.");
					}
					const snapshot = ctx.workspaces.list.getSnapshot();
					const items = Array.isArray(snapshot && snapshot.items) ? snapshot.items : [];
					const found = items.find((item) => normPath(item.path) === normPath(SCRATCH_DIR));
					if (found !== undefined) {
						if (found.title !== SCRATCH_TITLE) {
							try {
								await ctx.workspaces.rename(found.workspaceId, SCRATCH_TITLE);
							} catch (error) {
								console.warn(TAG + " could not rename scratch workspace:", error);
							}
						}
						return found.workspaceId;
					}
					const created = await ctx.workspaces.create({ path: SCRATCH_DIR });
					if (created === undefined || created === null || created.workspaceId === undefined) {
						throw new Error("Could not create scratch workspace: " + SCRATCH_DIR);
					}
					if (created.title !== SCRATCH_TITLE) {
						try {
							await ctx.workspaces.rename(created.workspaceId, SCRATCH_TITLE);
						} catch (error) {
							console.warn(TAG + " could not rename scratch workspace:", error);
						}
					}
					return created.workspaceId;
				}

				/**
				 * One click: resolve the scratch workspace, then open a blank
				 * session inside it. uiWorkspace.openWorkspace is the official
				 * path and reuses an existing blank session, so clicking twice
				 * does not pile up empty conversations.
				 */
				async function startBlankSession() {
					const workspaceId = await ensureScratchWorkspace();
					try {
						await ctx.uiWorkspace.openWorkspace(workspaceId);
					} catch (error) {
						console.warn(TAG + " openWorkspace failed, falling back to sessions.create:", error);
						await createAndOpenBySession(ctx, workspaceId);
					}
				}

				function BlankNewSessionAction(props) {
					const wide = Boolean(props && props.wide);
					const [busy, setBusy] = React.useState(false);
					const [failed, setFailed] = React.useState("");

					const onClick = React.useCallback(() => {
						if (busy) return;
						setBusy(true);
						setFailed("");
						startBlankSession()
							.then(() => {
								console.log(TAG + " opened a new workspace-free chat");
							})
							.catch((error) => {
								console.error(TAG + " failed:", error);
								setFailed(text(error) || "Unknown error");
							})
							.finally(() => {
								setBusy(false);
							});
					}, [busy]);

					return h(
						React.Fragment,
						null,
						h("style", { key: "dsh-blank-new-style" }, CSS),
						h(
							"button",
							{
								key: "dsh-blank-new-button",
								type: "button",
								className: "dsh-blank-new",
								"data-dsh-blank-new": "1",
								"data-busy": busy ? "true" : "false",
								"data-failed": failed === "" ? "false" : "true",
								"data-rail": wide ? "false" : "true",
								"aria-label": LABEL,
								title: failed === "" ? HINT : failed,
								disabled: busy,
								onClick
							},
							h(PlusIcon),
							wide ? h("span", { className: "dsh-blank-new__label" }, failed === "" ? LABEL : FAIL_LABEL) : null
						)
					);
				}

				// sidebar.footer.action is a list slot (always appended, never
				// stolen by another plugin), sits next to Settings, and renders
				// independently of whichever workspace is currently selected.
				ctx.slots.inject("sidebar.footer.action", () =>
					ctx.slots.register(
						{
							name: "sidebar.footer.action",
							id: "blank-new-session",
							order: 100
						},
						BlankNewSessionAction
					)
				);

				console.log(TAG + " client plugin ready");
			}
		};
	}
});
