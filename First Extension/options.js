$(function () {
    // Load the current limit and reset time from Chrome storage
    chrome.storage.sync.get(['limit', 'resetTime'], function (data) {
        // Set the limit in the input field
        $('#limit').val(data.limit || 0);

        const currentTime = new Date(); // Get the current date and time
        const currentTimeMillis = currentTime.getTime(); // Get the current time in milliseconds

        // If no reset time exists, initialize it to 1 month from now, at 12:00 AM
        if (!data.resetTime) {
            const nextResetTime = getNextMonthMidnight(currentTime); // Get next month's midnight time
            chrome.storage.sync.set({ 'resetTime': nextResetTime }, function () {
                displayNextReset(nextResetTime); // Display the initial reset time
            });
        } else {
            // If resetTime exists, check if it's time to reset
            if (currentTimeMillis >= data.resetTime) {
                chrome.storage.sync.set({ 'total': 0 }, function () {
                    console.log("Total has been automatically reset.");
                });

                // Set the next reset time to 1 month from now, at midnight
                const nextResetTime = getNextMonthMidnight(currentTime);
                chrome.storage.sync.set({ 'resetTime': nextResetTime });
                displayNextReset(nextResetTime); // Display the updated reset time
            } else {
                // Display the existing reset time
                displayNextReset(data.resetTime);
            }
        }
    });

    // Save the limit
    $('#saveLimit').click(function () {
        const limit = $('#limit').val();
        if (limit) {
            chrome.storage.sync.set({ 'limit': parseInt(limit) }, function () {
                console.log("Limit saved:", limit);
                close(); // Close the popup after saving
            });
        }
    });

    // Reset total manually and also reset the clock
    $('#resetTotal').click(function () {
        // Reset the total to 0
        chrome.storage.sync.set({ 'total': 0 }, function () {
            console.log("Total manually reset to 0.");
        });

        // Set the reset time to 1 month from now, at midnight
        const currentTime = new Date();
        const nextResetTime = getNextMonthMidnight(currentTime);
        chrome.storage.sync.set({ 'resetTime': nextResetTime }, function () {
            console.log("Reset time updated to:", nextResetTime);
        });

        // Display the updated reset time
        displayNextReset(nextResetTime);
    });

    // Function to calculate the next month's reset time at 12:00 AM
    function getNextMonthMidnight(currentDate) {
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(currentDate.getMonth() + 1); // Set to next month
        nextMonth.setHours(0, 0, 0, 0); // Set time to 12:00 AM

        return nextMonth.getTime(); // Return the reset time in milliseconds
    }

    // Function to display the next reset time
    function displayNextReset(resetTime) {
        const resetDate = new Date(resetTime);
        const formattedDate = resetDate.toLocaleString(); // Convert to a human-readable date format
        $('#nextResetTime').text("Next reset time: " + formattedDate); // Display the formatted date
    }
});