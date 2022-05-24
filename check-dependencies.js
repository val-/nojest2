//const packageLock = require('./client/package-lock.json');
const packageLock = require('./package-lock.json');
const axios = require('axios');

const toxicListUrl = `https://raw.githubusercontent.com/stravnik/toxic-repos/main/data/json/toxic-repos.json`;

loadToxicList(toxicList => {
  doCheck(packageLock, toxicList);
});

function loadToxicList(cb) {
  return axios.get(toxicListUrl).then(res => {
    if (res && res.data && res.data.length) {
      cb(res.data);
    }
  }).catch(error => {
    console.error(error);
  });
}

function doCheck(packageLockObj, toxicList) {

  const plainList = [];
  let toxicCount = 0;
  const checkDependencies = depObj => {
    if (depObj) {
      const depList = Object.keys(depObj);
      depList.forEach(
        depCode => {
          plainList.push({
            name: depCode,
            version: depObj[depCode].version
          });
          if (depObj[depCode].dependencies) {
            checkDependencies(depObj[depCode].dependencies);
          }
        }
      );
    }
  };

  checkDependencies(packageLockObj.dependencies);
  
  console.log('');
  console.log('Toxic list length: ', toxicList.length);
  console.log('Total dependencies: ', plainList.length);

  plainList.forEach(dep => {
    toxicList.forEach(toxicDep => {
      if (
        toxicDep.name === dep.name
      ) {
        toxicCount++;
        console.log('');
        console.log('\x1b[31m%s\x1b[0m', 'Toxic dependency found: ', dep.name);
        console.log('Using version: ', dep.version);
        console.log('Toxic date/time: ', toxicDep.datetime);
        console.log('');
      }
    });
  });

  if (!toxicCount) {
    console.log('\x1b[32m%s\x1b[0m', 'Toxic dependency not found');
  }
  console.log('');

}


