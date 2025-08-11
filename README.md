# Vibrasonix Knowledge Hub

A modern Next.js-based interactive knowledge hub for sound therapy, featuring glassmorphism UI design and comprehensive documentation integration.

## Architecture

- **Framework**: Next.js 15.4.5 with TypeScript and App Router
- **Styling**: Tailwind CSS with glassmorphism design system
- **Content**: MDX processing with dynamic documentation loading
- **Components**: Radix UI with custom glassmorphism components
- **Analytics**: Built-in usage tracking and metrics dashboard

## Directory Structure

The Knowledge Hub is organized into six main sections:

- **sonic-science/**: Scientific foundation behind sound therapy
- **experience-library/**: Curated collection of sound therapy protocols
- **transformation-journeys/**: Narrative-driven paths with progress visualization
- **research-observatory/**: Living library of evidence with interactive exploration
- **community-cosmos/**: Interactive social knowledge sharing space
- **sonic-lab/**: Experimental zone for personalized exploration

## Key Features

- **Documentation-Driven**: All content sourced from `/docs` directory markdown files
- **Interactive Components**: Frequency explorer, analytics dashboard, and code examples
- **Glassmorphism UI**: Modern glass-effect design with backdrop blur
- **Real-time Analytics**: Usage tracking and engagement metrics
- **Export Functionality**: Document export in multiple formats
- **Responsive Design**: Mobile-optimized with floating navigation

## Implementation Status

✅ **Completed**:
- Next.js setup with TypeScript and Tailwind CSS
- Glassmorphism component library (GlassCard, LiquidBackground)
- MDX processing with rehype/remark plugins
- Analytics system with LocalAnalyticsService
- Section pages with documentation integration
- Mobile navigation and responsive design
- Export functionality for documents
- Cleaned codebase with removed mock data and unused components

🔄 **Current Focus**:
- Documentation updates and structure optimization

## Development

To work with this Knowledge Hub locally:

1. Clone the repository
2. Use a markdown previewer that supports HTML (like VS Code with the Markdown Preview Enhanced extension)
3. Navigate to `index.md` to start exploring the hub

## Production Deployment

For production deployment, these markdown files can be:

1. Processed by a static site generator (like Jekyll, Hugo, or Next.js)
2. Enhanced with CSS and JavaScript for interactivity
3. Deployed to a web server or hosting platform

## Contact

For questions or feedback about the Vibrasonix Knowledge Hub:

- **Email**: knowledge@vibrasonix.com
- **GitHub**: [github.com/vibrasonix/knowledge-hub](https://github.com/vibrasonix/knowledge-hub)
