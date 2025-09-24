# WildGuard - Africa's Living Wildlife Conservation

A mobile-first wildlife database that transforms community reports into actionable conservation intelligence.

## Features

- **Community Reporting**: Wildlife sighting and threat reporting via web, USSD, and SMS
- **Real-time Dashboard**: Live wildlife intelligence and threat monitoring
- **Reward System**: Airtime credits and badges for verified reports
- **Community Leaderboards**: Recognition for top contributors
- **Mobile-First Design**: Optimized for African mobile networks

## Local Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd WildGuard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Production Deployment

### Deploy to Render

1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Use the following settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node.js
   - **Port**: The application uses `process.env.PORT` (auto-configured by Render)

### Environment Variables

No additional environment variables are required for basic functionality.


## API Integration

This frontend connects to the WildGuard API at: `https://wildguard-api-gubr.onrender.com`

### Connected Endpoints

#### Wildlife Reports
- `POST /api/community/report` - Submit wildlife reports
- `GET /api/rangers/reports` - Fetch wildlife reports

#### Community & Analytics  
- `GET /api/leaderboard` - Get community leaderboard
- `GET /api/stats` - Get system statistics

#### Communication
- `POST /api/contact` - Contact form submission
- `POST /api/ussd` - USSD simulation endpoint

#### System Health
- `GET /health` - API health check

### Features
- **Real-time API Integration**: Live data from external backend
- **Offline Support**: Reports saved locally when offline
- **Auto-sync**: Offline reports sync when connection restored  
- **GPS Location**: Automatic location detection
- **API Status**: Visual connection status indicator

## Project Structure

```
WildGuard/
├── server.js          # Express server
├── index.html         # Main HTML file
├── script.js          # Frontend JavaScript
├── styles.css         # CSS styles
├── package.json       # Dependencies and scripts
├── render.yaml        # Render deployment config
└── README.md         # This file
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Deployment**: Render
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Inter)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions about WildGuard, please contact us through the application's contact form or visit our community forums.

---

**Made with ❤️ for Africa's wildlife conservation**
