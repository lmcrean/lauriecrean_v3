# Agile Development

Below is my active Epic Board that tracks a comprehensive list of projects in progress.


## Foundation Projects Epic



All 3 layers of Epic, Sprints and User Stories are embedded below. Notion Page can also be accessed [here](https://mire-barge-ea7.notion.site/18674616656880aea592ce6849e79ffe?v=186746166568807c9cf8000c5081ed97).


<iframe src="https://v2-embednotion.com/18c746166568809cbb49e62484f4342c" style="width: 100%; height: 80vh; border: 0px solid #ccc; border-radius: 10px; padding: none;"></iframe>

# Methodology

The methodology is based on the Kanban Methodology and aims to be as simple as possible.

## Layers

The layers of the board are as follows:

- **Epic (Top level)** 
  - A collection of Sprints towards a specific value

- **Sprint** 
  - Nested under an Epic
  - A collection of User Stories towards a specific goal
  - Must be Specific, Measurable, Achievable, Relevant
   
- **User Story**
  - Nested under a Sprint
  - Must be Specific, Measurable, Achievable, Relevant
  - is assigned an acceptance criteria with specific tasks


## Horizontal Column Ordering by Task Status
Sprints and User Story layers (used interchangeably here as "features") are organised into 5 horizontal columns:

<table>
  <tr>
    <th>Not Started</th>
    <th>Planning</th>
    <th>In Development</th>
    <th>Quality Assurance</th>
    <th>Done</th>
  </tr>
  <tr>
    <td>
      <ul>
        <li>Feature has not started</li>
        <li>May be dependent on other features</li>
        <li>Includes Someday/Maybe</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>Feature is still being clarified</li>
        <li>Feature is still being designed on Figma</li>
        <li>Code Architecture is being designed</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>Feature is being worked on in Code</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>Feature is being tested with automated tests</li>
        <li>Less than 100% pass rate</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>Testing achieves 100% pass rate</li>
        <li>Feature is deployed and has passed all quality assurance</li>
        <li>This label is hidden from the workflow</li>
      </ul>
    </td>
  </tr>
</table>

## Vertical Sorting by Importance

Sprints and User Stories are sorted vertically by urgency, considering the value and viability scores, with most urgent and important tasks at the top.

<div style="color:lightgreen"><b>Value Score</b></div>

* Sprints and User Stories are assigned a value score out of 10 (green), 10 being the highest value

<div style="color:lightblue"><b>Viability Score</b></div>

* Sprints and User Stories are assigned a viability score out of 10 (blue), 10 being the highest viability and 0 having the most blockers</div>

