// Required modules
const express = require('express');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const {model} = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();
// Constants
const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;

// Express app setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection setup
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// MongoDB schema and model setup
const CompanyCountSchema = new mongoose.Schema({
    industry: String,
    count: String
}, { collection: 'company_count' });

const JobsInfoSchema = new mongoose.Schema({
    id: String,
    window: Object,
    company: String,
    maxSalary: Number,
    minSalary: Number,
    totalJobs: Number,
    totalCompanies: Number,
    date: Date,
    type: String,
}
, { collection: 'stream' });


const CompanyCountModel = mongoose.model ('CompanyCount', CompanyCountSchema) ;
const JobsInfoModel = mongoose.model ('JobsInfo', JobsInfoSchema) ;

// Function to get top 10 industries by count
async function getTop10Industries() {
    try {
        return await CompanyCountModel.find().sort({ count: -1 }).limit(10);
    } catch (error) {
        console.error('Error fetching top 10 industries:', error);
    }
}

// function to get max salary
// function to get max salary
async function getMaxSalary() {
    try {
        const maxSalaryJob = await JobsInfoModel.findOne().sort({ maxSalary: -1 });
        return maxSalaryJob.maxSalary;
    } catch (error) {
        console.error('Error fetching max salary:', error);
    }
}

// function to get min salary
async function getMinSalary() {
    try {
        const minSalaryJob = await JobsInfoModel.findOne().sort({ minSalary: 1 });
        return minSalaryJob.minSalary;
    } catch (error) {
        console.error('Error fetching min salary:', error);
    }
}

async function getTotalJobs() {
    try {
        const data =  await JobsInfoModel.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalJobs" }
                }
            }
        ]);
        return data[0].total;
    } catch (error) {
        console.error('Error fetching top 10 industries:', error);
    }
}



// function to get total companies
async function getTotalCompanies() {
    try {
        const data = await JobsInfoModel.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalCompanies" }
                }
            }
        ]);
        return data[0].total;
    } catch (error) {
        console.error('Error fetching total companies:', error);
    }
}


function toReadableDate(date) {
    return date.toISOString().split('T')[0];
}

async function getMedianSalaryData() {
    try {
        // Aggregate data by date
        const aggregatedData = await JobsInfoModel.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        day: { $dayOfMonth: "$date" },
                    },
                    minSalaries: { $push: "$minSalary" },
                    maxSalaries: { $push: "$maxSalary" }
                }
            }
        ]);

        const medianData = [];

        for (const data of aggregatedData) {
            // Sort salaries
            const minSalaries = data.minSalaries.sort((a, b) => a - b);
            const maxSalaries = data.maxSalaries.sort((a, b) => a - b);

            // Calculate medians
            const medianMinSalary = minSalaries[Math.floor(minSalaries.length / 2)];
            const medianMaxSalary = maxSalaries[Math.floor(maxSalaries.length / 2)];

            // Add to medianData
            medianData.push({
                date: `${data._id.year}-${data._id.month}-${data._id.day}`,
                medianMinSalary: medianMinSalary,
                medianMaxSalary: medianMaxSalary
            });
        }

        // Sort medianData by date
        medianData.sort((a, b) => new Date(a.date) - new Date(b.date));

        return medianData;
    } catch (error) {
        console.error('Error fetching median salary data:', error);
    }
}

const resp=  getMedianSalaryData().then((data) => {
    console.log(data);
    return data;
}
);





// Express routes
app.get('/', (req, res) => res.send('Server is up'));

// Server setup
const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// WebSocket server setup
const wss = new WebSocket.Server({ server });

// WebSocket connection event handler
wss.on('connection', async (ws) => {
    console.log('Client connected');

    try {
        const top10 = await getTop10Industries();
        const jobInfos = {
            maxSalary: await getMaxSalary(),
            minSalary: await getMinSalary(),
            totalJobs: await getTotalJobs(),
            totalCompanies: await getTotalCompanies(),
            medianSalary: await getMedianSalaryData()
        };

        ws.send(JSON.stringify({ type: 'top_10_industries', payload: top10 }));
        ws.send(JSON.stringify({ type: 'jobs_info', payload: jobInfos }));
    } catch (error) {
        console.error('Error sending initial top 10 data:', error);
    }
});

// MongoDB change stream event handler
const changeStreamCompanyCountModel = CompanyCountModel.watch();
changeStreamCompanyCountModel.on('change', async (change) => {
    console.log('Change stream event:', change);

    try {
        const top10 = await getTop10Industries();
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'batch', payload: top10 }));
            }
        });
    } catch (error) {
        console.error('Error fetching and sending top 10 data:', error);
    }
});



const changeStreamJobsInfoModel = JobsInfoModel.watch();
changeStreamJobsInfoModel.on('change', async (change) => {
    console.log('Change stream event:', change);

    try {
        const maxSalary = await getMaxSalary();
        const minSalary = await getMinSalary();
        const totalJobs = await getTotalJobs();
        const totalCompanies = await getTotalCompanies();
        const medianSalary = await getMedianSalaryData();
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'jobs_info', payload: { maxSalary, minSalary, totalJobs, totalCompanies, medianSalary } }));
            }
        }
        );
    } catch (error) {
        console.error('Error fetching and sending top 10 data:', error);
    }

});