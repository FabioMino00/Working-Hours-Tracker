// Handle "Today" button
document.getElementById('todayButton').addEventListener('click', () => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;
  openHistoryPage(startOfDay, endOfDay);
});

// Handle "Yesterday" button
document.getElementById('yesterdayButton').addEventListener('click', () => {
  const today = new Date();
  const startOfYesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1).getTime();
  const endOfYesterday = startOfYesterday + 24 * 60 * 60 * 1000 - 1;
  openHistoryPage(startOfYesterday, endOfYesterday);
});

// Handle "The Other day" button
document.getElementById('otherdayButton').addEventListener('click', () => {
  const today = new Date();
  const startOfYesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2).getTime();
  const endOfYesterday = startOfYesterday + 24 * 60 * 60 * 1000 - 1;
  openHistoryPage(startOfYesterday, endOfYesterday);
});

// Handle "Specific Day" button
document.getElementById('specificDayButton').addEventListener('click', () => {
  const specificDayInput = document.getElementById('specificDayInput').value;
  if (!specificDayInput) {
    alert('Please select a date.');
    return;
  }
  const specificDay = new Date(specificDayInput);
  const startOfDay = new Date(specificDay.getFullYear(), specificDay.getMonth(), specificDay.getDate()).getTime();
  const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;
  openHistoryPage(startOfDay, endOfDay);
});

// Function to open the history page with the selected date range
function openHistoryPage(startTime, endTime) {
  const url = chrome.runtime.getURL('../views/history.html') + `?startTime=${startTime}&endTime=${endTime}`;
  chrome.tabs.create({ url });
}