module.exports = {
  apps : [{
    name: 'API',
    script: 'main.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: true,
	  exec_mode:'cluster',
    max_memory_restart: '1G',
    env: {
	    COMMON_VARIABLE:'true'
    },
	  env_development:{
	  
		  NODE_ENV:'development'},
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : '35.200.244.247',
      ref  : 'origin/master',
ssh_options:"StrictHostKeyChecking=no",
	    repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  },

	staging:{
		user:'node',
		host:'212.83.163.1',
		ref:'origin/master',
		repo:'git@github.com:repo.get',
		path:'/var/www/development',
		ssh_options:['StrictHostKeyChecking=no','PasswordAunthentication=no'],
	'	post-depoly':'npm install &&pm2 reload ecosystem.config.js --env development',
		env:{
			NODE_ENV:'staging'
		}
	}
};
