const Sentry = require('@sentry/nestjs');
const { nodeProfilingIntegration } = require('@sentry/profiling-node');

// Ensure to call this before requiring any other modules!
Sentry.init({
  dsn: 'https://42536fa20139d329bd6f97f8461bb81b@o4509029679431680.ingest.de.sentry.io/4509029681856592',
  integrations: [
    // Add our Profiling integration
    nodeProfilingIntegration(),
  ],

  // Add Tracing by setting tracesSampleRate
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Set sampling rate for profiling
  // This is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});
