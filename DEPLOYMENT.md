# Deployment to GitHub Pages

This project is configured to automatically deploy to GitHub Pages when changes are pushed to the main branch.

## Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
1. Build the React application from the `frontend/` directory
2. Deploy it to GitHub Pages
3. Make it available at: https://LuisTclass.github.io/Bernarda-Alba

## Manual Deployment

If you need to deploy manually:

```bash
cd frontend
npm install --legacy-peer-deps
npm run build
npm run deploy
```

## Configuration Details

- **Homepage URL**: https://LuisTclass.github.io/Bernarda-Alba
- **Build Output**: `frontend/build/`
- **Routing**: Configured for client-side routing with React Router
- **404 Handling**: Custom 404.html redirects to main app for SPA routing

## Requirements

1. GitHub Pages must be enabled in repository settings
2. GitHub Pages source should be set to "GitHub Actions"
3. The main branch should contain these deployment files

## Troubleshooting

If deployment fails:
1. Check the Actions tab in GitHub for error logs
2. Ensure all dependencies install correctly
3. Verify the build completes without errors locally
4. Check that GitHub Pages is properly configured in repository settings