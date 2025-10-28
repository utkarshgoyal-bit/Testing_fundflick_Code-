const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const scales = ['', 'thousand', 'lakh', 'crore'];

const numberToWords = (num: number, asPostfix: boolean = false): string => {
    // Handle zero case
    if (num === 0) return 'zero';

    // Convert number to string and remove decimal points
    const numStr = num.toString().split('.')[0];
    
    // Handle Indian number system (groups of 2 after first 3)
    const groups = [];
    let i = numStr.length;
    
    while (i > 0) {
        if (groups.length === 0) {
            // First group from right - take up to 3 digits
            groups.unshift(numStr.slice(Math.max(0, i - 3), i));
            i -= 3;
        } else {
            // Subsequent groups - take 2 digits
            groups.unshift(numStr.slice(Math.max(0, i - 2), i));
            i -= 2;
        }
    }

    // Convert each group to words
    const groupWords = groups.map((group, index) => {
        if (group === '000' || group === '00') return '';
        
        const groupNum = parseInt(group);
        let result = '';

        // Handle hundreds
        if (group.length === 3) {
            const hundreds = Math.floor(groupNum / 100);
            if (hundreds > 0) {
                result += ones[hundreds] + ' hundred ';
            }
        }

        // Handle tens and ones
        const tensAndOnes = groupNum % 100;
        if (tensAndOnes > 0) {
            if (tensAndOnes < 10) {
                result += ones[tensAndOnes];
            } else if (tensAndOnes < 20) {
                result += teens[tensAndOnes - 10];
            } else {
                const tensDigit = Math.floor(tensAndOnes / 10);
                const onesDigit = tensAndOnes % 10;
                result += tens[tensDigit];
                if (onesDigit > 0) {
                    result += '-' + ones[onesDigit];
                }
            }
        }

        // Add scale (thousand, lakh, crore)
        if (result && scales[groups.length - 1 - index]) {
            result += ' ' + scales[groups.length - 1 - index];
        }

        return result.trim();
    });

    // Join all parts and clean up
    const words = groupWords
        .filter(word => word !== '')
        .join(' ')
        .toUpperCase()
        .trim();

    // Add "only" as postfix if requested
    return asPostfix ? `${words} ONLY` : words;
}

export default numberToWords