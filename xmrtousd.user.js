// ==UserScript==
// @run-at          document-end
// @name            XMR to USD for SupportXMR.com Dashboard
// @namespace       xmrtousdsupportxmr
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

    // #### definitions ####
    var version = GM_info.script.version;
    var exchangeUrl = "https://poloniex.com/public?command=returnTicker";

    // ### start that boy ###
    console.log("XMR to USD - " + version);
    console.log("by kai-grassnick.de");

    $(document).ready(startEnd());

    function startEnd(){
        setTimeout(function() {
            addExcangeCurse();
            autoUpdateValue();
        }, 1000);
    }

    function autoUpdateValue() {
        setInterval(function () {
            getExchangeCurse();
            console.log("Curse update ...");
        }, 2000);
    }

    function addExcangeCurse() {
        var headlines = $("#content").find("h4");
        headlines.each(function () {
            if($(this).text() === " Total Due"){
                var path = $(this).parent().find("h2").attr("id", "saveing_value");
                appendExchangeValue(path);
            }
        });
    }

    function appendExchangeValue(element) {
        element.append(
            $("<span/>")
                .attr("id", "exchange_value")
                .css({"padding-left":"5px", "color": "#777", "font-size": "14px"})
                .text("(0.000 USD)")
        );
    }

    function getSaveings() {
        var value =  $("#saveing_value").text().slice(0,4);
        return parseFloat(value);
    }

    function getExchangeCurse() {
        $.getJSON( exchangeUrl, function( data ) {
            var saveings = getSaveings();
            var value = data.USDT_XMR.last * saveings;

            updateExchangeValue(value);
        });
    }

    function updateExchangeValue(value) {
        $("#exchange_value").text("(" + value.toFixed(4) + " USD)");
    }
}());
