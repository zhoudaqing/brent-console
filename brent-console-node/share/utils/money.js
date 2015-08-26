(function(mod,key,isServer){
	/**
     *
	 * 金额帮助类
	 * @author xiongxing
	 */
    mod[key] = {
		/**
		 * @method 金额转换为大小
		 * @param {float} currencyDigits 金额值
		 * @return {string}
		 */
		toBigRMB : function(currencyDigits){
            // Constants:
            var MAXIMUM_NUMBER = 999999999999.99;
            // Predefine the radix characters and currency symbols for output:
            var CN_ZERO = "零",CN_ONE = "壹",CN_TWO = "贰",CN_THREE = "叁",CN_FOUR = "肆",CN_FIVE = "伍",
            	CN_SIX = "陆",CN_SEVEN = "柒",CN_EIGHT = "捌",CN_NINE = "玖",CN_TEN = "拾",
            	CN_HUNDRED = "佰",CN_THOUSAND = "仟",CN_TEN_THOUSAND = "万",CN_HUNDRED_MILLION = "亿",
            	CN_SYMBOL = "人民币",CN_DOLLAR = "元",CN_TEN_CENT = "角",CN_CENT = "分",CN_INTEGER = "整";

            // Variables:
            var integral; // Represent integral part of digit number.
            var decimal; // Represent decimal part of digit number.
            var outputCharacters; // The output result.
            var parts;
            var digits, radices, bigRadices, decimals;
            var zeroCount;
            var i, p, d;
            var quotient, modulus;
            var data = {};

            // Validate input string:
            var currencyDigits = currencyDigits.toString();
            if (currencyDigits == "") {
                data.msg = "Empty input!";
                return data;
            }
            if (currencyDigits.match(/[^,.\d]/) != null) {
                data.msg = "Invalid characters in the input string!";
                return data;
            }
            if ((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
                data.msg = "Illegal format of digit number!";
                return data;
            }

            // Normalize the format of input digits:
            currencyDigits = currencyDigits.replace(/,/g, ""); // Remove comma delimiters.
            currencyDigits = currencyDigits.replace(/^0+/, ""); // Trim zeros at the beginning.
            // Assert the number is not greater than the maximum number.
            if (Number(currencyDigits) > MAXIMUM_NUMBER) {
                data.msg = "Too large a number to convert!";
                return data;
            }

            // Process the coversion from currency digits to characters:
            // Separate integral and decimal parts before processing coversion:
            parts = currencyDigits.split(".");
            if (parts.length > 1) {
                integral = parts[0];
                decimal = parts[1];
                // Cut down redundant decimal digits that are after the second.
                decimal = decimal.substr(0, 2);
            }
            else {
                integral = parts[0];
                decimal = "";
            }
            // Prepare the characters corresponding to the digits:
            digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
            radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
            bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
            decimals = new Array(CN_TEN_CENT, CN_CENT);
            // Start processing:
            outputCharacters = "";
            // Process integral part if it is larger than 0:
            if (Number(integral) > 0) {
                zeroCount = 0;
                for (i = 0; i < integral.length; i++) {
                    p = integral.length - i - 1;
                    d = integral.substr(i, 1);
                    quotient = p / 4;
                    modulus = p % 4;
                    if (d == "0") {
                        zeroCount++;
                    }
                    else {
                        if (zeroCount > 0)
                        {
                            outputCharacters += digits[0];
                        }
                        zeroCount = 0;
                        outputCharacters += digits[Number(d)] + radices[modulus];
                    }
                    if (modulus == 0 && zeroCount < 4) {
                        outputCharacters += bigRadices[quotient];
                    }
                }
                outputCharacters += CN_DOLLAR;
            }
            // Process decimal part if there is:
            if (decimal != "") {
                for (i = 0; i < decimal.length; i++) {
                    d = decimal.substr(i, 1);
                    if (d != "0") {
                        outputCharacters += digits[Number(d)] + decimals[i];
                    }
                }
            }
            // Confirm and return the final output string:
            if (outputCharacters == "") {
                outputCharacters = CN_ZERO + CN_DOLLAR;
            }
            if (decimal == "") {
                outputCharacters += CN_INTEGER;
            }
            //outputCharacters = CN_SYMBOL + outputCharacters;
            return outputCharacters;
        }
	};
})((typeof module !== 'undefined')?module: Q, (typeof module !== 'undefined')?'exports':'money',(typeof module !== 'undefined'));