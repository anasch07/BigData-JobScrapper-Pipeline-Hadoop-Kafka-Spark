"use client";
import Header from "@/app/components/shared/header";
import LoadingScreen from "@/app/components/shared/loading";
import React, {useEffect, useState} from "react";
import {Bar, Line} from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend, ArcElement, BarElement,


} from 'chart.js'
import {chartOptions, data, state, websiteAudienceChartOptions} from "@/app/constantes/chart-data";
import {createChartData} from "@/app/utils/dataTypeTransformer";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement

)

export default function Home() {

    const [industryData, setIndustryData] = useState(data);
    const [jobsInfo, setJobsInfo] = useState({
        maxSalary: 0,
        minSalary: 0,
        totalJobs: 0,
        totalCompanies: 0,
        medianSalary: [
            {
                date: "2024-05-07",
                medianMinSalary: 0,
                medianMaxSalary: 0
            },
            {
                date: "2024-05-07",
                medianMinSalary: 0,
                medianMaxSalary: 0
            }
        ]
    });



    // @ts-ignore
    const TopIndustriesChart = ({ data }) => {
        // Extracting industry names and counts
        const labels = data.map((item: { industry: any; }) => item.industry);
        const counts = data.map((item: { count: any; }) => item.count);

        // Chart data
        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Count',
                    data: counts,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                },
            ],
        };

        // @ts-ignore
        return <Bar data={chartData} options={chartOptions} />;

    }


    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000');
        ws.onopen = () => {
            console.log('connected');
        };
        ws.onmessage = evt => {
            let data = JSON.parse(evt.data);
            if (data.type === 'top_10_industries') {
                setIndustryData(data.payload);
            }
            if (data.type === 'jobs_info') {
                setJobsInfo(data.payload);
            }
        };

        ws.onerror = error => {
            console.error('WebSocket error:', error);
        };
        return () => {
            ws.close();
        };
    }, []);




    const transformedData = createChartData(jobsInfo.medianSalary);


    // @ts-ignore
    return (
        <main className="px-24">
            <Header/>

            <div className="flex flex-col items-center justify-center pt-24">
                <h1 className="text-4xl font-bold text-center">JobDash Insights</h1>
            </div>


            <div className="flex flex-col items-center justify-center pt-12">
                You will find the following insights from different job postings in the market ( LinkedIn, Indeed,
                Glassdoor, Welcome to the Jungle, etc.)
            </div>


            <div className="flex flex-row items-stretch justify-center py-12 gap-12">
                <div
                    className="w-1/2 rounded-lg border border-gray-400 p-8 flex flex-col items-stretch justify-center ">

                    <div className="flex flex-row items-center justify-center pb-4">
                        <h3>
                        <span className="font-bold text-2xl">
                            Min and Max Salaries for the month
                        </span>
                        </h3>
                    </div>

                     {/*@ts-ignore*/}
                    <Line data={transformedData} options={websiteAudienceChartOptions}/>
                </div>


                <div
                    className="w-1/2 rounded-lg border border-gray-400 p-8 flex flex-col items-stretch justify-center ">

                    <div className="flex flex-row items-center justify-center gap-x-8 pb-4">
                        <div
                            className="w-1/2 rounded-lg border border-gray-400 p-8 flex flex-col items-center justify-center">
                            <h3 className="font-bold text-3xl">
                                Max Salary
                            </h3>
                            <span className="text-green-500 font-bold pt-2 text-xl">
                              {jobsInfo.maxSalary}
                            </span>
                        </div>
                        <div
                            className="w-1/2 rounded-lg border border-gray-400 p-8 flex flex-col items-center justify-center">
                            <h3 className="font-bold text-3xl">
                                Min Salary
                            </h3>
                            <span className="text-red-500 font-bold pt-2 text-xl">
                                {jobsInfo.minSalary}
                            </span>
                        </div>
                    </div>


                    <div className="flex flex-row items-center justify-center gap-x-8 pb-4 mt-4">
                        <div
                            className="w-1/2 rounded-lg border border-gray-400 p-8 flex flex-col items-center justify-center">
                            <h3 className="font-bold text-3xl">
                                Total Jobs
                            </h3>
                            <span className=" font-bold pt-2 text-xl">
                                {jobsInfo.totalJobs}
                            </span>
                        </div>
                        <div
                            className="w-1/2 rounded-lg border border-gray-400 p-8 flex flex-col items-center justify-center">
                            <h3 className="font-bold text-3xl">
                                Companies
                            </h3>
                            <span className=" font-bold pt-2 text-xl">
                                {jobsInfo.totalCompanies}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center px-56 pt-12 border border-gray-400 rounded-lg">
                <h3 className="font-bold text-2xl text-center py-4">
                    Top Industries
                </h3>
                <TopIndustriesChart data={industryData}/>
            </div>



            <LoadingScreen isVisible={false}/>
        </main>
    );
}
