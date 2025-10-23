const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100;

const launches = new Map();

// let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission:'Kepler Exploration X',
    rocket: 'Explores IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
};
// launches.set(launch.flightNumber, launch)
saveLaunch(launch);

async function existsLaunchWithId(launchId) {
    // return launches.has(launchId);
    return await launchesDatabase.findOne({
        flightNumber: launchId
    });
};

async function getLatestFlightNumber() {
const latestLaunch = await launchesDatabase
    .findOne()
    .sort('-flightNumber');
    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

async function getAllLaunches() {
    // return Array.from(launches.values());
    return await launchesDatabase.find({},{'_id': 0, '__v': 0});
}

async function saveLaunch(launch) {
    const planet = await planets.findOne({
        keplerName:launch.target,
    });
    if(!planet) {
        throw new Error('No matching planet found');
    }
    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber    
    },launch,{
        upsert: true
    })      
};

// function addNewLaunch(launch) {
//     latestFlightNumber++;
//     launches.set(latestFlightNumber, Object.assign(launch, {
//         success: true,
//         upcoming: true,
//         customers: ['Zero to Mastrey', 'NASA'],
//         flightNumber: latestFlightNumber
//     }));
// }

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        success:true,
        upcoming:true,
        customers: ['Zero to Mastrey', 'NASA'],
        flightNumber:newFlightNumber,
    });

    await saveLaunch(newLaunch);
};

async function abortLaunchById(launchId){
    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;
    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId
    },{
        upcoming:false,
        success:false
    })

   return aborted.modifiedCount === 1;

};

module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch, 
    abortLaunchById
} 