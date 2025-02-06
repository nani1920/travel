const { faker, fakerEN_IN } = require('@faker-js/faker');
// faker.locale = 'en';
const moment = require('moment');
require('dotenv').config()

// Local files //
const Repositories = require('../repositories');
const { jwpTaskTypes, jwpTaskStatus } = require('../helpers/constants');
// End Local files//


const getRandomInt = (max) => {
    return Math.floor((Math.random() * Math.floor(max) / 5));
}

module.exports = async () => {
    const _jobSahayaksRepository = new Repositories.JobSahayaksRepository()
    let data = [];

    for (let index = 1; index < 2; index++) {
        const jwpTask = {
            companyName: faker.company.name(),
            companyLocation: fakerEN_IN.location.city(),
            dateOfArrival: faker.helpers.arrayElement([new Date(moment().add(10, "days")), new Date(moment().add(15, "days")), new Date(moment().add(30, "days"))]),
            title: faker.helpers.arrayElement(['13 logon ka mumbai se delhi tak travel on 10 DEC 2023', '2 logon ka noida se mumbai tak travel on 11 DEC 2023']),
            jobTitle: faker.helpers.arrayElement(['Lab Assistant', 'Fitter', 'Plumber', 'Electrician']),
            taskType: jwpTaskTypes.SEND,
            jobId: '10536',
            taskId: 'J10536-T1',
            jobSahayak: "658169d7f83cff2ae85d15d2", //old delhi
            // jobSahayak: "65447e87555ce3558461aeba", //new delhi
            status: jwpTaskStatus.NEW,
            listOfCandidates: [],
        }
        data.push({
            ...jwpTask,
            location: {
                coordinates: [77.1398964, 19.7142536]
            },
        });

    }
    console.log(JSON.stringify(data));

    return _jobSahayaksRepository.createMultipleJwpTasks(data);
};

