// ==UserScript==
// @run-at          document-idle
// @name            SupportXMR.com enhancement
// @namespace       supportxmrenhancement
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @grant           GM_log
// @grant           GM_getResourceURL
// @description     Private functions.
// @version         1.0.0
// @author          kai-grassnick.de
// @include         http://*.supportxmr.*
// @include         http://supportxmr.*
// @include         https://*.supportxmr.*
// @include         https://supportxmr.*
// ==/UserScript==

(function () {
    "use strict";

    // #####################
    // #### definitions ####
    // #####################
    var version = GM_info.script.version;

    // ---- exchange calculator ----
    // Api which returns a JSON String including the latest XMR to USD price
    var exchangeUrl = "https://poloniex.com/public?command=returnTicker";

    // Set exchange value update interval in seconds
    var exchangeUpdateInterval = 10;


    // ##############################
    // #### Actual functionality ####
    // ##############################
    var appendExchangeValue = function(element)
    {
        element.append(
            $("<span/>")
                .attr("id", "exchange_value")
                .css({"padding-left":"5px", "color": "#777", "font-size": "14px"})
                .text("(0.000 USD)")
        );
    };


    var addExcangeWrapper = function()
    {
        var headlines = $("#content").find("h4");
        headlines.each(function() {
            if($(this).text() === " Total Due"){
                var path = $(this).parent().find("h2").attr("id", "saving_value");
                appendExchangeValue(path);
            }
        });
    };


    var getSavings = function()
    {
        var value =  $("#saving_value").text().slice(0,4);
        return parseFloat(value);
    };


    var setExchangeValue = function(value)
    {
        $("#exchange_value").text("(" + value.toFixed(4) + " USD)");
    };


    var updateExchangeValue = function()
    {
        $.getJSON( exchangeUrl, function(data) {
            var savings = getSavings();
            var value = data.USDT_XMR.last * savings;

            setExchangeValue(value);
        });
    };


    var autoUpdateValue = function()
    {
        setInterval(function() {
            updateExchangeValue();
        }, exchangeUpdateInterval * 1000);
    };


    // ####################
    // #### Bootloader ####
    // ####################
    var startLog = function()
    {
        console.log("supportXMR enhancement - " + version);
        console.log("by kai-grassnick.de");
    };


    var init = function()
    {
        addExcangeWrapper();
        updateExchangeValue();
        autoUpdateValue();
    };


    var bootWrapper = function()
    {
        // Show credits
        startLog();

        // Angular is a slow child, wait for him to be ready and do the magic afterwards
        var initWatcher = setInterval(function() {
            if (unsafeWindow.angular) {
                clearInterval(initWatcher);
                init();
            }
        }, 100);
    };


    // Trigger the start button
    bootWrapper();
}());
