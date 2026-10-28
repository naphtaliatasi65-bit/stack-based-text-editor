
let editorModule;
let textEditor;
let isUpdating = false;

const textArea = document.getElementById("editor");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const clearBtn = document.getElementById("clearBtn");
const message = document.getElementById("message");
const wordCount = document.getElementById("wordCount");

function updateStatus() {
    const text = textArea.value.trim();
    const words = text ? text.split(/\s+/).length : 0;

    wordCount.textContent = `${words} ${words === 1 ? "word" : "words"}`;

    undoBtn.disabled = textEditor.undoCount() === 0;
    redoBtn.disabled = textEditor.redoCount() === 0;
}

function syncText() {
    if (isUpdating || !textEditor) return;

    textEditor.setText(textArea.value);
    updateStatus();
    message.textContent = "Changes saved in the editor history.";
}

textArea.addEventListener("input", syncText);

undoBtn.addEventListener("click", () => {
    if (textEditor.undo()) {
        isUpdating = true;
        textArea.value = textEditor.getText();
        isUpdating = false;

        updateStatus();
        message.textContent = "Undo successful.";
    }
});

redoBtn.addEventListener("click", () => {
    if (textEditor.redo()) {
        isUpdating = true;
        textArea.value = textEditor.getText();
        isUpdating = false;

        updateStatus();
        message.textContent = "Redo successful.";
    }
});

clearBtn.addEventListener("click", () => {
    if (textArea.value.length > 0) {
        textEditor.clear();
        textArea.value = textEditor.getText();

        updateStatus();
        message.textContent = "Text cleared. You can undo this action.";
    }
});

async function startEditor() {
    try {
        editorModule = await createEditorModule();
        textEditor = new editorModule.TextEditor();

        updateStatus();
        message.textContent = "C++ WebAssembly editor is ready!";
    } catch (error) {
        console.error("Editor loading error:", error);
        message.textContent =
            "Could not load the C++ editor. Check the browser console.";
    }
}

startEditor();
