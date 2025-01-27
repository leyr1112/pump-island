import React, { useEffect, useRef, useState } from "react";
import { createChart, CrosshairMode } from "lightweight-charts";
import PropTypes from 'prop-types'

const MyChart = ({
  data,
  ethPrice
}) => {
  const [created, setCreated] = useState(false);
  var newSeries = useRef(null);
  const chartContainerRef = useRef();
  var chart = useRef(null);
  useEffect(() => {
    const chartOptions = {
      handleScale: {
        axisPressedMouseMove: true
      },
      width: chartContainerRef.current.width,
      height: chartContainerRef.current.height,
      layout: {
        backgroundColor: "#151515",
        textColor: "#aaaaaa"
      },
      grid: {
        vertLines: {
          color: "#f3cc2f"
        },
        horzLines: {
          color: "#f3cc2f"
        }
      },
      crosshair: {
        mode: CrosshairMode.Normal
      },
      priceScale: {
        borderColor: "#f3cc2f"
      },
      timeScale: {
        borderColor: "#f3cc2f",
        timeVisible: true,
        secondVisible: true,
      },

    };
    if (created === false) {
      chart.current = createChart(chartContainerRef.current, chartOptions);
      chart.current.timeScale().fitContent();
      newSeries.current = chart.current.addCandlestickSeries();
      newSeries.current.applyOptions({
        priceFormat: {
          type: 'price',
          precision: 9,
          minMove: 0.000000001,
        },
      })
      setCreated(true)
    }
  }, [created]);

  useEffect(() => {
    if (data.length > 0) {
      let currentBucket;
      let tokenPriceDatas = [];
      data.reverse().forEach(item => {
        const bucketStart = Math.floor(Number(item.parsedJson.ts) / 300000) * 300000;
        const price = item.parsedJson.sui_amount / item.parsedJson.token_amount / 1000 * ethPrice
        if (!currentBucket || currentBucket.start !== bucketStart) {
          if (currentBucket) tokenPriceDatas.push(currentBucket);
          currentBucket = {
            time: bucketStart / 1000,
            open: price,
            high: price,
            low: price,
            close: price,
          };
        } else {
          currentBucket.high = Math.max(currentBucket.high, price);
          currentBucket.low = Math.min(currentBucket.low, price);
          currentBucket.close = price;
        }
      });

      if (tokenPriceDatas.length > 0) {
        newSeries.current.setData(
          tokenPriceDatas
        );
      }
    }
  }, [data]);

  return (
    <div className="chartTab_outer px-6">
      <div className="chartTab_container">
        <div
          ref={chartContainerRef}
          style={{
            width: "100%",
            height: "100%",
            border: 'solid #b04851 1px'
          }}
        ></div>
      </div>
    </div>
  )
}

MyChart.propTypes = {
  data: PropTypes.array.isRequired,
}

export default MyChart