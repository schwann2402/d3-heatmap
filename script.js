const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    const dataset = data.monthlyVariance;
    console.log(dataset);
    const width = 1000;
    const height = 600;
    const padding = 20;
    const baseTemp = 8.66;
    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const minYear = d3.min(dataset, (d) => d.year);
    const maxYear = d3.max(dataset, (d) => d.year);

    const xScale = d3
      .scaleTime()
      .domain([new Date(minYear), new Date(maxYear)])
      .range([padding, width - padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

    const yScale = d3
      .scaleLinear()
      .domain([12, 1])
      .range([height - padding, padding]);

    const tickLabels = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const fixedLabels = tickLabels.reverse();
    const yAxis = d3.axisLeft(yScale).tickFormat((d, i) => tickLabels[i]);

    svg
      .append("g")
      .attr("transform", `translate(40, ${height - padding})`)
      .call(xAxis)
      .attr("id", "x-axis");

    svg
      .append("g")
      .attr("transform", `translate(${padding + 40}, 0)`)
      .call(yAxis)
      .attr("id", "y-axis");

    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("x", (d) => xScale(new Date(d.year)) + 40)
      .attr("y", (d) => yScale(d.month) + 40 - 90)
      .attr("width", 20)
      .attr("height", 50)
      .attr("data-month", (d) => d.month - 1)
      .attr("data-year", (d) => d.year)
      .attr("data-temp", (d) => d.variance + baseTemp)
      .style("fill", (d) => {
        const tempDiff = baseTemp + d.variance;
        if (tempDiff <= 3.9) {
          return "#1c7ce7";
        } else if (tempDiff <= 5.0) {
          return "#60c0df";
        } else if (tempDiff <= 6.1) {
          return "#d6e1e4";
        } else if (tempDiff <= 7.2) {
          return "rgb(224, 243, 248)";
        } else if (tempDiff <= 8.3) {
          return "rgb(255, 255, 191)";
        } else if (tempDiff <= 9.5) {
          return "rgb(254, 224, 144)";
        } else if (tempDiff <= 10.6) {
          return "rgb(253, 174, 97)";
        } else if (tempDiff <= 11.7) {
          return "rgb(244, 109, 67)";
        }
        return "rgb(215, 48, 39)";
      })
      .on("mouseover", (e, d) => {
        const tooltip = d3.select("#tooltip");

        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0.7)
          .style("left", `${e.pageX + 10}px`)
          .style("top", `${e.pageY + 10}px`);

        tooltip
          .attr("data-year", d.year)
          .html(
            `Year: ${d.year} <br> Temperature: ${
              d.variance + baseTemp
            } <br> Month: ${monthFixer(d.month)}`
          );
      })
      .on("mouseleave", () => tooltip.style("opacity", 0));

    const monthFixer = (month) => {
      switch (month) {
        case 1:
          return "January";
        case 2:
          return "February";
        case 3:
          return "March";
        case 4:
          return "April";
        case 5:
          return "May";
        case 6:
          return "June";
        case 7:
          return "July";
        case 8:
          return "August";
        case 9:
          return "September";
        case 10:
          return "October";
        case 11:
          return "November";
        case 12:
          return "December";
      }
    };

    const rectFills = [
      "#1c7ce7",
      "#60c0df",
      "#d6e1e4",
      "rgb(224, 243, 248)",
      "rgb(254, 224, 144)",
      "rgb(253, 174, 97)",
      "rgb(244, 109, 67)",
      "rgb(215, 48, 39)",
    ];

    const legendContainer = svg.append("legend").attr("id", "legend");
    const legendBox = legendContainer.append("g");

    legendBox
      .selectAll("rect")
      .data(rectFills)
      .enter()
      .append("rect")
      .style("height", "10px")
      .style("width", "10px")
      .style("fill", (d) => d)
      .text("Hello");

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "rgba(0,0,0,0.8)")
      .style("color", "#fff")
      .style("padding", "10px")
      .style("font-size", "12px");
  });
