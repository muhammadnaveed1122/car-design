import { useMantineColorScheme } from '@mantine/core';
import { Chart } from "react-google-charts";
import { faker } from '@faker-js/faker';
import moment from 'moment/moment';

const now = new Date();
let monList = [];
for (let m = 6; m > 0; -- m)
  monList.push(new Date(moment(now).subtract(m, 'months')).toLocaleDateString("en-US", {year: 'numeric', month: 'short'}));

const data = [
  ["Date", "Import", "Sales"],
  ...monList.map((m, i) => {
    return [m, faker.number.int({ min: 30, max: 50 }), faker.number.int({ min: 20, max: 50 })];
  })
];

export default function SplineChart() {  

  const { colorScheme } = useMantineColorScheme();
  
  const options = {
    title: "Import & Sale on Car Auction",
    hAxis: { titleTextStyle: { color: "#333" } },
    vAxis: { minValue: 0 },
    chartArea: { width: "70%", height: "70%" },
    colors: ['#20C997', '#4C6EF5'],
    backgroundColor: colorScheme === 'light' ? '#fff' : '#25262b',
  };

  return (
    <Chart
      chartType="AreaChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
}