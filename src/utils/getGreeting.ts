import React from 'react';

function getGreeting() {
    try {
        let greeting = '';
        let hour = new Date().getHours(); //Current Hours
        if (hour >= 0 && hour < 12) {
            greeting = 'Bom dia,';
        } else if (hour < 18) {
            greeting = 'Boa tarde,';
        } else {
            greeting = 'Boa noite,';
        }
        console.log(greeting);
        
        return greeting;
    } catch (error) {
        console.log('Não foi possível Saudar');
        console.log(error);
    }

}

export default getGreeting;