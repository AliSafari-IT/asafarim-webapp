# D3 Cheat Sheet

Date: 2025-01-05

A quick reference guide to commonly used D3 snippets.

---

## Selection

- **d3.select(selector)**  
  Selects the first element that matches the given selector string.

- **d3.selectAll(selector)**  
  Selects all elements that match the given selector string.

- **.append(name)**  
  Appends a new element of type `name` (e.g. `"svg"`, `"g"`, `"text"`, etc.) inside each selected element.

- **.attr(name, value)**  
  Sets an attribute for the selected element(s).

- **.style(name, value)**  
  Sets a CSS property for the selected element(s).

- **.text(value)**  
  Sets the `textContent` of the selected element(s).

- **.html(value)**  
  Sets the `innerHTML` of the selected element(s).

---

## Data Binding

- **.data(data)**  
  Joins the specified array of data with the selected DOM elements.

- **.enter()**  
  Returns the “enter” selection: placeholder elements for each data element that does not yet have a corresponding existing DOM element.

- **.exit()**  
  Returns the “exit” selection: the elements that are no longer bound to data.

- **.merge(selection)**  
  Merges the enter selection with the existing selection.

---

## Drawing Basics

- **Creating an SVG**
  ```js
  const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  ```

- **Adding a Group**
  ```js
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  ```

- **Drawing Shapes**
  - Rectangle:
    ```js
    g.append("rect")
      .attr("x", 10)
      .attr("y", 10)
      .attr("width", 100)
      .attr("height", 50)
      .style("fill", "steelblue");
    ```
  - Circle:
    ```js
    g.append("circle")
      .attr("cx", 60)
      .attr("cy", 60)
      .attr("r", 20)
      .style("fill", "orange");
    ```
  - Line:
    ```js
    g.append("line")
      .attr("x1", 10)
      .attr("y1", 10)
      .attr("x2", 100)
      .attr("y2", 100)
      .style("stroke", "black");
    ```

---

## Scales

- **Linear Scale**
  ```js
  const xScale = d3.scaleLinear()
    .domain([0, 100])  // Data domain
    .range([0, width]);  // Pixel range
  ```

- **Band Scale (for categorical data)**
  ```js
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.category))
    .range([0, width])
    .padding(0.1);
  ```

- **Time Scale**
  ```js
  const xScale = d3.scaleTime()
    .domain([new Date(2020, 0, 1), new Date(2021, 0, 1)])
    .range([0, width]);
  ```

---

## Axes

- **Creating an Axis**
  ```js
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  ```

- **Rendering an Axis**
  ```js
  g.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  g.append("g")
    .call(yAxis);
  ```

---

## Transitions

- **Transitions**
  ```js
  selection.transition()
    .duration(1000)
    .attr("width", newWidth);
  ```

  - **.duration(ms)**: How long the transition should last in milliseconds.
  - **.delay(ms)**: How long to wait before starting the transition.
  - **.ease(d3.easeType)**: The easing function for the transition.

---

## Path Generators

- **Line Generator**
  ```js
  const line = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

  g.append("path")
    .datum(data)
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "steelblue");
  ```

- **Area Generator**
  ```js
  const area = d3.area()
    .x(d => xScale(d.x))
    .y0(height)
    .y1(d => yScale(d.y));

  g.append("path")
    .datum(data)
    .attr("d", area)
    .attr("fill", "lightblue");
  ```

---

## Colors

- **d3.schemeCategory10**  
  A 10-color categorical palette.

- **d3.scaleOrdinal(d3.schemeCategory10)**  
  Often used to map a discrete domain to colors.

---

## Useful Snippets

- **Parsing CSV/JSON**
  ```js
  d3.csv("data.csv").then(function(data) {
    // Use data here
  });
  ```

  ```js
  d3.json("data.json").then(function(data) {
    // Use data here
  });
  ```

- **Tooltip on Mouseover**
  ```js
  selection.on("mouseover", function(event, d) {
    // Show tooltip
  })
  .on("mouseout", function(event, d) {
    // Hide tooltip
  });
  ```

---