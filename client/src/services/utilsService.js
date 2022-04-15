export const utilsService = {
    formatPrice: value => {
        if (!value) {
            return '';
        } else {
            return formatPriceNum(value) + getUnicodeCurrencySign('RUB');
        }
    }
};

function formatPriceNum(num) {
    let str = num.toFixed(2),
        resultStr = '',
        from,
        to;

    const paths = str.split('.');

    str = paths[0];

    for (let i = str.length; i > 0; i -= 3) {
        from = i - 3;
        to = 3;

        if (from < 0) {
            to = from + 3;
            from = 0;
        }

        resultStr = `${str.substr(from, to)} ${resultStr}`;
    }

    if (paths[1] && paths[1] !== "0" && paths[1] !== "00") {
        if (paths[1].length === 1) {
            paths[1] = `${paths[1] }0`;
        }

        resultStr = `${resultStr.trim() }.${ paths[1] } `;
    }

    return resultStr;
}


function getUnicodeCurrencySign(currencyCode) {
    const signs = {
        'RUB': '₽',
        'THB': '&#3647;',
        'CRC': '&#8353;',
        'GHC': '&#8373;',
        'VND': '&#8363;',
        'EUR': '&#8364;',
        'GBP': '&#163;',
        'TRY': '&#8356;',
        'TRL': '&#8356;',
        'PYG': '&#8370;',
        'LAK': '&#8365;',
        'NGN': '&#8358;',
        'ARS': '&#8369;',
        'CLP': '&#8369;',
        'COP': '&#8369;',
        'CUP': '&#8369;',
        'PHP': '&#8369;',
        'UYU': '&#8369;',
        'CUC': '&#8369;',
        'ARA': '&#8369;',
        'MXN': '&#8369;',
        'USD': '&#36;',
        'MNT': '&#8366;',
        'KRW': '&#8361;',
        'KPW': '&#8361;',
        'JPY': '&#165;',
        'UAH': '&#8372;',
        'KZT': '&#8376;',
        'KHR': '&#6107;',
        'YER': '&#65020;',
        'IRR': '&#65020;',
        'OMR': '&#65020;',
        'QAR': '&#65020;',
        'INR': '&#8377;',
        'GEL': '&#8382;',
        'TJS': 'C.'
    };

    return signs[currencyCode] || '';
}