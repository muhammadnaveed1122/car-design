import { useMantineColorScheme } from '@mantine/core';
import { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { carService } from "@/services";

export default function PieChart() {

  const { colorScheme } = useMantineColorScheme();

  const options = {
    title: "Auction Car Makes",
    titleTextStyle:{
      color: colorScheme === 'light' ? '#000' : '#fff',
      fontSize: 16, // Adjust the font size as needed

    },
    is3D: true,
    pieSliceText: "label",
    backgroundColor: colorScheme === 'light' ? '#fff' : '#25262b',
    legend: "none",
    tooltip: {
      textStyle: {
        color: "#000", // Change tooltip text color to black
      },
    },
  };

  const [data, setData] = useState([["Make", "Count of Each Make"], ['Total', 100]]);

  useEffect(() => {
    carService.getMakesCount()
      .then((res) => {
        const stats = res.map((d) => [
          d.make.length > 5 ? d.make.substring(0, 3) : d.make,
          d.makes_count
        ]);
        setData([["Make", "Count of Each Make"], ...stats]);
      });
  }, []);

  return (
    <div className="editPieChart">
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={"100%"}
        height={"400px"}
      />
    </div>
  );
}