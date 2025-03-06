var num = 0;
mermaid.initialize({ startOnLoad: false });

// Mermaid plugin configuration
function initMermaid(hook) {
    hook.doneEach(function () {
        mermaid.init(undefined, ".mermaid");
    });
}

export { initMermaid }; 