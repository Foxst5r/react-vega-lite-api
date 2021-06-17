import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useRef } from "react";
import * as v1 from "vega-lite-api";
import * as vega from "vega";
import * as vegaLite from "vega-lite";
import { Handler } from "vega-tooltip";
import { csv } from "d3";

async function getData(url) {
  const data = await csv(url);
  console.log(data[0]);
  return data;
}

const dataUrl =
  "https://gist.githubusercontent.com/curran/8c131a74b85d0bb0246233de2cff3f52/raw/194c2fc143790b937c42bf086a5a44cb3c55340e/auto-mpg.csv";

const viz = v1
  .markPoint({ size: 300, opacity: 0.5 })
  .encode(
    v1.x().fieldQ("mpg").scale({ zero: false }),
    v1.y().fieldQ("weight").scale({ zero: false }),
    v1.color().fieldN("origin"),
    v1.size().fieldQ("weight"),
    v1.tooltip().fieldN("name")
  );

const VegaLiteComponent = () => {
  const chartRef = useRef(null);
  useEffect(() => {
    v1.register(vega, vegaLite, {
      view: { renderer: "svg" },
      init: (view) => {
        view.tooltip(new Handler().call());
      },
    });

    getData(dataUrl).then((data) => {
      viz
        .data(data)
        .width(window.innerWidth)
        .height(window.innerHeight)
        .autosize({ type: "fit", contains: "padding" })
        .render()
        .then((chart) => {
          chartRef.current.appendChild(chart);
        });
    });
  }, []);

  return <div ref={chartRef}></div>;
};

function App() {
  return <VegaLiteComponent />;
}

export default App;
