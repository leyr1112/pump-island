import React, { useEffect, useRef, useState } from "react";
import { createChart, CrosshairMode } from "lightweight-charts";
import PropTypes from "prop-types";

const MyChart = ({ data, ethPrice }) => {
  const [created, setCreated] = useState(false);
  const chartContainerRef = useRef();
  const chart = useRef(null);
  const newSeries = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const chartOptions = {
      handleScale: { axisPressedMouseMove: true },
      layout: {
        backgroundColor: "#151515",
        textColor: "#aaaaaa",
      },
      grid: {
        vertLines: { color: "rgba(200, 200, 200, 0.2)" },
        horzLines: { color: "rgba(200, 200, 200, 0.2)" },
      },
      crosshair: { mode: CrosshairMode.Normal }, // ✅ Cursore libero
      priceScale: {
        borderColor: "#f3cc2f",
        priceLineVisible: true,
        priceLabelVisible: true,
      },
      timeScale: {
        borderColor: "#f3cc2f",
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
        rightOffset: 10,
      },
    };

    if (!created) {
      chart.current = createChart(chartContainerRef.current, chartOptions);
      newSeries.current = chart.current.addCandlestickSeries({
        priceFormat: { type: "price", precision: 9, minMove: 0.000000001 },
      });
      setCreated(true);
    }

    // 🔥 Tooltip sopra la chart con Open, High, Low, Close e Volume
    if (chart.current) {
      chart.current.subscribeCrosshairMove((param) => {
        if (!tooltipRef.current) return;

        if (!param || !param.seriesData || !newSeries.current) return;

        const candleData = param.seriesData.get(newSeries.current);
        if (!candleData) return;

        const { time, open, high, low, close, volume } = candleData;
        const date = new Date(time * 1000).toISOString().slice(0, 16).replace("T", " ");

        // ✅ Mantiene il tooltip fisso nella parte superiore
        tooltipRef.current.innerHTML = `
          <div style="display: flex; gap: 10px; font-family: monospace; background: rgba(0,0,0,0.9); padding: 8px; border-radius: 5px;">
            <span><b>Time:</b> ${date}</span>
            <span><b>Open:</b> ${open.toFixed(9)}</span>
            <span><b>High:</b> ${high.toFixed(9)}</span>
            <span><b>Low:</b> ${low.toFixed(9)}</span>
            <span><b>Close:</b> ${close.toFixed(9)}</span>
            <span><b>Volume:</b> ${volume ? volume.toFixed(2) : "N/A"}</span>
          </div>
        `;
        tooltipRef.current.style.display = "block";
      });
    }
  }, [created]);

  useEffect(() => {
    if (data.length > 0) {
      let tokenPriceDatas = [];

      data.reverse().forEach((item) => {
        const price = (item.parsedJson.sui_amount / item.parsedJson.token_amount / 1000) * ethPrice;
        const bucketStart = Math.floor(Number(item.parsedJson.ts) / 1000 / 300) * 300;

        if (tokenPriceDatas.length === 0) {
          tokenPriceDatas.push({
            time: bucketStart,
            open: price,
            close: price,
            high: price,
            low: price,
            volume: item.parsedJson.sui_amount,
          });
        } else {
          if (bucketStart !== tokenPriceDatas[tokenPriceDatas.length - 1].time) {
            tokenPriceDatas.push({
              time: bucketStart,
              open: tokenPriceDatas[tokenPriceDatas.length - 1].close,
              close: price,
              high: price,
              low: price,
              volume: item.parsedJson.sui_amount,
            });
          } else {
            tokenPriceDatas[tokenPriceDatas.length - 1].high = Math.max(price, tokenPriceDatas[tokenPriceDatas.length - 1].high);
            tokenPriceDatas[tokenPriceDatas.length - 1].low = Math.min(price, tokenPriceDatas[tokenPriceDatas.length - 1].low);
            tokenPriceDatas[tokenPriceDatas.length - 1].close = price;
            tokenPriceDatas[tokenPriceDatas.length - 1].volume += item.parsedJson.sui_amount;
          }
        }
      });

      if (tokenPriceDatas.length > 0) {
        newSeries.current.setData(tokenPriceDatas);
        chart.current.timeScale().fitContent();
      }
    }
  }, [data]);

  return (
    <div className="chartTab_outer px-6" style={{ position: "relative" }}>
      {/* 🔥 Tooltip fisso sopra la chart */}
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          top: "5px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0, 0, 0, 0.9)",
          color: "#fff",
          padding: "8px",
          borderRadius: "5px",
          fontSize: "14px",
          display: "none",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          zIndex: "1000",
        }}
      ></div>

      <div className="chartTab_container">
        <div
          ref={chartContainerRef}
          style={{
            width: "100%",
            height: "100%",
            border: "solid #b04851 1px",
          }}
        ></div>
      </div>
    </div>
  );
};

MyChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default MyChart;
