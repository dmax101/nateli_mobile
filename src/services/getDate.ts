import React from 'react';
import config from '../configs';

function getDate() {
    const dateNow = new Date();
    const { locale } = config;

    const completeDate = {
        date: dateNow.toLocaleDateString(locale, { day: 'numeric' }),
        month: dateNow.toLocaleDateString(locale, { month: 'long' }),
        year: dateNow.toLocaleDateString(locale, { year: 'numeric' }),
        weekDay: dateNow.toLocaleDateString(locale, { weekday: 'long' }),
    }

    return completeDate;
}

export default getDate;