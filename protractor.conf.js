exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['specs/*.js'],
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true
};
