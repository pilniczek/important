---
title: Libraries for graphs and charts
tags:
  - Charts
type: Tool
---

# UNOVIS

specials :

- variety of chart types, including scatterplots, line charts, and heatmaps
- interactive data visualizations

pros:

- it has maps grafs
- good docs, looks like Mui Docs
- it has theming
- react and typescript friendly

docs:

[https://unovis.dev/gallery](https://unovis.dev/gallery)

# VICTORY

specials:

- wide range of chart types including bar, line, scatter, and area charts
- lot of customization options such as colors, labels, and tooltips
- ability to handle large datasets without compromising on performance

pros:

- many types of of charts and graphs
- GOOD CUSTOMIZATION OPTIONS
- our team  ALREADY WORKED WITH VICTORY

cons:

- it is not possible to set number of decimals for numbers (labels) on axis
- it is not possible to explicitly define amount of labels on axis [https://formidable.com/open-source/victory/docs/victory-label#victorylabel](https://formidable.com/open-source/victory/docs/victory-label#victorylabel)

docs:

[https://formidable.com/open-source/victory/gallery](https://formidable.com/open-source/victory/gallery)

# RECHARTS

specials:

- wide range of chart types including line, area, bar, scatter, pie
- responsive design that automatically adjusts to different screen sizes
- customization options such as colors, labels, and tooltips

pros:

- It has a responsive design that automatically adjusts to different screen sizes
- compatible with most data formats and can handle large datasets.
- Pretty good animation during charts loading

docs:

[https://recharts.org/en-US/examples](https://recharts.org/en-US/examples)

# Chart.js

There is a react package for it, [`react-chartjs-2`](https://www.npmjs.com/package/react-chartjs-2) which looks like something we would like to use instead of clear chart.js

specials:

- Responsive design
- React components out of the box with `react-chartjs-2`

cons:

- only client-side rendering onto canvas
- react-chartjs-2 has no documentation on it’s own. One has to use the Chartjs documentation and figure out how to combine it together.

# MUI React charts

New player it seems on react libraries.

specials:

- it is designed by Mui, so it fits into the MUI ecosystem
- Native log axis and transpose of data

cons:

- Really new
- In Next.js it requires to add `transpilePackages: ['@mui/x-charts']` to `next.config.js`. This might change in the future, so check it before next project [here](https://mui.com/x/react-charts/getting-started/).
- Somewhat harder customization of axis transformation - [they want to add it later](https://mui.com/x/react-charts/getting-started/).

# Title about another libraries :

[https://blog.logrocket.com/top-8-react-chart-libraries/](https://blog.logrocket.com/top-8-react-chart-libraries/)
