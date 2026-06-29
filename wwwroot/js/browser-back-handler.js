// Handle browser back button with confirmation
let componentReference;
let historyPushed = false;

function setupBrowserBackListener(dotnetRef) {
    componentReference = dotnetRef;
    
    // Push a state to the history stack
    if (!historyPushed) {
        window.history.pushState({ preventBack: true }, null, null);
        historyPushed = true;
    }

    // Listen for back navigation
    window.addEventListener('popstate', handleBackNavigation);
}

function handleBackNavigation(event) {
    // Prevent the default behavior
    event.preventDefault();
    
    if (componentReference) {
        // Call the C# method to show confirmation
        componentReference.invokeMethodAsync('HandleBrowserBack');
    }
}

function allowBrowserBack() {
    // Remove the event listener
    window.removeEventListener('popstate', handleBackNavigation);
    historyPushed = false;
    
    // Go back
    window.history.back();
}

function preventBrowserBack() {
    // Re-push the state to prevent back navigation
    window.history.pushState({ preventBack: true }, null, null);
}
