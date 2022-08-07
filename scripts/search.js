require('dotenv').config();

const inquirer = require('inquirer');
const getRepositories = require('./http/getRepositories.js');

// define normalized schema
function Item ({
  name, created_at, html_url, language,
}) {
  this.language = language;
  this.name = name;
  this.createdAt = created_at;
  this.htmUrl = html_url;
}

// Create a list op questions
(async () => {
  const questions = [
    {
      type: 'list',
      name: 'count',
      message: 'How many repos do you want to see.',
      choices: [
        {
          key: 'ten',
          name: '10 repositories',
          value: 10
        },
        {
          key: 'fifty',
          name: '50 repositories',
          value: 50
        },
        {
          key: 'hundred',
          name: '100 repositories',
          value: 100
        },
        {
          key: 'all',
          name: 'All available repositories'
        }
      ],
    },
    {
      type: 'input',
      name: 'date',
      message: 'From what date? (Format YYYY-MM-DD)',
      validate(answer) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(answer)) {
          return 'Please use format YYYY-MM-DD'
        }
        if (new Date(answer) === 'Invalid Date') {
          return `${answer} is not a valid date`;
       }
        return true;
      }
    },
  ];

  // start inquirer form
  inquirer.prompt(questions).then(async (answers) => {
    const data = await getRepositories(answers);

    // add event data to array
    const tableData = data.items.reduce((acc, obj) => [...acc, new Item(obj)], []);

    // output data
    console.table(tableData);

    process.exit();
  });
})();
