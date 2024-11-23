$(function(){

    chrome.storage.sync.get(['total','limit'],function(budget){
        $('#total').text(budget.total);
        $('#limit').text(budget.limit);
        if (budget.total >= budget.limit){
            $('#message').text("Uh oh! You've exceeded your spending limit.");
        }
    });

    $('#spendAmount').click(function(){
        chrome.storage.sync.get(['total', 'limit'], function(budget){
            var newTotal = 0;
            if (budget.total){
                newTotal += parseInt(budget.total);
            }

            var amount = $('#amount').val();
            if (amount){
                newTotal += parseInt(amount);
            }

            chrome.storage.sync.set({ 'total': newTotal }, function() {
                // Check if the total exceeds the limit
                if (newTotal + amount >= budget.limit) {
                    $('#message').text("Uh oh! You've exceeded your spending limit.");
                } else {
                    $('#message').text(""); // Clear the message if under limit
                }
            });

            $('#total').text(newTotal);
            $('#amount').val('');
        });
    });
});