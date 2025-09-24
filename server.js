const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'WildGuard server is running' });
});

// API endpoints for the WildGuard application

// Get wildlife reports (mock data for now)
app.get('/api/reports', (req, res) => {
    // This would typically fetch from a database
    const mockReports = [
        {
            id: 'WG-1001',
            type: 'Wildlife Sighting',
            animal: 'African Elephant',
            location: 'Maasai Mara',
            urgency: 'medium',
            description: 'Herd of 12 elephants near village water point',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            status: 'verified'
        },
        {
            id: 'WG-1002',
            type: 'Poaching Alert',
            animal: 'Black Rhinoceros',
            location: 'Amboseli',
            urgency: 'high',
            description: 'Suspicious activity reported near rhino sanctuary',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
            status: 'investigating'
        },
        {
            id: 'WG-1003',
            type: 'Human-Wildlife Conflict',
            animal: 'African Lion',
            location: 'Laikipia',
            urgency: 'high',
            description: 'Lion spotted near cattle grazing area',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
            status: 'resolved'
        }
    ];

    res.json(mockReports);
});

// Submit new wildlife report
app.post('/api/reports', (req, res) => {
    try {
        const { type, animal, location, urgency, description, contact } = req.body;

        // Validate required fields
        if (!type || !location || !urgency || !description) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Generate report ID
        const reportId = 'WG-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

        const newReport = {
            id: reportId,
            type,
            animal,
            location,
            urgency,
            description,
            contact,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        // In a real application, you would save this to a database
        console.log('New report submitted:', newReport);

        res.json({
            success: true,
            message: 'Report submitted successfully',
            reportId,
            reward: {
                credits: 50,
                badge: getRewardBadge(type)
            }
        });
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get community leaderboard
app.get('/api/leaderboard', (req, res) => {
    const leaderboardData = [
        {
            rank: 1,
            name: 'Samuel Kiptoo',
            location: 'Maasai Mara',
            reports: 47,
            credits: 2350,
            badges: ['Wildlife Guardian', 'Elephant Protector', 'Community Champion']
        },
        {
            rank: 2,
            name: 'Grace Wanjiku',
            location: 'Laikipia',
            reports: 35,
            credits: 1750,
            badges: ['Lion Watcher', 'Threat Reporter']
        },
        {
            rank: 3,
            name: 'David Lekishon',
            location: 'Amboseli',
            reports: 28,
            credits: 1400,
            badges: ['Rhino Guardian', 'Early Reporter']
        },
        {
            rank: 4,
            name: 'Mary Nyambura',
            location: 'Tsavo',
            reports: 23,
            credits: 1150,
            badges: ['Leopard Spotter']
        },
        {
            rank: 5,
            name: 'John Muriuki',
            location: 'Samburu',
            reports: 19,
            credits: 950,
            badges: ['Giraffe Observer']
        }
    ];

    res.json(leaderboardData);
});

// Get wildlife statistics
app.get('/api/stats', (req, res) => {
    const stats = {
        totalReports: 15247,
        communitiesEngaged: 523,
        threatsEvented: 1205,
        speciesProtected: 45,
        activeUsers: 3421,
        recentActivity: {
            lastHour: 12,
            lastDay: 89,
            lastWeek: 456
        }
    };

    res.json(stats);
});

// Contact form submission
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // In a real application, you would send an email or save to database
        console.log('Contact form submission:', { name, email, subject, message });

        res.json({
            success: true,
            message: 'Thank you for your message! We will get back to you within 24 hours.'
        });
    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// USSD simulation endpoint
app.post('/api/ussd', (req, res) => {
    const { text } = req.body;

    let response = '';

    if (text === '') {
        response = `CON WildGuard USSD Menu:
1. Report Wildlife Sighting
2. Report Poaching/Threat  
3. Report Human-Wildlife Conflict
4. Emergency Alert
5. Check Rewards`;
    } else if (text === '1') {
        response = `CON Select Animal:
1. Elephant
2. Lion
3. Leopard
4. Rhino
5. Other`;
    } else if (text === '2') {
        response = `CON Report Poaching/Threat:
1. Suspicious Activity
2. Illegal Hunting
3. Habitat Destruction
4. Other`;
    } else if (text === '5') {
        response = `END Your WildGuard Rewards:
Credits: 150
Badges: Wildlife Guardian
Rank: #23 in your region`;
    } else {
        response = `END Thank you for using WildGuard! Your report has been received.`;
    }

    res.send(response);
});

// Helper function to determine reward badge based on report type
function getRewardBadge(reportType) {
    const badges = {
        'Wildlife Sighting': 'Wildlife Observer',
        'Poaching Alert': 'Threat Reporter',
        'Human-Wildlife Conflict': 'Conflict Monitor',
        'Habitat Threat': 'Habitat Guardian'
    };
    return badges[reportType] || 'Wildlife Supporter';
}

// Serve the main HTML file for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🌍 WildGuard server is running on port ${PORT}`);
    console.log(`🚀 Server URL: http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
