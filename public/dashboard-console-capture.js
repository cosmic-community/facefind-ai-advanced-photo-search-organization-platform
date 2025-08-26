(function() {
  if (window.self === window.top) return;
  
  const logs = [];
  const MAX_LOGS = 500;
  
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug
  };
  
  function captureLog(level, args) {
    const timestamp = new Date().toISOString();
    const message = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg, (key, value) => {
            if (typeof value === 'function') return '[Function]';
            if (value instanceof Error) return value.toString();
            return value;
          }, 2);
        } catch (e) {
          return '[Object]';
        }
      }
      return String(arg);
    }).join(' ');
    
    const logEntry = {
      timestamp,
      level,
      message,
      url: window.location.href
    };
    
    logs.push(logEntry);
    if (logs.length > MAX_LOGS) {
      logs.shift();
    }
    
    try {
      window.parent.postMessage({
        type: 'console-log',
        log: logEntry
      }, '*');
    } catch (e) {}
  }
  
  // Override console methods
  console.log = function(...args) {
    captureLog('log', args);
    originalConsole.log.apply(console, args);
  };
  
  console.warn = function(...args) {
    captureLog('warn', args);
    originalConsole.warn.apply(console, args);
  };
  
  console.error = function(...args) {
    captureLog('error', args);
    originalConsole.error.apply(console, args);
  };
  
  console.info = function(...args) {
    captureLog('info', args);
    originalConsole.info.apply(console, args);
  };
  
  console.debug = function(...args) {
    captureLog('debug', args);
    originalConsole.debug.apply(console, args);
  };
  
  // Capture unhandled errors
  window.addEventListener('error', function(event) {
    captureLog('error', [`Unhandled Error: ${event.error ? event.error.toString() : event.message}`]);
  });
  
  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    captureLog('error', [`Unhandled Promise Rejection: ${event.reason}`]);
  });
  
  // Send ready message
  function sendReady() {
    try {
      window.parent.postMessage({
        type: 'console-capture-ready',
        url: window.location.href,
        timestamp: new Date().toISOString()
      }, '*');
      
      // Also send current route info
      sendRouteChange();
    } catch (e) {}
  }
  
  // Send route change message
  function sendRouteChange() {
    try {
      window.parent.postMessage({
        type: 'route-change',
        route: {
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash,
          href: window.location.href
        },
        timestamp: new Date().toISOString()
      }, '*');
    } catch (e) {}
  }
  
  // Monitor route changes
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    setTimeout(sendRouteChange, 0);
  };
  
  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    setTimeout(sendRouteChange, 0);
  };
  
  window.addEventListener('popstate', sendRouteChange);
  window.addEventListener('hashchange', sendRouteChange);
  
  // Send ready when loaded
  if (document.readyState === 'complete') {
    sendReady();
  } else {
    window.addEventListener('load', sendReady);
  }
})();