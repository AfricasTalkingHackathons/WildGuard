# WildGuard Deployment Guide

## 🚀 Quick Deployment to Render

### Prerequisites
- GitHub account
- Code pushed to GitHub repository

### Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add API integration with external backend"
   git push origin main
   ```

2. **Deploy to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Static Site"
   - Connect your GitHub repository
   - Use these settings:
     - **Build Command**: `npm install`
     - **Publish Directory**: `.`
     - **Environment**: Node.js

3. **Environment Configuration**
   - No environment variables needed for basic functionality
   - The frontend automatically connects to: `https://wildguard-api-gubr.onrender.com`

## 🔧 Local Development

### Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd WildGuard

# Install dependencies
npm install

# Start development server
npm run dev
# or
npm start
```

### Local Testing
- Frontend: http://localhost:3000
- API endpoints: Connected to https://wildguard-api-gubr.onrender.com

## 📡 API Integration Features

### ✅ Connected Endpoints

1. **Wildlife Reports**
   - `POST /api/community/report` - Submit wildlife reports
   - Real-time validation and reward calculation
   - Offline support with automatic sync

2. **Dashboard Data**
   - `GET /api/rangers/reports` - Recent wildlife reports
   - `GET /api/leaderboard` - Community leaderboard
   - `GET /api/stats` - Statistics and analytics

3. **System Health**
   - `GET /health` - API health check
   - Connection status indicator
   - Automatic reconnection handling

### 🔄 Real-time Features

- **Live Statistics**: Hero section counters update from API
- **Offline Mode**: Reports saved locally when offline
- **Auto-sync**: Offline reports sync when connection restored
- **Status Indicators**: Visual feedback for API connectivity

### 📱 Enhanced UX

- **GPS Location**: Automatic location detection for reports
- **Form Validation**: Real-time validation with API feedback
- **Loading States**: Visual feedback during API calls
- **Error Handling**: Graceful fallbacks for network issues

## 🌍 API Base URL Configuration

The application automatically connects to:
```javascript
const API_BASE_URL = 'https://wildguard-api-gubr.onrender.com';
```

### Supported Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/api/community/report` | POST | Submit reports |
| `/api/rangers/reports` | GET | Get reports |
| `/api/leaderboard` | GET | Community stats |
| `/api/contact` | POST | Contact form |
| `/api/stats` | GET | System statistics |

## 📋 Testing Checklist

### Before Deployment
- [ ] Forms submit successfully
- [ ] API connections work
- [ ] Offline mode functions
- [ ] GPS location works
- [ ] Real-time updates display

### After Deployment
- [ ] Site loads correctly
- [ ] API endpoints respond
- [ ] Mobile compatibility
- [ ] Error handling works
- [ ] Statistics update

## 🔍 Troubleshooting

### Common Issues

**API Connection Failed**
- Check internet connection
- Verify API base URL is correct
- Check browser console for errors

**Forms Not Submitting**
- Verify required fields are filled
- Check network connectivity
- Try refreshing the page

**Location Not Working**
- Allow browser location permissions
- Check if HTTPS is enabled
- Use manual coordinate entry

**Offline Mode Issues**
- Check localStorage availability
- Verify service worker registration
- Test with network disabled

## 📊 Monitoring

### Client-Side Monitoring
- Browser console logs
- Network tab for API calls
- Local storage inspection

### API Monitoring
- Health check endpoint: `/health`
- Response times and error rates
- API connection status indicator

## 🚀 Production Optimization

### Performance
- Static assets served from CDN
- Compressed responses
- Cached API responses
- Optimized images

### Security
- HTTPS enabled
- CORS properly configured
- Input validation
- Error message sanitization

## 📧 Support

For deployment issues:
1. Check the browser console for errors
2. Verify API connectivity at: https://wildguard-api-gubr.onrender.com/health
3. Test individual API endpoints
4. Review network requests in browser dev tools

---

**Last Updated**: September 24, 2025
**Version**: 1.0.0
**Status**: ✅ Ready for Production
