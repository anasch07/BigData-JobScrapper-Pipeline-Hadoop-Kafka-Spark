import {JobsInfo, medianSalary} from "@/app/types/jobsInfo";


export function createChartData(dataArray:medianSalary[]) {
    console.log('here')
    console.log(dataArray)
    // Extract dates, min salaries, and max salaries
    const dates = dataArray.map(item => item.date);
    const minSalaries = dataArray.map(item => item.medianMinSalary);
    const maxSalaries = dataArray.map(item => item.medianMaxSalary);

    // Create chart data object
    const chartData = {
        labels: dates,
        datasets: [
            {
                label: 'Min Salary',
                data: minSalaries,
                borderWidth: 2,
                fill: true,
                backgroundColor: ['rgba(255, 255, 255, 1)'],
                borderColor: ['rgb(255,0,98)']
            },
            {
                label: 'Max Salary',
                data: maxSalaries,
                borderWidth: 2,
                fill: true,
                backgroundColor: ['rgba(86, 11, 208, .05)'],
                borderColor: ['rgb(11,208,50)']
            }
        ]
    };

    return chartData;
}

