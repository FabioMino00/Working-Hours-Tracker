document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  let startTime = parseInt(urlParams.get('startTime'), 10);
  let endTime = parseInt(urlParams.get('endTime'), 10);

  // Fixed range: 8:30 AM to 6:30 PM
  const fixedStartHour = 8.5; // 8:30 AM
  const fixedEndHour = 18.5; // 6:30 PM

  // Adjust startTime and endTime to fit within the fixed range
  const startOfDay = new Date(startTime).setHours(0, 0, 0, 0); // Start of the day
  startTime = startOfDay + fixedStartHour * 60 * 60 * 1000; // 8:30 AM
  endTime = startOfDay + fixedEndHour * 60 * 60 * 1000; // 6:30 PM

  const intervalMinutes = 30; // 30-minute intervals
  const millisecondsPerMinute = 1000 * 60;

  // Generate time intervals
  const timeIntervals = [];
  for (let time = startTime; time < endTime; time += intervalMinutes * millisecondsPerMinute) {
    const start = new Date(time);
    const end = new Date(time + intervalMinutes * millisecondsPerMinute);
    timeIntervals.push({ start, end });
  }

  // Load project options from JSON
  fetch('../data/projects.json')
    .then((response) => response.json())
    .then((projects) => {
      chrome.history.search({ text: '', startTime, endTime }, (historyItems) => {
        const tableBody = document.getElementById('history-table');

        // Group history items by time intervals
        timeIntervals.forEach(({ start, end }) => {
          const matchingItems = historyItems.filter((item) => {
            const lastVisitTime = new Date(item.lastVisitTime);
            return lastVisitTime >= start && lastVisitTime < end;
          });

          // Create a row for the time interval
          const row = document.createElement('tr');
          const timeRange = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          const historyDetails = matchingItems.map((item) => {
            const trimmedUrl = item.url.length > 50 ? `${item.url.slice(0, 47)}...` : item.url; // Trim URL to 50 characters
            return `
              <div>
                <strong>URL:</strong> <a href="${item.url}" target="_blank">${item.url}</a><br>
                <strong>Title:</strong> ${item.title || 'No title'}<br>
                <strong>Last Visit:</strong> ${new Date(item.lastVisitTime).toLocaleString()}
              </div>
            `;
          }).join('<hr>');

          // Create a simple dropdown for the "Project" column
          const projectDropdown = `
            <select class="form-select project-select">
              <option value="" disabled selected>Select a project</option>
              ${projects.map((project) => `<option value="${project}">${project}</option>`).join('')}
            </select>
          `;

          row.innerHTML = `
            <td>${timeRange}</td>
            <td>${historyDetails || 'No entries'}</td>
            <td>${projectDropdown}</td>
          `;
          tableBody.appendChild(row);
        });

        // Add event listener to the "Calculate Hours" button
        const calculateButton = document.getElementById('calculate-hours');
        calculateButton.addEventListener('click', () => {
          const projectHours = {};
          const dropdowns = document.querySelectorAll('.project-select');

          dropdowns.forEach((dropdown) => {
            const selectedProject = dropdown.value;
            if (selectedProject) {
              projectHours[selectedProject] = (projectHours[selectedProject] || 0) + 0.5; // Each interval is 0.5 hours
            }
          });

          // Populate the results table
          const resultsTable = document.getElementById('results-table');
          const resultsBody = resultsTable.querySelector('tbody');
          resultsBody.innerHTML = ''; // Clear previous results

          for (const [project, hours] of Object.entries(projectHours)) {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${project}</td>
              <td>${hours}</td>
            `;
            resultsBody.appendChild(row);
          }

          // Update total hours
          const totalHours = Object.values(projectHours).reduce((sum, hours) => sum + hours, 0);
          document.getElementById('total-hours').textContent = totalHours;

          // Show the results table
          resultsTable.style.display = 'table';
        });
      });
    });
});