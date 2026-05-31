# Tracknit Project Structure

## Root Directory
- `src/` - Next.js source code
- `public/` - Public assets and static files
- `docs/` - Project documentation
- `assets/` - Project assets (logos, banners, screenshots)
- `exports/` - Exported files and references
- `temp/` - Temporary files and work-in-progress
- `tracknit-core/` - WordPress plugin core
- `tracknit-elementor-pages/` - Elementor page templates

## Documentation (`docs/`)
- `architecture/` - System architecture and design docs
- `guides/` - User guides and tutorials
- `specs/` - Feature specifications and requirements

## Assets (`assets/`)
- `logos/` - Brand logos and trademarks
- `banners/` - Hero banners and marketing images
- `screenshots/` - UI screenshots and mockups

## Public Assets (`public/assets/`)
- `logos/` - Public-facing logos
- `banners/` - Page banners and hero images
- `icons/` - SVG icons and symbols

## Configuration Files
- `package.json` - Node.js dependencies
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` - Next.js configuration
- `.env.local` - Environment variables (local)
- `AGENTS.md` - Agent behavior guidelines
- `CLAUDE.md` - Claude AI instructions

## Development
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```
