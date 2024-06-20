import LineChartComponent from "../../../common/line-chart/line-chart.component";

const PerformanceChart = () => {
    const data = [
        { date: '2024-01-01', value: 400 },
        { date: '2024-01-02', value: 300 },
        { date: '2024-01-03', value: 500 },
        { date: '2024-01-04', value: 700 },
        { date: '2024-01-05', value: 200 },
        // Add more data points as needed
    ];

    return (
        <div className="performance-chart-container">
            <LineChartComponent data={data} />
        </div>
    );
}

export default PerformanceChart;